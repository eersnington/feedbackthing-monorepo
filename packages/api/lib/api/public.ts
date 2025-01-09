import { withProjectAuth } from '@/lib/auth';
import {
  ChangelogWithAuthorProps,
  FeedbackWithUserProps,
} from '@/lib/types';
import { profiles, projects } from '@prisma/client';
import { database } from '@repo/database';

// Get Public Project Changelogs
export const getPublicProjectChangelogs = (slug: string) => 
  withProjectAuth(async (user: profiles, project: projects) => {
    const changelogs = await database.changelogs.findMany({
      where: {
        project_id: project.id,
        published: true
      },
      include: {
        profiles: true
      }
    });

    const restructuredData: ChangelogWithAuthorProps[] = changelogs.map((changelog) => ({
      ...changelog,
      author: changelog.profiles
    }));

    return { data: restructuredData, error: null };
  })(slug, true);


// Get Public Project Feedback
export const getPublicProjectFeedback = (slug: string) =>
  withProjectAuth(async (user: profiles, project: projects) => {
    const feedback = await database.feedback.findMany({
      where: {
        project_id: project.id
      },
      include: {
        profiles: true,
        // feedback_tags: true
      }
    });

    const teamMembers = await database.project_members.findMany({
      where: {
        project_id: project.id
      }
    });

    let feedbackData: FeedbackWithUserProps[] = feedback.map(f => ({
      ...f,
      user: {
        ...f.profiles,
        isTeamMember: teamMembers.some(m => m.member_id === f.user_id)
      },
      tags: f.raw_tags as any,
      has_upvoted: false
    }));

    if (user) {
      // get upvoted feedback
      const upvotes = await database.feedback_upvoters.findMany({
        where: {
          profile_id: user.id,
          feedback_id: {
            in: feedback.map(f => f.id)
          }
        }
      });

      feedbackData = feedbackData.map(f => ({
        ...f,
        has_upvoted: upvotes.some(u => u.feedback_id === f.id)
      }));
    }

    return { data: feedbackData, error: null };
  })(slug, true);

// Subscribe to project changelogs  
export const subscribeToProjectChangelogs = (slug: string, email: string) =>
  withProjectAuth(async (user: profiles, project: projects) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      return { data: null, error: { message: 'Invalid email', status: 400 } };
    }

    const existing = await database.changelog_subscribers.findFirst({
      where: {
        project_id: project.id,
        email
      }
    });

    if (existing) {
      return { data: null, error: { message: 'Already subscribed', status: 400 } };
    }

    const subscriber = await database.changelog_subscribers.create({
      data: {
        project_id: project.id,
        email
      }
    });

    return { data: subscriber, error: null };
  })(slug, true);


// Unsubscribe from project changelogs
export const unsubscribeFromProjectChangelogs = (slug: string, subId: string) =>
  withProjectAuth(async (user: profiles, project: projects) => {
    const subscriber = await database.changelog_subscribers.findFirst({
      where: {
        id: subId,
        project_id: project.id
      }
    });

    if (!subscriber) {
      return { data: null, error: { message: 'Subscriber not found', status: 404 } };
    }

    await database.changelog_subscribers.delete({
      where: { id: subId }
    });

    return { data: true, error: null };
  })(slug, true);