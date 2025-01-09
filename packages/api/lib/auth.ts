import { database } from '@repo/database';
import type { projects, feedback, profiles } from '@prisma/client';
import { auth } from '@repo/auth/server';

export function withUserAuth(action: (user: profiles) => Promise<{ data: any; error: null } | { data: null; error: { status : number, message: string} }| { data: null; error: string }>) {
  return async () => {
    const { userId } = await auth();
    
    if (!userId) {
      return { data: null, error: { message: 'Not authenticated', status: 401} };
    }

    const user = await database.profiles.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { data: null, error: {message: 'User not found', status: 404} };
    }

    return action(user);
  };
}

export function withProjectAuth(action: (user: profiles, project: projects) => Promise<any>) {
  return async (slug: string, allowAnonAccess = false) => {
    const { userId } = await auth();
    
    if (!userId && !allowAnonAccess) {
      return { error: { message: 'Not authenticated', status: 401} };
    }

    if (userId === null){
      return { error: { message: 'Not authenticated', status: 401} };
    }

    const project = await database.projects.findUnique({
      where: { slug }
    });

    if (!project) {
      return { error: {message: 'Project not found', status: 404} };
    }

    if (!allowAnonAccess) {
      const membership = await database.project_members.findFirst({
        where: {
          project_id: project.id,
          member_id: userId
        }
      });

      if (!membership) {
        return { error: { message: 'Not authorized', status: 403} };
      }
    }

    const user = userId ? await database.profiles.findUnique({
      where: { id: userId }
    }) : null;

    return action(user!, project);
  };
}

export function withFeedbackAuth(
  action: (user: profiles, feedback: feedback, project: projects) => Promise<any>
) {
  return async (id: string, slug: string) => {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: { message: 'Not authenticated', status: 401} };
    }

    const user = await database.profiles.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { error: {message: 'User not found', status: 404} };
    }

    const project = await database.projects.findUnique({
      where: { slug }
    });

    if (!project) {
      return { error: {message: 'Project not found', status: 404} };
    }

    const feedbackItem = await database.feedback.findFirst({
      where: {
        id,
        project_id: project.id
      }
    });

    if (!feedbackItem) {
      return { error: {message: 'Feedback not found', status: 404} };
    }

    return action(user, feedbackItem, project);
  };
}