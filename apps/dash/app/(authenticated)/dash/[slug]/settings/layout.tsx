import CategoryTabs from '@/components/dashboard/settings/category-tabs';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';

const tabs = [
  {
    name: 'General',
    slug: 'general',
  },
  {
    name: 'Hub',
    slug: 'hub',
  },
  {
    name: 'Team',
    slug: 'team',
  },
  {
    name: 'Integrations',
    slug: 'integrations',
  },
];

export default async function SettingsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  // Headers
  const headerList = await headers();
  const pathname = headerList.get('x-pathname');

  // Retrieve the currently active tab
  const activeTabIndex = tabs.findIndex(
    (tab) => pathname?.split('/')[3] === tab.slug
  );

  return (
    <main className="flex h-full w-full flex-col overflow-y-auto ">
      {/* Navigation tabs */}
      <CategoryTabs
        tabs={tabs}
        initialTabIndex={activeTabIndex}
        projectSlug={params.slug}
      />

      {/* Content */}
      <div className="flex h-full w-full flex-1 flex-col">{children}</div>
    </main>
  );
}
