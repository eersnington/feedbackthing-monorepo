import { database } from '@repo/database';
import { ApiResponse, ErrorProps } from '@/lib/types';
import type { projects, feedback, profiles} from '@prisma/client';
import { auth, User } from '@repo/auth/server';

type WithProjectAuthHandler<T> = (
  user: User | null,
  project: projects | null,
  error: ErrorProps | null,
  allowPublic?: boolean
) => Promise<ApiResponse<T>>;

export const withProjectAuth = <T>(handler: WithProjectAuthHandler<T>) => {
  return async (slug: string, allowAnonAccess = false, requireLogin = true) => {
    try {
      // Get user from Clerk
      const { userId } = await auth();
      let user = null;

      if (requireLogin && !userId && !allowAnonAccess) {
        return handler(null, null, {
          message: 'unauthorized, login required.',
          status: 401,
        });
      }

      // Get project from database
      const project = await database.projects.findUnique({
        where: { slug },
      });

      if (!project) {
        return handler(user, null, { 
          message: 'project not found.', 
          status: 404 
        });
      }

      // Check project membership if not public access
      if (!allowAnonAccess && userId) {
        const membership = await database.project_members.findFirst({
          where: {
            project_id: project.id,
            member_id: userId,
          },
        });

        if (!membership) {
          return handler(user, project, { 
            message: 'project not found.', 
            status: 404 
          });
        }
      }

      return handler(user, project, null, allowAnonAccess);
    } catch (error) {
      return handler(null, null, {
        message: 'Internal server error',
        status: 500,
      });
    }
  };
};

type WithFeedbackAuthHandler<T> = (
  user: User | null,
  feedback: feedback | null,
  project: projects | null,
  error: ErrorProps | null
) => Promise<ApiResponse<T>>;

export const withFeedbackAuth = <T>(handler: WithFeedbackAuthHandler<T>) => {
  return async (id: string, slug: string, requireLogin = true) => {
    try {
      const { userId } = await auth();
      let user = null;

      if (requireLogin && !userId) {
        return handler(null, null, null, {
          message: 'unauthorized, login required.',
          status: 401,
        });
      }

      const project = await database.projects.findUnique({
        where: { slug },
      });

      if (!project) {
        return handler(user, null, null, {
          message: 'project not found.',
          status: 404,
        });
      }

      const feedback = await database.feedback.findFirst({
        where: {
          id,
          project_id: project.id,
        },
        include: {
          profiles: true,
        },
      });

      if (!feedback) {
        return handler(user, null, project, {
          message: 'feedback not found.',
          status: 404,
        });
      }

      return handler(user, feedback, project, null);
    } catch (error) {
      return handler(null, null, null, {
        message: 'Internal server error',
        status: 500,
      });
    }
  };
};

type WithUserAuthHandler<T> = (
  user: profiles | null,
  error: ErrorProps | null
) => Promise<ApiResponse<T>>;

export const withUserAuth = <T>(handler: WithUserAuthHandler<T>) => {
  return async () => {
    try {
      const { userId } = await auth();
      let user = null;

      if (!userId) {
        return handler(null, {
          message: 'unauthorized, login required.',
          status: 401,
        });
      }

      return handler(user, null);
    } catch (error) {
      return handler(null, {
        message: 'Internal server error',
        status: 500,
      });
    }
  };
};