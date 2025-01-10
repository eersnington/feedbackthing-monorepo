import { getPublicProjectChangelogs } from '@/lib/api/public';
import { NextResponse } from 'next/server';

/*
    Get project changelogs
    GET /api/v1/projects/[slug]/changelogs
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const result = await getPublicProjectChangelogs(context.params.slug);

  const changelogs = result.data;

  // If any errors thrown, return error
  if (result.error) {
    if (typeof result.error === 'string') {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.status }
    );
  }

  // Return changelogs
  return NextResponse.json(changelogs, { status: 200 });
}
