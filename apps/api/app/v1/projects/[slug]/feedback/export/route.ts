import { getAllProjectFeedback } from '@/lib/api/feedback';
import type { FeedbackWithUserProps } from '@/lib/types';
import { formatRootUrl } from '@/lib/utils';

/*
  Export all feedback for a project
  GET /api/v1/projects/:slug/feedback/export
*/
export async function GET(req: Request, context: { params: { slug: string } }) {
  const { data: feedback, error } = await getAllProjectFeedback(
    context.params.slug
  );

  // If any errors thrown, return error
  if (error) {
    return new Response(error.message, { status: error.status });
  }

  // Create CSV
  const csv = `ID,Link,Title,Content,Status,Upvotes,Comment Count,User ID,User Name,User Email,User Avatar,Tags,Created At\n${feedback
    .map((feedback: FeedbackWithUserProps) => {
      return `${feedback.id},${formatRootUrl(
        context.params.slug,
        `/feedback/${feedback.id}`
      )},"${feedback.title.replace(/"/g, '""')}","${feedback.description.replace(/"/g, '""')}",${
        feedback.status
      },${feedback.upvotes},${feedback.comment_count},${feedback.user_id},"${feedback.user.first_name?.replace(
        /"/g,
        '""'
      )}","${feedback.user.email.replace(/"/g, '""')}",${
        feedback.user.avatar_url
          ? `"${feedback.user.avatar_url.replace(/"/g, '""')}"`
          : ''
      },${feedback.tags ? feedback.tags.map((tag: { name: string }) => tag.name.replace(/"/g, '""')).join(',') : ''},${
        feedback.created_at
      }\n`;
    })
    .join('')}`;

  // Return CSV
  const timestamp = Date.now();
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=${context.params.slug}-${timestamp}.csv`,
    },
  });
}
