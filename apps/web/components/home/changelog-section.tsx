'use client';

import { TwitterLogoIcon } from '@radix-ui/react-icons';
import { PROSE_CN } from '@repo/design-system//lib/constants';
import { Button } from '@repo/design-system/components/ui/button';
import { Label } from '@repo/design-system/components/ui/label';
import { cn } from '@repo/design-system/lib/utils';
import { formatRootUrl } from '@repo/design-system/lib/utils';
import RichTextEditor from '@repo/tiptap-editor/components/tiptap-editor';
import { MailIcon, RssIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import BentoCardWrapper from './spotlight-card';

export default function ChangelogSection() {
  const [changelogContent, setChangelogContent] = useState(
    '<h4>Release 1.82</h4><p>We&apos;ve fixed <em>a bunch</em> of annoying bugs with this release and also added a few new animations to improve UX. </p><p>Who can spot them? 👀</p></div>'
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-2 pb-24">
      <span className="select-none bg-gradient-to-t from-[#c7d2fe] to-[#8678f9] bg-clip-text text-lg text-transparent sm:text-xl">
        Share what&apos;s new
      </span>

      <h1 className="gap-2 text-center font-medium text-3xl text-foreground leading-tight sm:text-4xl">
        Keep your users in the loop
      </h1>

      <p className="mt-2 w-[800px] max-w-full text-center font-light text-foreground/60 text-sm sm:text-base">
        Feedbase adds a touch of enjoyment to help you keep your users informed
        through an appealing changelog that&apos;s simple to create and
        distribute.
      </p>

      {/* CTA */}

      <Button
        asChild
        className="relative mt-3 inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      >
        <Link href={formatRootUrl('dash', '/signup')}>
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-3 py-1 font-medium text-sm text-white backdrop-blur-3xl">
            Get Started
          </span>
        </Link>
      </Button>

      {/* Bento  */}
      <div className="mt-10 flex w-full flex-col items-center justify-center gap-5 xl:flex-row">
        {/* OG Images */}
        <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row xl:w-fit">
          <BentoCardWrapper className="h-[465px] w-full min-w-[350px]">
            <div className="p-7">
              <h1 className="font-medium text-foreground text-lg">
                OG Image support
              </h1>
              <p className="mt-2 font-light text-foreground/60 text-sm">
                Set OG image for your changelog posts to make them look great
                when shared on social media.
              </p>

              <div className="mt-5 flex flex-col items-start justify-start rounded-md border">
                <Image
                  src="/og-image.png"
                  width={500}
                  height={100}
                  alt="OG Image"
                  className="rounded-t-md border-b"
                />

                <div className="flex flex-col gap-1.5 rounded-b-md bg-background p-3">
                  {/* url */}
                  <span className="font-light text-foreground/60 text-sm">
                    hub.feedbase.app
                  </span>

                  {/* Title */}
                  <span className="font-medium text-foreground text-sm">
                    OG Image support
                  </span>

                  {/* Description */}
                  <span className="font-light text-foreground/60 text-sm">
                    Easily set an OG image for your changelog posts to make them
                    look great when shared on social media.
                  </span>
                </div>
              </div>
            </div>
          </BentoCardWrapper>

          {/* Markdown */}
          <BentoCardWrapper className="h-full min-h-[465px] w-full min-w-[350px]">
            <div className="h-full p-7">
              <h1 className="font-medium text-foreground text-lg">
                Markdown support
              </h1>
              <p className="mt-2 font-light text-foreground/60 text-sm">
                Write changelog posts in markdown and Feedbase will
                automatically convert it to HTML.
              </p>

              {/* Markdown */}
              <div className="mt-5 flex h-[313px] flex-col gap-1.5">
                <Label className="font-light text-foreground/60 text-sm">
                  Editor
                </Label>
                <div className="flex h-1/2 flex-col gap-1.5 overflow-auto rounded-md border p-3">
                  <RichTextEditor
                    content={changelogContent}
                    setContent={setChangelogContent}
                    proseInvert
                  />
                </div>

                {/* Preview */}
                <Label className="font-light text-foreground/60 text-sm">
                  Preview
                </Label>
                <div
                  className={cn(
                    'flex h-1/2 flex-col justify-start overflow-x-auto rounded-md border px-3 text-sm',
                    PROSE_CN
                  )}
                >
                  {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                  <div dangerouslySetInnerHTML={{ __html: changelogContent }} />
                </div>
              </div>
            </div>
          </BentoCardWrapper>
        </div>

        {/* And much more */}
        <BentoCardWrapper className="h-full min-h-[465px] w-full min-w-[350px] xl:w-1/3">
          <div className="p-7">
            <h1 className="font-medium text-foreground text-lg">
              Receive Updates
            </h1>
            <p className="mt-2 font-light text-foreground/60 text-sm">
              Users can subscribe to your changelog to automatically get
              notified when you post an update.
            </p>

            {/* Platforms */}
            <div className="mt-5 flex h-[280px] flex-col items-start justify-evenly">
              {/* Twitter */}
              <div className="flex h-14 flex-row items-center gap-5">
                <div className="flex h-full min-w-[56px] items-center justify-center rounded-lg border border-border/50 bg-[#1DA1F2]/10">
                  <TwitterLogoIcon className="h-8 w-8 text-[#1DA1F2]/80" />
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-foreground text-sm">
                    Twitter
                  </span>
                  <span className="font-light text-foreground/60 text-sm">
                    Account that users can follow to get updates.
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex h-14 flex-row items-center gap-5">
                <div className="flex h-full min-w-[56px] items-center justify-center rounded-lg border border-border/50 bg-[#D44638]/10">
                  <MailIcon className="h-8 w-8 stroke-[1.5px] text-[#D44638]/80" />
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-foreground text-sm">
                    Email
                  </span>
                  <span className="font-light text-foreground/60 text-sm">
                    Email that users can subscribe to.
                  </span>
                </div>
              </div>

              {/* RSS */}
              <div className="flex h-14 flex-row items-center gap-5">
                <div className="flex h-full min-w-[56px] items-center justify-center rounded-lg border border-border/50 bg-[#FFA500]/10">
                  <RssIcon className="h-8 w-8 stroke-[1.5px] text-[#FFA500]/80" />
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-medium text-foreground text-sm">
                    RSS
                  </span>
                  <span className="font-light text-foreground/60 text-sm">
                    RSS feed that users can subscribe to.
                  </span>
                </div>
              </div>
            </div>

            <span className="font-light text-foreground/60 text-sm">
              And much more...
            </span>
          </div>
        </BentoCardWrapper>
      </div>
    </div>
  );
}
