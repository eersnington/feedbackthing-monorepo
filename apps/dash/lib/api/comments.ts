import { withFeedbackAuth } from '../auth';
import { database } from '@repo/database';
import type { profiles, projects, feedback, feedback_comments } from '@prisma/client';
import type { FeedbackCommentWithUserProps } from '../types';

// Create comment
export const createCommentForFeedbackById = (
  data: Omit<feedback_comments, 'id' | 'created_at'>,
  projectSlug: string
) =>
  withFeedbackAuth(async (user: profiles, feedbackItem: feedback, project: projects) => {
    if (data.reply_to_id) {
      const replyToComment = await database.feedback_comments.findUnique({
        where: { id: data.reply_to_id }
      });

      if (!replyToComment) {
        return { data: null, error: 'Comment not found' };
      }
    }

    if (data.content.replace(/<[^>]*>?/gm, '').length === 0) {
      return { data: null, error: 'Comment cannot be empty' };
    }

    const comment = await database.feedback_comments.create({
      data: {
        feedback_id: data.feedback_id,
        user_id: user.id,
        content: data.content,
        reply_to_id: data.reply_to_id
      }
    });

    await database.feedback.update({
      where: { id: feedbackItem.id },
      data: { comment_count: { increment: 1 } }
    });

    await database.notifications.create({
      data: {
        type: 'comment',
        project_id: project.id,
        initiator_id: user.id,
        feedback_id: data.feedback_id,
        comment_id: comment.id
      }
    });

    return { data: comment, error: null };
  })(data.feedback_id, projectSlug);

// Get comments
export const getCommentsForFeedbackById = withFeedbackAuth(
  async (user: profiles, feedbackItem: feedback, project: projects) => {
    // Get comments with profiles
    const comments = await database.feedback_comments.findMany({
      where: { feedback_id: feedbackItem.id },
      include: { profiles: true }
    });

    // Get team members for isTeamMember check
    const teamMembers = await database.project_members.findMany({
      where: { project_id: project.id }
    });

    // Map comments with user data and check upvotes from upvoters array
    let feedbackData = comments.map(comment => ({
      ...comment,
      user: {
        ...comment.profiles,
        isTeamMember: teamMembers.some(m => m.member_id === comment.user_id)
      },
      has_upvoted: user ? comment.upvoters.includes(user.id) : false,
      replies: []
    }));

    // Structure comments with replies
    const commentsWithReplies = feedbackData.reduce((acc, comment) => {
      if (!comment.reply_to_id) {
        acc.push({
          ...comment,
          replies: feedbackData.filter(c => c.reply_to_id === comment.id)
        });
      }
      return acc;
    }, [] as FeedbackCommentWithUserProps[]);

    return { data: commentsWithReplies, error: null };
  }
);

// Delete comment for feedback by id
export const deleteCommentForFeedbackById = (
  commentId: string,
  feedbackId: string,
  projectSlug: string
) =>
  withFeedbackAuth(async (user, feedbackItem, project) => {
    const comment = await database.feedback_comments.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return { data: null, error: 'Comment not found' };
    }

    if (comment.user_id !== user.id) {
      return { data: null, error: 'Only the author can delete this comment' };
    }

    // Use transaction to ensure both operations complete
    const [deletedComment] = await database.$transaction([
      database.feedback_comments.delete({
        where: { id: commentId }
      }),
      database.feedback.update({
        where: { id: feedbackItem.id },
        data: { comment_count: { decrement: 1 } }
      })
    ]);

    return { data: deletedComment, error: null };
  })(feedbackId, projectSlug);

// Upvote comment for feedback by id
export const upvoteCommentForFeedbackById = (
  commentId: string,
  feedbackId: string,
  projectSlug: string
) =>
  withFeedbackAuth(async (user, feedbackItem, project) => {
    const comment = await database.feedback_comments.findUnique({
      where: { id: commentId },
      include: { profiles: true }
    });

    if (!comment) {
      return { data: null, error: 'Comment not found' };
    }

    const isUserUpvoted = comment.upvoters.includes(user.id);
    const newUpvoters = isUserUpvoted
      ? comment.upvoters.filter(id => id !== user.id)
      : [...comment.upvoters, user.id];

    const updatedComment = await database.feedback_comments.update({
      where: { id: commentId },
      data: {
        upvoters: newUpvoters,
        upvotes: BigInt(newUpvoters.length)
      },
      include: { profiles: true }
    });

    // Transform to FeedbackCommentWithUserProps
    const teamMember = await database.project_members.findFirst({
      where: {
        project_id: project.id,
        member_id: updatedComment.user_id
      }
    });

    return {
      data: {
        ...updatedComment,
        user: {
          ...updatedComment.profiles,
          isTeamMember: !!teamMember
        },
        has_upvoted: newUpvoters.includes(user.id),
        replies: []
      },
      error: null
    };
  })(feedbackId, projectSlug);