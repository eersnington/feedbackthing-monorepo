import Onboarding from '@/components/layout/onboarding';
import { getUserProjects } from '@/lib/api/user';
import { redirect } from 'next/navigation';

export default async function Projects() {
  const { data: projects, error } = await getUserProjects();

  if (error) {
    // Check if error is an object with status
    if (
      typeof error === 'object' &&
      'status' in error &&
      error.status === 401
    ) {
      return redirect('/sign-in');
    }

    // Handle string or object error message
    const errorMessage = typeof error === 'string' ? error : error.message;
    return <div>{errorMessage}</div>;
  }

  // Redirect to the first project
  if (projects.length > 0) {
    return redirect(`/${projects[0].slug}`);
  }

  return (
    <div className="flex h-screen w-full flex-row items-center justify-center">
      <Onboarding />
    </div>
  );
}
