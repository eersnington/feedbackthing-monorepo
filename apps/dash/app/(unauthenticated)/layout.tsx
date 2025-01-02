import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { env } from '@repo/env';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  readonly children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="container relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
      <div className="absolute inset-0 bg-zinc-900" />
      <div className="relative z-20 flex items-center gap-x-2 bg-gradient-to-b bg-opacity-100 from-white to-neutral-50 bg-clip-text font-semibold text-2xl text-transparent">
        <Image
          src="/logo-black.svg"
          alt="Feedbackthing"
          width={54}
          height={54}
          className="rounded-xl drop-shadow-lg filter"
        />
        Feedbackthing
      </div>
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="relative z-20 mt-auto">
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Before Feedbackthing, our user feedback was scattered
              across Notion docs and Slack threads. Now our product team has a
              single source of truth for user insights, helping us ship features
              that actually get used. Our feature adoption rate has improved by
              40%.&rdquo;
            </p>
            <footer className="text-sm">
              Sarah Lin, Head of Product at Mercury
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
    <div className="lg:p-8">
      <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-6">
        {children}
        <p className="px-8 text-center text-muted-foreground text-sm">
          By clicking continue or signing in, you agree to our{' '}
          <Link
            href={new URL('/legal/terms', env.NEXT_PUBLIC_WEB_URL).toString()}
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href={new URL('/legal/privacy', env.NEXT_PUBLIC_WEB_URL).toString()}
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  </div>
);

export default AuthLayout;
