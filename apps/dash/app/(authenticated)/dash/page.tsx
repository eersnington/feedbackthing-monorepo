import Onboarding from '@/components/layout/onboarding';
import { getUserProjects } from '@/lib/api/user';
import { redirect } from 'next/navigation';

export default async function Projects() {
  const { data: projects, error } = await getUserProjects();

  if (error) {
    // Redirect to login if the user is not authenticated
    if (error.status === 401) {
      return redirect('/login');
    }

    return <div>{error.message}</div>;
  }

  // Redirect to the first project
  if (projects.length > 0) {
    return redirect(`/${projects[0].slug}`);
  }

  // TODO: Improve this and make this redirect to an onboarding page if the user has no projects
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Onboarding />
    </div>
  );
}
