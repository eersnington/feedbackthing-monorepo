import { deleteProjectApiKey } from '@/lib/api/projects';
import { NextResponse } from 'next/server';

/*
  Delete api key for a project
  DELETE /api/v1/projects/:slug/config/api/:token
*/
export async function DELETE(
  req: Request,
  context: { params: { slug: string; id: string } }
) {
  const { error } = await deleteProjectApiKey(
    context.params.slug,
    context.params.id
  );

  if (error) {
    return NextResponse.json({ error }, { status: error.status });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
