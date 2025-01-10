import { redirect } from 'next/navigation';

export default function Dashboard({ params }: { params: { slug: string } }) {
  // Redirect to settings/general
  redirect(`/${params.slug}/settings/general`);
}
