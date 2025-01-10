import { createFeedbackTag, getAllFeedbackTags } from '@/lib/api/feedback';
import type { FeedbackTagProps } from '@/lib/types';
import { NextResponse } from 'next/server';

/*
    Create new tag
    POST /api/v1/projects/:slug/feedback/tags
    {
        name: string,
        color: string
    }
*/
export async function POST(
  req: Request,
  context: { params: { slug: string } }
) {
  const { name, color } = (await req.json()) as FeedbackTagProps;

  const { data: tag, error } = await createFeedbackTag(context.params.slug, {
    name: name || '',
    color: color || '',
  });

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  // Return tag
  return NextResponse.json(tag, { status: 200 });
}

/*
    Get all feedback tags
    GET /api/v1/projects/:slug/feedback/tags
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: tags, error } = await getAllFeedbackTags(context.params.slug);

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  // Return tags
  return NextResponse.json(tags, { status: 200 });
}
