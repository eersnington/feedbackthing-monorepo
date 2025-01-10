import { internal_runWithWaitUntil as waitUntil } from 'next/dist/server/web/internal-edge-wait-until';
import { sendBatchEmails } from '@/emails';
import ChangelogEmail from '@/emails/changelog-email';
import { withProjectAuth } from '@/lib/auth';
import { formatRootUrl, isSlugValid } from '../utils';
import type { changelogs, profiles, projects } from '@prisma/client';
import { put } from '@vercel/blob';
import { database } from '@repo/database';

// Send changelog email
const sendChangelogEmail = async (
  subscribers: { id: string; email: string }[],
  project: projects,
  data: changelogs,
  user: profiles
) => {
  if (subscribers.length === 0) {
    return { data: null, error: null };
  }

  const subscriberGroups = subscribers.reduce<string[][]>((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 100);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item.email);
    return resultArray;
  }, []);

  subscriberGroups.forEach(async (group) => {
    const emails = group.map((email) =>
      ChangelogEmail({
        subId: subscribers.find((subscriber) => subscriber.email === email)!.id,
        projectSlug: project.slug,
        changelog: {
          title: data.title,
          summary: data.summary!,
          content: data.content!,
          image: data.image!,
          publish_date: data.publish_date?.toDateString() || new Date().toDateString(),
          slug: data.slug,
          author: {
            full_name: `${user.first_name} ${user.last_name}`,
            avatar_url: user.avatar_url!,
          },
        },
      })
    );

    const { error: emailError } = await sendBatchEmails({
      emails: group,
      subject: `${project.name} Update: ${data.title}`,
      headers: group.map((email) => ({
        'List-Unsubscribe': formatRootUrl(
          project.slug,
          `/changelogs/unsubscribe?subId=${subscribers.find((subscriber) => subscriber.email === email)!.id}`
        ),
      })),
      reactEmails: emails,
    });

    if (emailError) {
      return { data: null, error: emailError };
    }
  });
};

// Create Changelog
export const createChangelog = (slug: string, data: Omit<changelogs, 'id' | 'created_at'>) =>
  withProjectAuth(async (user, project) => {
    if (data.image?.startsWith('data:image')) {
      try {
        const blob = await put(`changelogs/${project.id}/${Math.random().toString(36).slice(7)}`, data.image, {
          access: 'public',
          contentType: 'image/png'
        });
        data.image = blob.url;
      } catch (error) {
        return { data: null, error: 'Failed to upload image' };
      }
    }

    if (data.title && !isSlugValid(data.title)) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/ /g, '-');
    }

    try {
      const changelog = await database.changelogs.create({
        data: {
          project_id: project.id,
          slug: data.slug,
          author_id: user.id,
          title: data.title,
          summary: data.summary,
          content: data.content,
          image: data.image,
          publish_date: data.publish_date,
          published: data.published,
        },
        include: {
          profiles: true
        }
      });

      if (data.published) {
        waitUntil(async () => {
          const subscribers = await database.changelog_subscribers.findMany({
            where: { project_id: project.id }
          });

          await sendChangelogEmail(subscribers, project, changelog, user);
        });
      }

      return { data: changelog, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to create changelog' };
    }
  })(slug);

// Get All Project Changelogs
export const getAllProjectChangelogs = withProjectAuth(async (user, project) => {
  try {
    const changelogs = await database.changelogs.findMany({
      where: { 
        project_id: project.id 
      },
      include: {
        profiles: true
      }
    });

    const restructuredData = changelogs.map((changelog) => ({
      ...changelog,
      author: {
        id: changelog.profiles?.id,
        email: changelog.profiles?.email,
        full_name: `${changelog.profiles?.first_name} ${changelog.profiles?.last_name}`,
        avatar_url: changelog.profiles?.avatar_url,
      }
    }));

    return { data: restructuredData, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch changelogs' };
  }
});

// Get Changelog by ID
export const getChangelogByID = (id: string, slug: string) =>
  withProjectAuth(async (user, project) => {
    try {
      const changelog = await database.changelogs.findFirst({
        where: { 
          id,
          project_id: project.id 
        },
        include: {
          profiles: true
        }
      });

      if (!changelog) {
        return { data: null, error: 'Changelog not found' };
      }

      const restructuredData = {
        ...changelog,
        author: {
          id: changelog.profiles?.id,
          email: changelog.profiles?.email,
          full_name: `${changelog.profiles?.first_name} ${changelog.profiles?.last_name}`,
          avatar_url: changelog.profiles?.avatar_url,
        }
      };

      return { data: restructuredData, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch changelog' };
    }
  })(slug);

// Update Changelog
export const updateChangelog = (
  id: string,
  slug: string,
  data: Omit<changelogs, 'id' | 'created_at' | 'project_id' | 'author_id'>
) =>
  withProjectAuth(async (user, project) => {
    // Handle image upload if new image provided
    if (data.image?.startsWith('data:image')) {
      try {
        const blob = await put(`changelogs/${project.id}/${Math.random().toString(36).slice(7)}`, data.image, {
          access: 'public',
          contentType: 'image/png'
        });
        data.image = blob.url;
      } catch (error) {
        return { data: null, error: 'Failed to upload image' };
      }
    }

    // Convert title to slug if needed
    if (data.title && !isSlugValid(data.title)) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/ /g, '-');
    }

    // Get current changelog
    const currentChangelog = await database.changelogs.findUnique({
      where: { id }
    });

    if (!currentChangelog) {
      return { data: null, error: 'Changelog not found' };
    }

    // Handle email notifications if publishing
    if (data.published && !currentChangelog.published) {
      waitUntil(async () => {
        const subscribers = await database.changelog_subscribers.findMany({
          where: { project_id: project.id }
        });

        await sendChangelogEmail(subscribers, project, currentChangelog, user);
      });
    }

    try {
      const changelog = await database.changelogs.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          summary: data.summary,
          content: data.content,
          image: data.image,
          publish_date: data.publish_date,
          published: data.published,
        },
        include: {
          profiles: true
        }
      });

      const restructuredData = {
        ...changelog,
        author: {
          id: changelog.profiles?.id,
          email: changelog.profiles?.email,
          full_name: `${changelog.profiles?.first_name} ${changelog.profiles?.last_name}`,
          avatar_url: changelog.profiles?.avatar_url,
        }
      };

      return { data: restructuredData, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to update changelog' };
    }
  })(slug);

// Delete Changelog by ID
export const deleteChangelog = (id: string, slug: string) =>
  withProjectAuth(async (user, project) => {
    try {
      const deletedChangelog = await database.changelogs.delete({
        where: { 
          id,
          project_id: project.id 
        }
      });

      if (!deletedChangelog) {
        return { data: null, error: 'Changelog not found' };
      }

      return { data: deletedChangelog, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to delete changelog' };
    }
  })(slug);

// Get changelog subscribers
export const getChangelogSubscribers = (slug: string) =>
  withProjectAuth(async (user, project) => {
    try {
      const subscribers = await database.changelog_subscribers.findMany({
        where: { project_id: project.id },
        select: {
          id: true,
          email: true
        }
      });

      return { data: subscribers, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch subscribers' };
    }
  })(slug);
