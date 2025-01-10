import { getProjectBySlug } from '@/lib/api/projects';
import { getPublicProjectChangelogs } from '@/lib/api/public';
import { NextResponse } from 'next/server';

/*
    Generate atom feed for project changelog
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  // Get project data
  const { data: project, error } = await getProjectBySlug(
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

  const result = await getPublicProjectChangelogs(context.params.slug);

  // If any errors thrown, return error
  if (result.error || !result.data) {
    if (typeof result.error === 'string') {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.status }
    );
  }

  const changelogs = result.data;

  // Return atom formatted changelogs
  return new Response(
    `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>${project.name} Changelog</title>
    <subtitle>${project.name}'s Changelog</subtitle>
    <link href="${req.url}" rel="self"/>
    <link href="${process.env.NEXT_PUBLIC_ROOT_DOMAIN}"/>
    <updated>${changelogs[0].publish_date}</updated>
    <id>${project.id}</id>${changelogs
      .map((post) => {
        return `
    <entry>
        <id>${post.id}</id>
        <title>${post.title}</title>
        <link href="https://${context.params.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/changelog/${post.slug}"/>
        <updated>${post.publish_date}</updated>
        <author><name>${post.author.first_name}</name></author>
    </entry>`;
      })
      .join('')}
</feed>`,
    {
      status: 200,
      headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
    }
  );
}
