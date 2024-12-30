import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { blog } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { Button } from '@repo/design-system/components/ui/button';
import { env } from '@repo/env';
import { MoveRight } from 'lucide-react';
import { draftMode } from 'next/headers';
import Link from 'next/link';

export const Hero = async () => {
  const draft = await draftMode();

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
          <div>
            <Feed queries={[blog.latestPostQuery]} draft={draft.isEnabled}>
              {/* biome-ignore lint/suspicious/useAwait: "Server Actions must be async" */}
              {async ([data]) => {
                'use server';

                return (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-4"
                    asChild
                  >
                    <Link href={`/blog/${data.blog.posts.items.at(0)?._slug}`}>
                      Read our latest article <MoveRight className="h-4 w-4" />
                    </Link>
                  </Button>
                );
              }}
            </Feed>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl bg-gradient-to-t from-[#c7d2fe] to-[#8678f9] bg-clip-text text-center font-regular text-5xl text-transparent tracking-tighter md:text-7xl">
              Listen to your users and build what matters.
            </h1>
            <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
              Feedbackthing allows you to validate features, collect feedback,
              build roadmaps and changelogs, all in one place.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline" asChild>
              <Link href="/discord">
                Join Community <DiscordLogoIcon className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" className="gap-4" asChild>
              <Link href={env.NEXT_PUBLIC_APP_URL}>
                Get started for free <MoveRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
