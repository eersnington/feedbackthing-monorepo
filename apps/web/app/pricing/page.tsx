import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import Pricing from './components/pricing';

const title = 'Pricing';
const description =
  "Choose the plan that's right for you. Start your free trial today.";

export const metadata: Metadata = createMetadata({
  title,
  description,
});

export default function Home() {
  return (
    <main>
      <Pricing />
    </main>
  );
}
