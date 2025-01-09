import merge from 'lodash.merge';
import type { Metadata } from 'next';

type MetadataGenerator = Omit<Metadata, 'description' | 'title'> & {
  title: string;
  description: string;
  image?: string;
};

const applicationName = 'Feedbackthing';
const author: Metadata['authors'] = {
  name: 'Sree Narayanan',
  url: 'https://x.com/eersnington',
};
const publisher = 'Sree Narayanan';
const twitterHandle = '@eersnington';

const feedbackThingKeywords = [
  // feedbackthing
  'feedbackthing',
  'feedback thing',
  'feedbackthing pro',
  'feedbackthing software',
  'feedbackthing platform',
  'feedbackthing tool',
  'feedbackthing app',
  'feedbackthing website',

  // Primary Keywords
  'user feedback tool',
  'feedback collection software',
  'customer feedback platform',
  'product feedback software',
  'SaaS feedback tool',
  'feedback board software',

  // Competitor Keywords
  'Featurebase alternative',
  'Canny vs Featurebase',
  'Canny alternative',
  'Featurebase feedback tool',
  'UserVoice competitor',
  'Savio feedback management',
  'Typeform for feedback',
  'Jira feedback integration',

  // Long-tail Keywords
  'best tools for collecting user feedback',
  'feedback board software for SaaS',
  'how to manage product feedback efficiently',
  'top feedback tools for startups',
  'best Canny alternatives for SaaS products',
  'how to create a user feedback board',

  // Pain Point Keywords
  'how to prioritize customer feedback',
  'feedback tools for better product decisions',
  'organizing product ideas and user feedback',
  'improve product roadmap with feedback',
  'gathering actionable user feedback',

  // Industry & Audience-Specific Keywords
  'feedback management for SaaS founders',
  'customer feedback SaaS tools',
  'streamline feature requests',
  'SaaS user engagement tools',
  'top feedback collection platforms',

  // General Keywords
  'feedback tracking system',
  'customer satisfaction tools',
  'collecting feedback for startups',
  'feedback prioritization tools',
  'feedback insights software',
];

export const createMetadata = ({
  title,
  description,
  image,
  ...properties
}: MetadataGenerator): Metadata => {
  const parsedTitle = `${applicationName} | ${title}`;
  const defaultMetadata: Metadata = {
    title: parsedTitle,
    description,
    keywords: feedbackThingKeywords,
    applicationName,
    authors: [author],
    creator: author.name,
    formatDetection: {
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: parsedTitle,
    },
    openGraph: {
      title: parsedTitle,
      description,
      type: 'website',
      siteName: applicationName,
      locale: 'en_US',
    },
    publisher,
    twitter: {
      card: 'summary_large_image',
      creator: twitterHandle,
    },
    metadataBase: new URL('https://www.feedbackthing.pro/'),
  };

  const metadata: Metadata = merge(defaultMetadata, properties);

  if (image && metadata.openGraph) {
    metadata.openGraph.images = [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ];
  }

  return metadata;
};
