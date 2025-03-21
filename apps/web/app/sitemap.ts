import { blog, legal } from '@repo/cms';
import { env } from '@repo/env';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Define static routes instead of reading from filesystem
const pages = ['blog', 'contact', 'discord', 'legal', 'pricing'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = (await blog.getPosts()).map((post) => post._slug);
  const legals = (await legal.getPosts()).map((post) => post._slug);

  return [
    {
      url: env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
      lastModified: new Date(),
    },
    ...pages.map((page) => ({
      url: new URL(page, env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL).href,
      lastModified: new Date(),
    })),
    ...blogs.map((blog) => ({
      url: new URL(
        `blog/${blog}`,
        env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ).href,
      lastModified: new Date(),
    })),
    ...legals.map((legal) => ({
      url: new URL(
        `legal/${legal}`,
        env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ).href,
      lastModified: new Date(),
    })),
  ];
}
