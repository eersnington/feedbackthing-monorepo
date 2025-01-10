import ProjectInviteForm from '@/components/layout/accept-invite-form';
import { getProjectInvite } from '@/lib/api/invites';
import { getCurrentUser } from '@/lib/api/user';
import { notFound } from 'next/navigation';

export default async function ProjectInvite({
  params,
}: { params: { inviteId: string } }) {
  const { data: invite, error: inviteError } = await getProjectInvite(
    params.inviteId,
    'server'
  );

  if (inviteError) {
    return notFound();
  }

  // Get current user
  const { data: user } = await getCurrentUser();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <ProjectInviteForm invite={invite} user={user} />
    </div>
  );
}
