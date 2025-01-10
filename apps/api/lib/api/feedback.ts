import { internal_runWithWaitUntil as waitUntil } from 'next/dist/server/web/internal-edge-wait-until';
import { withFeedbackAuth, withProjectAuth } from '../auth';
import {
  FeedbackWithUserInputProps,
  FeedbackWithUserProps,
} from '../types';
import { isValidEmail } from '../utils';
import { sendDiscordNotification, sendSlackNotification } from './integrations';
import { database } from '@repo/database';
import { InputJsonValue } from '@prisma/client/runtime/library';

// Create a feedback post
export const createFeedback = (projectSlug: string, data: FeedbackWithUserInputProps) =>
  withProjectAuth(async (user, project) => {
    // Check if tags exist
    if (data.tags && data.tags.length > 0) {
      const projectTags = await database.feedback_tags.findMany({
        where: { project_id: project.id }
      });

      if (!projectTags || projectTags.length === 0) {
        return { data: null, error: 'No tags found for project' };
      }

      // Validate tags
      const invalidTags = data.tags.filter(
        tag => !projectTags.some(t => t.id === tag)
      );

      if (invalidTags.length > 0) {
        return {
          data: null,
          error: `Invalid tags: ${invalidTags.join(', ')}`
        };
      }

      // Convert tags to raw tags format
      data.raw_tags = projectTags
        .filter(tag => data.tags!.includes(tag.id))
        .map(tag => ({ name: tag.name, color: tag.color }));
    }

    // Handle user creation/update
    if (data.user) {
      if (!data.user.email || !isValidEmail(data.user.email)) {
        return { data: null, error: 'Invalid email provided' };
      }

      const widgetEmail = data.user.email.replace('@', '+widget@');
      
      let userProfile = await database.profiles.findFirst({
        where: { email: widgetEmail }
      });

      if (!userProfile) {
        userProfile = await database.profiles.create({
          data: {
            email: widgetEmail,
            first_name: data.user.first_name || data.user.email.split('@')[0],
            last_name: data.user.last_name || ''
          }
        });
      } else if (data.user.first_name && data.user.first_name !== userProfile.first_name) {
        userProfile = await database.profiles.update({
          where: { id: userProfile.id },
          data: { 
            first_name: data.user.first_name,
            last_name: data.user.last_name || ''
          }
        });
      }

      data.user_id = userProfile.id;
    }

    // Validate content
    if (data.description.replace(/<[^>]*>?/gm, '').length === 0) {
      return { data: null, error: 'Feedback description cannot be empty' };
    }

    // Create feedback with proper type
    const feedbackData = await database.feedback.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        raw_tags: data.raw_tags as InputJsonValue[],
        project_id: project.id,
        user_id: data.user_id || user.id
      },
      include: {
        profiles: true,
        feedback_upvoters: {
          where: { profile_id: user.id }
        }
      }
    });

    // Transform to FeedbackWithUserProps
    const feedbackWithUser: FeedbackWithUserProps = {
      ...feedbackData,
      user: {
        ...feedbackData.profiles,
        isTeamMember: true // Creator is always team member
      },
      has_upvoted: false,
      tags: feedbackData.raw_tags as Array<{ name: string; color: string }>
    };


    // Handle integrations
    const projectConfig = await database.project_configs.findUnique({
      where: { project_id: project.id }
    });

    if (projectConfig) {
      if (projectConfig.integration_discord_status) {
        waitUntil(() => sendDiscordNotification(feedbackWithUser, project, projectConfig));
      }
      
      if (projectConfig.integration_slack_status) {
        waitUntil(() => sendSlackNotification(feedbackWithUser, project, projectConfig));
      }
    }

    // Create notification
    waitUntil(() => 
      database.notifications.create({
        data: {
          type: 'post',
          project_id: project.id,
          initiator_id: user.id,
          feedback_id: feedbackData.id
        }
      })
    );

    return { data: feedbackData, error: null };
  })(projectSlug, true);

// Update feedback post
export const updateFeedbackByID = (
  id: string,
  projectSlug: string,
  data: FeedbackWithUserInputProps
) =>
  withFeedbackAuth(async (user, feedback, project) => {
    // Check if tags exist
    if (data.tags !== undefined) {
      const projectTags = await database.feedback_tags.findMany({
        where: { project_id: project.id }
      });

      if (!projectTags.length) {
        return { data: null, error: 'No tags found for project' };
      }

      // Validate tags
      const invalidTags = data.tags.filter(
        tag => !projectTags.some(t => t.id === tag)
      );

      if (invalidTags.length) {
        return { data: null, error: `Invalid tags: ${invalidTags.join(', ')}` };
      }

      // Convert to raw tags format
      data.raw_tags = projectTags
        .filter(tag => data.tags!.includes(tag.id))
        .map(tag => ({ name: tag.name, color: tag.color }));
    }

    // Update feedback
    const updatedFeedback = await database.feedback.update({
      where: { id: feedback.id },
      data: {
        title: data.title || feedback.title,
        description: data.description || feedback.description,
        status: data.status || feedback.status,
        raw_tags: data.raw_tags as InputJsonValue[] || feedback.raw_tags as InputJsonValue[]
      }
    });

    return { data: updatedFeedback, error: null };
  })(id, projectSlug);

// Get feedback by ID
export const getFeedbackByID = withFeedbackAuth(async (user, feedback, project) => {
  // Get upvoters count
  const upvoters = await database.feedback_upvoters.findMany({
    where: { feedback_id: feedback.id }
  });

  // Check if user has upvoted
  const hasUpvoted = upvoters.some(upvoter => upvoter.profile_id === user.id);

  // Get team members for isTeamMember check
  const teamMember = await database.project_members.findFirst({
    where: {
      project_id: project.id,
      member_id: feedback.user_id
    }
  });

  const feedbackWithUser = {
    ...feedback,
    user: {
      ...user,
      isTeamMember: !!teamMember
    },
    has_upvoted: hasUpvoted,
    tags: feedback.raw_tags
  };

  return { data: feedbackWithUser, error: null };
});

// Delete feedback
export const deleteFeedbackByID = withFeedbackAuth(async (user, feedback, project) => {
  try {
    const deletedFeedback = await database.feedback.delete({
      where: { id: feedback.id }
    });

    return { data: deletedFeedback, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to delete feedback' };
  }
});

// Get feedback upvoters
export const getFeedbackUpvotersById = withFeedbackAuth(
  async (user, feedback, project) => {
    const upvoters = await database.feedback_upvoters.findMany({
      where: { feedback_id: feedback.id },
      include: {
        profiles: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const restructuredData = upvoters.map(item => item.profiles);
    return { data: restructuredData, error: null };
  }
);

// Upvote feedback by ID
export const upvoteFeedbackByID = (
  id: string,
  projectSlug: string,
  hasUserUpvoted = false,
  isAnonymous = false
) =>
  withFeedbackAuth(async (user, feedback, project) => {
    // Get project config for anon voting check
    const projectConfig = await database.project_configs.findUnique({
      where: {
       project_id: project.id 
      }
    });

    if (!projectConfig) {
      return { data: null, error: 'Project config not found' };
    }

    // Check if anonymous upvoting is enabled
    if (!projectConfig.feedback_allow_anon_upvoting && isAnonymous) {
      return { data: null, error: 'Anonymous upvoting is not allowed' };
    }

    // Handle upvoting for logged in users
    if (!isAnonymous) {
      const existingUpvote = await database.feedback_upvoters.findFirst({
        where: {
          profile_id: user.id,
          feedback_id: feedback.id
        }
      });

      // Toggle upvote
      if (existingUpvote) {
        await database.feedback_upvoters.delete({
          where: { id: existingUpvote.id }
        });
      } else {
        await database.feedback_upvoters.create({
          data: {
            profile_id: user.id,
            feedback_id: feedback.id
          }
        });
      }

      hasUserUpvoted = !!existingUpvote;
    }

    // Update feedback upvotes count
    const updatedFeedback = await database.feedback.update({
      where: { id: feedback.id },
      data: {
        upvotes: {
          [hasUserUpvoted ? 'decrement' : 'increment']: 1
        }
      },
      include: {
        profiles: true
      }
    });

    return { data: updatedFeedback, error: null };
  })(id, projectSlug);
  
// Get all feedback posts
export const getAllProjectFeedback = withProjectAuth(async (user, project) => {
  // Get all feedback with profiles and upvoters
  const feedback = await database.feedback.findMany({
    where: { project_id: project.id },
    include: {
      profiles: true,
      feedback_upvoters: {
        where: { profile_id: user.id }
      }
    }
  });

  // Get team members for isTeamMember check
  const teamMembers = await database.project_members.findMany({
    where: { project_id: project.id }
  });

  // Transform feedback data
  const feedbackData = feedback.map(f => ({
    ...f,
    user: {
      ...f.profiles,
      isTeamMember: teamMembers.some(m => m.member_id === f.user_id)
    },
    has_upvoted: f.feedback_upvoters.length > 0,
    tags: f.raw_tags
  }));

  return { data: feedbackData, error: null };
});

// Create feedback tag
export const createFeedbackTag = (
  projectSlug: string,
  data: { name: string; color: string }
) =>
  withProjectAuth(async (user, project) => {
    // Check if tag exists
    const existingTag = await database.feedback_tags.findFirst({
      where: {
        project_id: project.id,
        name: data.name
      }
    });

    if (existingTag) {
      return { data: null, error: 'Tag with same name already exists' };
    }

    // Create tag
    const tag = await database.feedback_tags.create({
      data: {
        name: data.name,
        color: data.color,
        project_id: project.id
      }
    });

    return { data: tag, error: null };
  })(projectSlug);


// Delete feedback tag by name
export const deleteFeedbackTagByName = (projectSlug: string, tagName: string) =>
  withProjectAuth(async (user, project) => {
    // Check if tag exists
    const tag = await database.feedback_tags.findFirst({
      where: {
        project_id: project.id,
        name: tagName
      }
    });

    if (!tag) {
      return { data: null, error: 'Tag not found' };
    }

    // Delete tag
    try {
      const deletedTag = await database.feedback_tags.delete({
        where: { id: tag.id }
      });

      return { data: deletedTag, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to delete tag' };
    }
  })(projectSlug);

// Get all project feedback tags
export const getAllFeedbackTags = withProjectAuth(async (user, project) => {
  try {
    const tags = await database.feedback_tags.findMany({
      where: { project_id: project.id },
      orderBy: { created_at: 'desc' }
    });

    return { data: tags, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch tags' };
  }
});