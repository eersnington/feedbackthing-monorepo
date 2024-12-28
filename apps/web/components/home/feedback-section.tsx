'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import { Button } from '@repo/design-system/components/ui/button';
import { PROSE_CN } from '@repo/design-system/lib/constants';
import { cn } from '@repo/design-system/lib/utils';
import RichTextEditor from '@repo/tiptap-editor/components/tiptap-editor';
import { ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { StatusCombobox } from '../dashboard/status-combobox';
import { TagCombobox } from '../dashboard/tag-combobox';
import BentoCardWrapper from './spotlight-card';

const demoTags = [
  {
    value: 'feature',
    label: 'Feature',
    color: '#F87171',
  },
  {
    value: 'bug',
    label: 'Bug',
    color: '#FBBF24',
  },
  {
    value: 'question',
    label: 'Question',
    color: '#60A5FA',
  },
  {
    value: 'other',
    label: 'Other',
    color: '#6EE7B7',
  },
];

export default function FeedbackSection() {
  const [upvotes, setUpvotes] = useState(63);
  const [commentContent, setCommentContent] = useState(
    '<p><strong>try</strong> <mark>writing</mark> <em>markdown</em> in here!</p>'
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-2 pb-60">
      <span className="select-none bg-gradient-to-t from-[#c7d2fe] to-[#8678f9] bg-clip-text text-lg text-transparent sm:text-xl">
        Capture feedback
      </span>

      <h1 className="w-full gap-2 text-center font-medium text-3xl text-white leading-tight sm:text-4xl">
        Build your feedback community
      </h1>

      <p className="mt-2 w-[800px] max-w-full text-center font-light text-sm text-white/60 sm:text-base">
        A place for your users to give feedback, support creative ideas, and
        have meaningful discussions about product features and improvements.
      </p>

      {/* Bento  */}
      <div className="mt-10 flex w-full flex-col items-center justify-center gap-5 xl:flex-row">
        {/* Upvotes */}
        <div className="flex w-full flex-col items-center justify-center gap-5 md:flex-row xl:w-fit">
          <BentoCardWrapper className="h-[260px] w-full min-w-[350px]">
            <div className="p-7">
              <h1 className="font-medium text-lg text-white">
                Prioritize with voting
              </h1>
              <p className="mt-2 font-light text-sm text-white/60">
                Stop guessing - let your users tell you what they want to see
                next.
              </p>
            </div>

            <div className="group flex h-32 w-full translate-x-7 cursor-pointer flex-row items-stretch justify-between rounded-tl-md border-t border-l transition-all">
              <div className="flex items-center border-r">
                {/* Upvotes */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="group/upvote flex h-full flex-col items-center rounded-sm px-4 transition-all duration-200 hover:bg-transparent active:scale-[80%]"
                  onClick={() => {
                    setUpvotes(upvotes === 62 ? 63 : 62);
                  }}
                >
                  {/* Arrow */}
                  <ChevronUp
                    className={cn(
                      'h-4 font-light text-sm transition-colors ',
                      upvotes === 63 ? 'text-foreground' : 'text-foreground/60'
                    )}
                  />

                  {/* Upvotes */}
                  <div
                    className={cn(
                      'font-light text-sm transition-colors',
                      upvotes === 63 ? 'text-foreground' : 'text-foreground/60'
                    )}
                  >
                    {upvotes}
                  </div>
                </Button>
              </div>

              <div className="flex flex-grow flex-col items-start justify-between gap-3 p-4">
                <div className="flex flex-col gap-1">
                  {/* Title */}
                  <span className="line-clamp-2 pr-10 font-medium text-foreground/90 text-sm">
                    Allow custom domains
                  </span>

                  {/* Description */}
                  <div
                    className={cn('line-clamp-2 max-w-full text-sm', PROSE_CN)}
                  >
                    Allow custom domains for each project. This will allow users
                    to use their own domain for the feedback portal.
                  </div>
                </div>

                {/* Author */}
                <div className="flex select-none flex-row items-center justify-start gap-2 font-light text-foreground/60">
                  {/* User */}
                  <Avatar className="h-6 w-6 gap-2 border">
                    <AvatarImage
                      src="https://avatars.githubusercontent.com/u/65873518?v=4"
                      alt=""
                    />
                    <AvatarFallback className="font-light text-xs">
                      CT
                    </AvatarFallback>
                  </Avatar>
                  {/* Name */}
                  <span className="font-extralight text-foreground/70 text-sm">
                    Christo Todorov
                  </span>
                  ·{/* Time ago */}
                  <span className="font-extralight text-foreground/50 text-xs">
                    2h ago
                  </span>
                </div>
              </div>
            </div>
          </BentoCardWrapper>

          {/* Tags */}
          <BentoCardWrapper className="h-[260px] w-full min-w-[350px]">
            <div className="h-full p-7">
              <h1 className="font-medium text-lg text-white">
                Categorize your feedback
              </h1>
              <p className="mt-2 font-light text-sm text-white/60">
                Simplify feedback organization with tags and statuses for better
                user understanding.
              </p>

              <div className="mt-3 flex h-full flex-col items-start gap-3">
                <TagCombobox
                  projectTags={demoTags}
                  onSelect={(tags) =>
                    demoTags.filter((tag) => tags.includes(tag.value))
                  }
                  triggerClassName="w-full sm:w-full mt-5"
                  demo
                />

                <StatusCombobox triggerClassName="w-full mt-5" />
              </div>
            </div>
          </BentoCardWrapper>
        </div>

        {/* Comments */}
        <BentoCardWrapper className="h-[260px] w-full min-w-[350px] xl:w-1/3">
          <div className="p-7">
            <h1 className="font-medium text-lg text-white">
              Discuss with your users
            </h1>
            <p className="mt-2 font-light text-sm text-white/60">
              Engage users, answer questions, and foster meaningful product
              discussions.
            </p>

            <div className="prose-invert mt-8 mb-2 flex h-[98px] w-full flex-col items-center justify-end rounded-sm border p-4">
              {/* Editable Comment div with placeholder */}
              <RichTextEditor
                content={commentContent}
                setContent={setCommentContent}
                placeholder="Write your comment here..."
                characterLimit={50}
                className="overflow-auto"
                proseInvert
              />

              {/* Bottom Row */}
              <div className="flex w-full flex-row items-center justify-between pt-1.5">
                {/* Max char */}
                <span className="font-extralight text-foreground/60 text-sm">
                  {commentContent.replace(/<[^>]+>/gi, '').length}/50
                </span>

                {/* Submit Button */}
                <Button
                  variant="outline"
                  className="flex h-8 items-center justify-between gap-2 border font-extralight text-foreground/60 sm:w-fit"
                  size="sm"
                  onClick={() => {
                    toast.promise(
                      new Promise<void>((resolve) => {
                        setTimeout(() => {
                          resolve();
                        }, 1750);
                      }),
                      {
                        loading: 'Posting comment...',
                        success: 'Comment posted!',
                        error: 'Failed to post comment.',
                      }
                    );
                  }}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </BentoCardWrapper>
      </div>
    </div>
  );
}
