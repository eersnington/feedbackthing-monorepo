import { acceptProjectInvite, deleteProjectInvite } from '@/lib/api/invites';
import { NextResponse } from 'next/server';

/*
  Accept project invite
  POST /api/v1/projects/[slug]/invites/[inviteId]
*/
export async function POST(
  req: Request,
  context: { params: { slug: string; inviteId: string } }
) {
  const result = await acceptProjectInvite(context.params.inviteId)();

  if (result.error) {
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.status }
    );
  }
  // Return success
  return NextResponse.json(result.data, { status: 200 });
}

/*
  Delete project invite
  DELETE /api/v1/projects/[slug]/invites/[inviteId]
*/
export async function DELETE(
  req: Request,
  context: { params: { slug: string; inviteId: string } }
) {
  const result = await deleteProjectInvite(context.params.inviteId)();

  // If any errors thrown, return error
  if (result.error) {
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.status }
    );
  }

  // Return success
  return NextResponse.json(result.data, { status: 200 });
}
