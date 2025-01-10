import { updateUserProfile } from '@/lib/api/user';
import { NextResponse } from 'next/server';

/* 
    Update Profile
    PATCH /api/v1/profile
    {
        "full_name": string,
        "avatar_url": string,
    }
*/
export async function PATCH(req: Request) {
  const {
    first_name: firstName,
    last_name: lastName,
    avatar_url: avatarUrl,
  } = await req.json();

  // Validate Request Body
  if (!firstName && typeof firstName !== 'string' && firstName.length < 1) {
    return NextResponse.json(
      { error: 'first_name is required.' },
      { status: 400 }
    );
  }
  if (!lastName && typeof lastName !== 'string' && lastName.length < 1) {
    return NextResponse.json(
      { error: 'last_name is required.' },
      { status: 400 }
    );
  }
  if (!avatarUrl && typeof avatarUrl !== 'string' && avatarUrl.length < 1) {
    return NextResponse.json(
      { error: 'avatar_url is required.' },
      { status: 400 }
    );
  }

  // Update Profile
  const result = await updateUserProfile({
    first_name: firstName,
    last_name: lastName,
    avatar_url: avatarUrl,
  })();

  // Check for errors
  if (result.error) {
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.status }
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}
