import { getUserNotifications } from '@/lib/api/user';
import { NextResponse } from 'next/server';

/*
  Get user's notifications
  GET /api/v1/profile/notifications
*/
export async function GET(req: Request) {
  // Get user's notifications
  const { data: notifications, error } = await getUserNotifications();

  // Check for errors
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  return NextResponse.json(notifications, { status: 200 });
}
