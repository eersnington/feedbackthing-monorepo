import { redirect } from 'next/navigation';

export default function ProjectPage({ params }: { params: { slug: string } }) {
  // Redirect to changelog
  redirect(`/${params.slug}/changelog`);
}
