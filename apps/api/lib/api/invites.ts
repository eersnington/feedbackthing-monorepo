import { sendEmail } from '@/emails';
import ProjectInviteEmail from '@/emails/project-invite';
import { withProjectAuth, withUserAuth } from '../auth';
import { database } from '@repo/database';
import { formatRootUrl } from '../utils';

// Get all project invites
export const getProjectInvites = withProjectAuth(async (user, project) => {
  const invites = await database.project_invites.findMany({
    where: { project_id: project.id },
    include: {
      projects: {
        select: { name: true, slug: true, icon: true }
      },
      profiles: {
        select: { first_name: true, last_name: true }
      }
    }
  });

  return { data: invites, error: null };
});

// Get project invite
export const getProjectInvite = (inviteId: string) => 
  withUserAuth(async (user) => {
    const invite = await database.project_invites.findUnique({
      where: { id: inviteId },
      include: {
        projects: {
          select: { name: true, slug: true, icon: true }
        },
        profiles: {
          select: { first_name: true, last_name: true }
        }
      }
    });

    if (!invite) {
      return { data: null, error: {
        status: 404,
        message: 'Invite not found'
      } };
    }

    return { data: invite, error: null };
  });

// Create new project invite
export const createProjectInvite = (slug: string, email: string) =>
  withProjectAuth(async (user, project) => {
    // Check if user exists
    const existingUser = await database.profiles.findFirst({
      where: { email }
    });

    if (existingUser) {
      // Check if already a member
      const membership = await database.project_members.findFirst({
        where: {
          project_id: project.id,
          member_id: existingUser.id
        }
      });

      if (membership) {
        return { data: null, error: 'User is already a member' };
      }
    }

    // Check for existing invite
    const existingInvite = await database.project_invites.findFirst({
      where: {
        project_id: project.id,
        email
      }
    });

    if (existingInvite) {
      return { data: null, error: {
        status: 400,
        message: 'User is already invited'
      } };
    }

    // Create invite
    const invite = await database.project_invites.create({
      data: {
        project_id: project.id,
        email,
        creator_id: user.id
      },
      include: {
        profiles: true,
        projects: true
      }
    });

    // Send email
    try {
      await sendEmail({
        subject: `You've been invited to join ${project.name} on Feedbackthing`,
        email,
        react: ProjectInviteEmail({
          email,
          invitedByFullName: `${user.first_name} ${user.last_name}`,
          invitedByEmail: user.email,
          projectName: project.name,
          inviteLink: formatRootUrl('dash', `/invite/${invite.id}`),
        }),
      });
    } catch (error) {
      // Delete invite if email fails
      await database.project_invites.delete({
        where: { id: invite.id }
      });
      return { data: null, error: {
        status: 500,
        message: 'Failed to send invite email'
      } };
    }

    return { data: invite, error: null };
  })(slug);

// Accept project invite
export const acceptProjectInvite = (inviteId: string) =>
  withUserAuth(async (user) => {
    const invite = await database.project_invites.findUnique({
      where: { id: inviteId }
    });

    if (!invite) {
      return { data: null, error: {
        status: 404,
        message: 'Invite not found'
      } };
    }

    if (invite.email !== user.email) {
      return { data: null, error: {
        status: 403,
        message: 'Invalid invite'
      } };
    }

    const inviteExpiration = new Date(invite.created_at);
    inviteExpiration.setDate(inviteExpiration.getDate() + 7);

    if (inviteExpiration < new Date()) {
      return { data: null, error: {
        status: 403,
        message: 'Invite has expired'
      } };
    }

    if (invite.accepted) {
      return { data: null, error: {
        status: 403,
        message: 'Invite already accepted'
      } };
    }

    try {
      const [member, updatedInvite] = await database.$transaction([
        database.project_members.create({
          data: {
            project_id: invite.project_id,
            member_id: user.id
          }
        }),
        database.project_invites.update({
          where: { id: inviteId },
          data: { accepted: true },
          include: {
            projects: {
              select: { name: true, slug: true, icon: true }
            },
            profiles: {
              select: { first_name: true, last_name: true }
            }
          }
        })
      ]);

      return { data: updatedInvite, error: null };
    } catch (error) {
      return { data: null, error: {
        status: 500,
        message: 'Failed to accept invite'
      } };
    }
  });

// Delete project invite

export const deleteProjectInvite = (inviteId: string) =>
  withUserAuth(async (user) => {
    try {
      const deletedInvite = await database.project_invites.delete({
        where: { id: inviteId },
        include: {
          projects: {
            select: { name: true, slug: true, icon: true }
          },
          profiles: {
            select: { first_name: true, last_name: true }
          }
        }
      });

      return { data: deletedInvite, error: null };
    } catch (error) {
      return { data: null, error: {
        status: 500,
        message: 'Failed to delete invite'
      }};
    }
  });
