import { createFeedback, getAllProjectFeedback } from '@/lib/api/feedback';
import type { FeedbackWithUserInputProps } from '@/lib/types';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

/*
    Create Feedback
    POST /api/v1/projects/[slug]/feedback
    {
        title: string;
        description: string;
        status: string;
        tags: [id, id, id]
    }
*/
export async function POST(
  req: Request,
  context: { params: { slug: string } }
) {
  const { title, description, status, tags, user } =
    (await req.json()) as FeedbackWithUserInputProps;

  // Validate Request Body
  if (!title) {
    return NextResponse.json(
      { error: 'title is required when creating feedback.' },
      { status: 400 }
    );
  }

  const result = await createFeedback(context.params.slug, {
    title,
    description: description || '',
    status: status || '',
    tags: tags || [],
    user: user || undefined,
    upvotes: 0n,
    user_id: '',
    project_id: '',
    raw_tags: [],
    comment_count: 0n,
  });

  // If any errors thrown, return error
  if (result.error) {
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.status }
    );
  }

  // Return feedback
  return NextResponse.json(result.data, { status: 200 });
}

/*
    Get Project Feedback
    GET /api/v1/projects/[slug]/feedback
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: feedback, error } = await getAllProjectFeedback(
    context.params.slug,
    false
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  // Return feedback
  return NextResponse.json(feedback, { status: 200 });
}
