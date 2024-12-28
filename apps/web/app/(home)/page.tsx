import ChangelogSection from '@/components/home/changelog-section';
import DashboardSection from '@/components/home/dashboard-section';
import { showBetaFeature } from '@repo/feature-flags';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { CTA } from './components/cta';
import FeedbackSection from './components/features';
import { Hero } from './components/hero';

const meta = {
  title: 'From zero to production in minutes.',
  description:
    "next-forge is a production-grade boilerplate for modern Next.js apps. It's designed to have everything you need to build your new SaaS app as quick as possible. Authentication, billing, analytics, SEO, and more. It's all here.",
};

export const metadata: Metadata = createMetadata(meta);

const Home = async () => {
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}
      <Hero />
      <DashboardSection />
      <FeedbackSection />
      <ChangelogSection />
      {/* <Cases />
      <Features />
      <Stats /> */}
      {/* <Testimonials /> */}
      {/* <FAQ /> */}
      <CTA />
    </>
  );
};

export default Home;
