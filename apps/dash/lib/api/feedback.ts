import { internal_runWithWaitUntil as waitUntil } from 'next/dist/server/web/internal-edge-wait-until';
import { withFeedbackAuth, withProjectAuth } from '../auth';
import {
  FeedbackProps,
  FeedbackTagProps,
  FeedbackWithUserInputProps,
  FeedbackWithUserProps,
} from '../types';
import { isValidEmail } from '../utils';
import { sendDiscordNotification, sendSlackNotification } from './integrations';
import { database } from '@repo/database';

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

    // Create feedback
    const feedback = await database.feedback.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        raw_tags: data.raw_tags,
        project_id: project.id,
        user_id: data.user_id || user.id
      },
      include: {
        profiles: true
      }
    });

    // Handle integrations
    const projectConfig = await database.project_configs.findUnique({
      where: { project_id: project.id }
    });

    if (projectConfig) {
      if (projectConfig.integration_discord_status) {
        waitUntil(() => sendDiscordNotification(feedback, project, projectConfig));
      }
      
      if (projectConfig.integration_slack_status) {
        waitUntil(() => sendSlackNotification(feedback, project, projectConfig));
      }
    }

    // Create notification
    waitUntil(() => 
      database.notifications.create({
        data: {
          type: 'POST',
          project_id: project.id,
          initiator_id: user.id,
          feedback_id: feedback.id
        }
      })
    );

    return { data: feedback, error: null };
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
        raw_tags: data.raw_tags || feedback.raw_tags
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
      ...feedback.profiles,
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
export const getFeedbackUpvotersById = withFeedbackAuth<ProfileProps['Row'][]>(
  async (user, supabase, feedback, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get feedback upvoters
    const { data: upvoters, error: upvotersError } = await supabase
      .from('feedback_upvoters')
      .select('profiles (*), created_at')
      .eq('feedback_id', feedback!.id)
      .order('created_at', { ascending: false });

    // Check for errors
    if (upvotersError) {
      return { data: null, error: { message: upvotersError.message, status: 500 } };
    }

    // Restructure upvoters
    const restructuredData = upvoters.map((item) => {
      return item.profiles;
    }) as ProfileProps['Row'][];

    // Return upvoters
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
      where: { project_id: project.id }
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
export const getAllProjectFeedback = withProjectAuth<FeedbackWithUserProps[]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get feedback and also include complete user object
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('*, user:user_id (*)')
      .eq('project_id', project!.id);

    // Check for errors
    if (feedbackError) {
      return { data: null, error: { message: feedbackError.message, status: 500 } };
    }

    // Get upvoters
    const { data: userUpvotes, error: userUpvotesError } = await supabase
      .from('feedback_upvoters')
      .select()
      .eq('profile_id', user!.id);

    // Check for errors
    if (userUpvotesError) {
      return { data: null, error: { message: userUpvotesError.message, status: 500 } };
    }

    // Convert feedback to unknown type and then to test type
    const feedbackData = feedback as unknown as FeedbackWithUserProps[];

    // Convert raw tags to tags and remove raw tags
    feedbackData.forEach((feedback) => {
      feedback.tags = feedback.raw_tags as unknown as FeedbackTagProps['Row'][];
    });

    // Get array of upvoted feedback ids
    const upvotedFeedbackIds = userUpvotes.map((upvoter) => upvoter.feedback_id);

    // Add has upvoted
    if (upvotedFeedbackIds.length > 0) {
      feedbackData.forEach((feedback) => {
        feedback.has_upvoted = upvotedFeedbackIds.includes(feedback.id);
      });
    }

    // Return feedback
    return { data: feedbackData, error: null };
  }
);

// Create feedback tag
export const createFeedbackTag = (
  projectSlug: string,
  data: { name: string; color: string },
  cType: 'server' | 'route'
) =>
  withProjectAuth<FeedbackTagProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Make sure tag doesn't already exist
    const { data: tagExists, error: tagExistsError } = await supabase
      .from('feedback_tags')
      .select()
      .eq('project_id', project!.id)
      .eq('name', data.name);

    // Check for errors
    if (tagExistsError) {
      return { data: null, error: { message: tagExistsError.message, status: 500 } };
    }

    // Check if tag exists
    if (tagExists && tagExists.length > 0) {
      return { data: null, error: { message: 'tag with same name already exists.', status: 400 } };
    }

    // Create tag
    const { data: tag, error: tagError } = await supabase
      .from('feedback_tags')
      .insert({
        name: data.name,
        color: data.color,
        project_id: project!.id,
      })
      .select()
      .single();

    // Check for errors
    if (tagError) {
      return { data: null, error: { message: tagError.message, status: 500 } };
    }

    // Return feedback
    return { data: tag, error: null };
  })(projectSlug, cType);

// Delete feedback tag by name
export const deleteFeedbackTagByName = (projectSlug: string, tagName: string, cType: 'server' | 'route') =>
  withProjectAuth<FeedbackTagProps['Row']>(async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Check if tag exists
    const { data: tag, error: tagError } = await supabase
      .from('feedback_tags')
      .select()
      .eq('project_id', project!.id)
      .eq('name', tagName)
      .single();

    // Check for errors
    if (tagError) {
      return { data: null, error: { message: 'tag not found.', status: 404 } };
    }

    // Delete tag
    const { data: deletedTag, error: deleteError } = await supabase
      .from('feedback_tags')
      .delete()
      .eq('id', tag.id)
      .select()
      .single();

    // Check for errors
    if (deleteError) {
      return { data: null, error: { message: deleteError.message, status: 500 } };
    }

    // Return success
    return { data: deletedTag, error: null };
  })(projectSlug, cType);

// Get all project feedback tags
export const getAllFeedbackTags = withProjectAuth<FeedbackTagProps['Row'][]>(
  async (user, supabase, project, error) => {
    // If any errors, return error
    if (error) {
      return { data: null, error };
    }

    // Get all feedback tags for project
    const { data: tags, error: tagsError } = await supabase
      .from('feedback_tags')
      .select()
      .eq('project_id', project!.id);

    // Check for errors
    if (tagsError) {
      return { data: null, error: { message: tagsError.message, status: 500 } };
    }

    // Return tags
    return { data: tags, error: null };
  }
);
