import { Button } from '@repo/design-system/components/ui/button';
import { formatRootUrl } from '@repo/design-system/lib/utils';
import {} from 'lucide-react';
import Link from 'next/link';

export const CTA = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="my-10 flex h-[60vh] w-full flex-col items-center justify-center">
        <div className="-z-10 absolute h-2/3 w-full">
          <div className="absolute h-full w-full bg-[radial-gradient(#2e2e2f_0.5px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_40%_40%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
        <h1 className="gap-2 text-center font-medium text-3xl text-foreground leading-tight sm:text-5xl">
          Start building better
          <br /> products today.
        </h1>
        <p className="mt-5 w-full max-w-4xl text-center font-light text-base text-foreground/60 sm:text-xl">
          Feedbackthing is the simplest way to listen to your users and improve
          your product. <br className="hidden md:block" />
          Set up your feedback hub now and start building what matters most.
        </p>

        <div className="mt-10 flex w-full flex-row items-center justify-center gap-5">
          <Link href={formatRootUrl('dash', '/signup')}>
            <Button className="inline-flex border border-background">
              Get Started
            </Button>
          </Link>

          <Link
            href={formatRootUrl('hub')}
            className="group relative grid h-9 items-center overflow-hidden rounded-md px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200"
          >
            <span className="backdrop absolute inset-[1px] rounded-md bg-root transition-colors duration-200 group-hover:bg-accent" />
            <span className="z-10 py-0.5 text-neutral-100 text-sm">
              View Demo
            </span>
          </Link>
        </div>
      </div>
    </div>
  </div>
);
