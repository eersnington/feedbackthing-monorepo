import { archiveUserNotification } from '@/lib/api/user';
import { NextResponse } from 'next/server';

/*
  Archive a notification
  PATCH /api/v1/profile/notifications/:notificationId
  {
    "archived": true
  }
*/
export async function PATCH(
  req: Request,
  context: { params: { notificationId: string } }
) {
  // Get notification id
  const { archived } = await req.json();

  // Archive notification
  const result = await archiveUserNotification(
    context.params.notificationId,
    archived
  )();

  // Check for errors
  if (result.error) {
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.status }
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}
