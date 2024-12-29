import ChangelogSection from '@/components/home/changelog-section';
import DashboardSection from '@/components/home/dashboard-section';
import { showBetaFeature } from '@repo/feature-flags';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { CTA } from './components/cta';
import FeedbackSection from './components/features';
import { Hero } from './components/hero';

const meta = {
  title: 'Collect user feedback, build roadmaps and changelogs',
  description:
    'Feedbackthing allows you to validate features with your users, collect feedback, build roadmaps and changelogs, all in one place. Build better products with Feedbackthing.',
  image: 'https://www.feedbackthing.pro/og-image.png',
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
