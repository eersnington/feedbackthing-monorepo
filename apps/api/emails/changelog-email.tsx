import { formatRootUrl } from '@/lib/utils';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
} from '@react-email/components';

interface ChangelogEmailProps {
  subId: string;
  projectSlug: string;
  changelog: {
    title: string;
    content: string;
    publish_date: string;
    summary: string;
    image: string;
    slug: string;
    author: {
      full_name: string;
      avatar_url: string;
    };
  };
}

export default function ChangelogEmail({
  subId,
  projectSlug,
  changelog,
}: ChangelogEmailProps) {
  return (
    <Html>
      <Preview>{changelog.summary}</Preview>
      <Tailwind>
        <Head />
        <Body className="mx-auto my-auto bg-white p-3 font-sans">
          <Container>
            {/* Title */}
            <Heading className="cursor-default font-medium text-3xl text-black">
              {changelog.title}
            </Heading>

            {/* Image */}
            <Img
              src={changelog.image || ''}
              alt="Thumbnail"
              className="aspect-auto w-full rounded-lg object-cover object-center"
            />

            {/* Author & Share */}
            <Section className="pt-4 pb-6">
              <Row>
                <Column className="min-w-10">
                  <Img
                    src={changelog.author.avatar_url || ''}
                    alt={changelog.author.full_name}
                    className="h-10 w-10 rounded-full"
                  />
                </Column>
                <Column className="w-full pl-3">
                  <Row>
                    <span className="font-medium text-black/90 text-sm">
                      {changelog.author.full_name}
                    </span>

                    <Column className="text-black/70 text-sm">
                      <time
                        className="sticky top-10"
                        dateTime={changelog.publish_date}
                      >
                        {new Date(changelog.publish_date).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </time>
                    </Column>
                  </Row>
                </Column>
                <Column>
                  <Link
                    className="text-black/[85%]"
                    href={`https://twitter.com/intent/tweet?text=Make sure to check out ${
                      changelog.title
                    } by ${changelog.author.full_name}!&url=${formatRootUrl(
                      projectSlug,
                      `/changelog/${changelog.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Img
                      src="https://svgl.app/library/twitter.svg"
                      className="h-6 w-6"
                    />
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Content as html */}
            <div
              className="prose prose-zinc w-0 min-w-full font-normal prose-blockquote:font-normal prose-code:font-normal prose-headings:font-medium prose-p:font-light prose-strong:font-normal prose-blockquote:text-black/80 prose-code:text-black/70 prose-headings:text-black/80 prose-strong:text-black/80 text-black/70"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{ __html: changelog.content }}
            />

            {/* Separetor */}
            <Hr className="mt-8 border-black/20" />

            <div className="flex w-full flex-row items-center justify-center gap-5 py-4">
              <Link
                href={formatRootUrl(
                  projectSlug,
                  `/changelog/unsubscribe?subId=${subId}`
                )}
                className="flex items-center gap-2 font-light text-black/70 text-sm underline"
              >
                Unsubscribe
              </Link>
              <span className="font-normal text-black/70 text-sm">•</span>
              <Link
                href={formatRootUrl(
                  projectSlug,
                  `/changelog/${changelog.slug}`
                )}
                className="flex items-center gap-2 font-light text-black/70 text-sm underline"
              >
                View in browser
              </Link>
            </div>

            <div className="flex w-full flex-row items-center justify-center">
              <Link
                href="https://feedbackthing.pro"
                className="flex items-center gap-2 font-normal text-black/70 text-sm"
              >
                <Img
                  src="https://www.feedbackthing.pro/android-chrome-512x512.png"
                  alt="Feedbackthing"
                  className="h-8 w-8 rounded-md"
                />
                Powered by Feedbackthing
              </Link>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
