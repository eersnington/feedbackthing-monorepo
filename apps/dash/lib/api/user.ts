import { put } from '@vercel/blob';
import { database } from '@repo/database';
import { withUserAuth } from '../auth';
import { NotificationProps } from '../types';
import type { profiles, projects } from '@prisma/client';

// Get current user
export const getCurrentUser = withUserAuth<profiles>(async (user, error) => {
  if (error) return { data: null, error };
  if (!user) return { data: null, error: { message: 'user not found.', status: 404 } };

  const profile = await database.profiles.findUnique({
    where: { id: user.id }
  });

  if (!profile) {
    return { data: null, error: { message: 'Profile not found', status: 404 } };
  }

  return { data: profile, error: null };
});

// Get all projects for a user
export const getUserProjects = withUserAuth<projects[]>(async (user, error) => {
  if (error) return { data: null, error };

  const projects = await database.project_members.findMany({
    where: { member_id: user!.id },
    include: { projects: true }
  });

  return { 
    data: projects.map(p => p.projects), 
    error: null 
  };
});

// Update user profile
export const updateUserProfile = (
  data: { first_name?: string; last_name?: string; avatar_url?: string }
) => withUserAuth<profiles>(async (user, error) => {
  if (error) return { data: null, error };
  if (!user) return { data: null, error: { message: 'User not found', status: 404 } };

  // Handle avatar upload to Vercel Blob if provided
  let avatarUrl = data.avatar_url;
  if (data.avatar_url?.startsWith('data:image')) {
    try {
      const blob = await put(`avatars/${user.id}`, data.avatar_url, {
        access: 'public',
        contentType: 'image/png'
      });
      avatarUrl = blob.url;
    } catch (error) {
      return { data: null, error: { message: 'Failed to upload avatar', status: 500 } };
    }
  }

  // Update profile
  const updatedProfile = await database.profiles.update({
    where: { id: user.id },
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      avatar_url: avatarUrl
    }
  });

  return { data: updatedProfile, error: null };
});

// Get user's notifications
export const getUserNotifications = withUserAuth<NotificationProps[]>(async (user, error) => {
  if (error) return { data: null, error };
  if (!user) return { data: null, error: { message: 'User not found', status: 404 } };

  const notifications = await database.notifications.findMany({
    where: {
      projects: {
        project_members: {
          some: { member_id: user.id }
        }
      },
      NOT: { initiator_id: user.id }
    },
    include: {
      projects: {
        select: { name: true, slug: true, icon: true }
      },
      profiles: {
        select: { first_name: true, last_name: true }
      }
    }
  });

  return { data: notifications as NotificationProps[], error: null };
});

// Archive notification
export const archiveUserNotification = (
  notificationId: string,
  archived: boolean
) => withUserAuth<NotificationProps>(async (user, error) => {
  if (error) return { data: null, error };
  if (!user) return { data: null, error: { message: 'User not found', status: 404 } };

  const notification = await database.notifications.findUnique({
    where: { id: notificationId },
    include: {
      projects: {
        include: {
          project_members: true
        }
      }
    }
  });

  if (!notification) {
    return { data: null, error: { message: 'Notification not found', status: 404 } };
  }

  // Check membership
  const isMember = notification.projects.project_members.some(
    member => member.member_id === user.id
  );

  if (!isMember) {
    return { data: null, error: { message: 'Unauthorized', status: 403 } };
  }

  // Update archived status
  const updatedNotification = await database.notifications.update({
    where: { id: notificationId },
    data: {
      has_archived: archived 
        ? { push: user.id }
        : { set: notification.has_archived.filter(id => id !== user.id) }
    },
    include: {
      projects: {
        select: { name: true, slug: true, icon: true }
      },
      profiles: {
        select: { first_name: true, last_name: true }
      }
    }
  });

  return { data: updatedNotification as NotificationProps, error: null };
});