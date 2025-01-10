import { withProjectAuth, withUserAuth } from '@/lib/auth';
import { generateApiToken, isSlugValid, isValidUrl } from '@/lib/utils';
import { database } from '@repo/database';
import type { projects, project_configs } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { put } from '@vercel/blob';

// Get Project
export const getProjectBySlug = withProjectAuth(async (user, project) => {
  if (!project) {
    return { data: null, error: 'Project not found' };
  }

  return { data: project, error: null };
});

// Create Project
export const createProject = (data: {
  name: string;
  slug: string;
}) =>
  withUserAuth(async (user) => {
    // Check if slug is valid
    if (!isSlugValid(data.slug)) {
      return { data: null, error: {
        message: 'Invalid slug format',
        status: 400
      } };
    }

    try {
      // Create project, member and config in transaction
      const [project] = await database.$transaction([
        database.projects.create({
          data: {
            name: data.name,
            slug: data.slug,
            project_members: {
              create: {
                member_id: user.id
              }
            },
            project_configs: {
              create: {}
            }
          }
        })
      ]);

      return { data: project, error: null };
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            return { data: null, error: {
              message: 'Slug already taken',
              status: 400
            } };
          }
        }
      return { data: null, error: {
        message: 'Failed to create project',
        status: 500
      } };
    }
  });

// Update Project by slug
export const updateProjectBySlug = (
  slug: string, 
  data: Partial<projects>
) => withProjectAuth(async (user, project) => {
  // Check if slug is valid
  if (data.slug && !isSlugValid(data.slug)) {
    return { data: null, error: 'Invalid slug format' };
  }

  // Handle image uploads
  const uploadImage = async (imageData: string, type: 'icon' | 'og_image') => {
    try {
      const blob = await put(`projects/${project.id}/${type}`, imageData, {
        access: 'public',
        contentType: 'image/png'
      });
      return { data: blob.url, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to upload image' };
    }
  };

  // Upload new icon if provided
  if (data.icon?.startsWith('data:image')) {
    const { data: iconUrl, error } = await uploadImage(data.icon, 'icon');
    if (error) return { data: null, error };
    data.icon = iconUrl;
  }

  // Upload new og_image if provided
  if (data.og_image?.startsWith('data:image')) {
    const { data: ogImageUrl, error } = await uploadImage(data.og_image, 'og_image');
    if (error) return { data: null, error };
    data.og_image = ogImageUrl;
  }

  try {
    const updatedProject = await database.projects.update({
      where: { id: project.id },
      data: {
        name: data.name || project.name,
        slug: data.slug || project.slug,
        icon: data.icon || project.icon,
        icon_radius: data.icon_radius || project.icon_radius,
        og_image: data.og_image || project.og_image,
      }
    });

    return { data: updatedProject, error: null };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            return { data: null, error: 'Slug already taken' };
          }
        }
    return { data: null, error: 'Failed to update project' };
  }
})(slug);

// Delete Project by slug
export const deleteProjectBySlug = (slug: string) => 
  withProjectAuth(async (user, project) => {
    try {
      const deletedProject = await database.projects.delete({
        where: { id: project.id }
      });

      return { data: deletedProject, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to delete project' };
    }
  })(slug);

// Get all project members by slug
export const getProjectMembers = withProjectAuth(async (user, project) => {
  try {
    const members = await database.project_members.findMany({
      where: { project_id: project.id },
      include: {
        profiles: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const restructuredData = members.map((item) => ({
      ...item.profiles,
      joined_at: item.created_at,
    }));

    return { data: restructuredData, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch project members' };
  }
});

// Get project config by slug
export const getProjectConfigBySlug = withProjectAuth(async (user, project) => {
  try {
    const config = await database.project_configs.findUnique({
      where: { project_id: project.id }
    });

    if (!config) {
      return { data: null, error: 'Project config not found' };
    }

    // Remove sensitive fields
    const { integration_sso_secret, ...configWithoutSecret } = config;

    return { data: configWithoutSecret, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch project config' };
  }
});

// Update project config by slug
export const updateProjectConfigBySlug = (
  slug: string,
  data: Partial<project_configs>
) =>
  withProjectAuth(async (user, project) => {
    // Validate changelog_preview_style
    if (data.changelog_preview_style && !['summary', 'content'].includes(data.changelog_preview_style)) {
      return { data: null, error: 'changelog_preview_style must be one of: summary, content' };
    }

    // Validate logo_redirect_url
    if (data.logo_redirect_url && !isValidUrl(data.logo_redirect_url)) {
      return { data: null, error: 'logo_redirect_url must be a valid URL' };
    }

    // Validate sso_url
    if (data.integration_sso_url && !isValidUrl(data.integration_sso_url)) {
      return { data: null, error: 'integration_sso_url must be a valid URL' };
    }

    try {
      const updatedConfig = await database.project_configs.update({
        where: { project_id: project.id },
        data: {
          changelog_preview_style: data.changelog_preview_style,
          changelog_twitter_handle: data.changelog_twitter_handle,
          integration_discord_status: data.integration_discord_status,
          integration_discord_webhook: data.integration_discord_webhook,
          integration_discord_role_id: data.integration_discord_role_id,
          custom_domain: data.custom_domain,
          custom_domain_verified: data.custom_domain_verified,
          integration_sso_status: data.integration_sso_status,
          integration_sso_url: data.integration_sso_url,
          integration_sso_secret: data.integration_sso_secret,
          feedback_allow_anon_upvoting: data.feedback_allow_anon_upvoting,
          custom_theme: data.custom_theme,
          custom_theme_root: data.custom_theme_root,
          custom_theme_primary_foreground: data.custom_theme_primary_foreground,
          custom_theme_background: data.custom_theme_background,
          custom_theme_secondary_background: data.custom_theme_secondary_background,
          custom_theme_accent: data.custom_theme_accent,
          custom_theme_border: data.custom_theme_border,
          integration_slack_status: data.integration_slack_status,
          integration_slack_webhook: data.integration_slack_webhook,
          logo_redirect_url: data.logo_redirect_url,
          changelog_enabled: data.changelog_enabled
        }
      });

      // Remove sensitive fields
      const { integration_sso_secret, ...configWithoutSecret } = updatedConfig;
      
      return { data: configWithoutSecret, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to update project config' };
    }
  })(slug);

// Create new API key
export const createProjectApiKey = (
  slug: string,
  data: { name: string; permission: string }
) =>
  withProjectAuth(async (user, project) => {
    // Validate permission
    if (!['full_access', 'public_access'].includes(data.permission)) {
      return {
        data: null, 
        error: 'Permission must be one of: full_access, public_access'
      };
    }

    // Get all API keys for project
    const apiKeys = await database.project_api_keys.findMany({
      where: { project_id: project.id }
    });

    // Check if API key name exists
    if (apiKeys.some(item => item.name === data.name)) {
      return { data: null, error: 'API key name already exists' };
    }

    // Check max API keys
    if (apiKeys.length >= 3) {
      return { data: null, error: 'Maximum of 3 API keys reached' };
    }

    // Generate API key token
    const apiKeyToken = generateApiToken('fbt', 20);
    const shortToken = apiKeyToken.slice(0, 12);

    try {
      const apiKey = await database.project_api_keys.create({
        data: {
          project_id: project.id,
          name: data.name,
          token: apiKeyToken,
          permission: data.permission as 'full_access' | 'public_access',
          short_token: shortToken,
          creator_id: user.id
        }
      });

      return { data: apiKey, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to create API key' };
    }
  })(slug);

// Get all API keys for project
export const getProjectApiKeys = withProjectAuth(async (user, project) => {
  try {
    const apiKeys = await database.project_api_keys.findMany({
      where: { project_id: project.id },
      select: {
        id: true,
        name: true,
        permission: true,
        short_token: true,
        project_id: true,
        creator_id: true,
        created_at: true
      }
    });

    return { data: apiKeys, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch API keys' };
  }
});

// Delete API keys for project
export const deleteProjectApiKey = (slug: string, keyId: string) =>
  withProjectAuth(async (user, project) => {
    try {
      const apiKey = await database.project_api_keys.findUnique({
        where: {
          id: keyId,
          project_id: project.id
        }
      });

      if (!apiKey) {
        return { data: null, error: 'Invalid API key' };
      }

      const deletedApiKey = await database.project_api_keys.delete({
        where: { id: keyId }
      });

      return { data: deletedApiKey, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to delete API key' };
    }
  })(slug);

// Get project analytics
export const getProjectAnalytics = (
  slug: string,
  data?: { start: string; end: string }
) =>
  withProjectAuth(async (user, project) => {
    // Check if tinybird variables are set
    if (!process.env.TINYBIRD_API_URL || !process.env.TINYBIRD_API_KEY) {
      return { data: null, error: 'Tinybird variables not set' };
    }

    // Set date range
    const startDate = data?.start
      ? data.start
      : encodeURIComponent(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).slice(0, -1);
    const endDate = data?.end
      ? data.end
      : encodeURIComponent(new Date(Date.now()).toISOString()).slice(0, -1);

    try {
      // Fetch timeseries from Tinybird
      const timeseries = await fetch(
        `${process.env.TINYBIRD_API_URL}/v0/pipes/timeseries.json?end=${endDate}&start=${startDate}&project=${project.slug}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
          },
        }
      ).then((res) => res.json());

      if (timeseries.error) {
        return { data: null, error: timeseries.error };
      }

      // Fetch top feedback from Tinybird
      const topFeedback = await fetch(
        `${process.env.TINYBIRD_API_URL}/v0/pipes/top_feedback.json?project=${project.slug}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
          },
        }
      ).then((res) => res.json());

      if (topFeedback.error) {
        return { data: null, error: topFeedback.error };
      }

      // Fetch top changelogs from Tinybird
      const topChangelogs = await fetch(
        `${process.env.TINYBIRD_API_URL}/v0/pipes/top_changelogs.json?project=${project.slug}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
          },
        }
      ).then((res) => res.json());

      if (topChangelogs.error) {
        return { data: null, error: topChangelogs.error };
      }

      // Get feedback and changelogs from database
      const [feedback, changelogs] = await Promise.all([
        database.feedback.findMany({
          where: { project_id: project.id }
        }),
        database.changelogs.findMany({
          where: { project_id: project.id }
        })
      ]);

      // Restructure topFeedback data
      const restructuredTopFeedback = topFeedback.data
        .map((item: any) => {
          const feedbackData = feedback.find((f) => f.id === item.key);
          return feedbackData ? {
            ...item,
            key: feedbackData.title || item.key,
          } : null;
        })
        .filter(Boolean);

      // Restructure topChangelogs data
      const restructuredTopChangelogs = topChangelogs.data
        .map((item: any) => {
          const changelogData = changelogs.find((c) => c.id === item.key);
          return changelogData ? {
            ...item,
            key: changelogData.title || item.key,
          } : null;
        })
        .filter(Boolean);

      return {
        data: {
          timeseries: timeseries.data,
          topFeedback: restructuredTopFeedback.filter((f: { key: string; }) => f?.key !== '_root'),
          topChangelogs: restructuredTopChangelogs.filter((c: { key: string; }) => c?.key !== '_root'),
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: 'Failed to fetch analytics' };
    }
  })(slug);