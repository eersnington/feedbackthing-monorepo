'use client';

import { Button } from '@repo/design-system/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/design-system/components/ui/sheet';
import useScroll from '@repo/design-system/lib/hooks/use-scroll';
import { formatRootUrl } from '@repo/design-system/lib/utils';
import { cn } from '@repo/design-system/lib/utils';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

export const navTabs = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'Demo',
    href: '/demo',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export default function HomeNav() {
  const scrolled = useScroll(60);

  return (
    <div className="absolute top-0 z-50 flex h-20 w-full flex-row items-center justify-center px-5">
      <div
        className={cn(
          'flex w-full max-w-screen-2xl flex-row items-center justify-between',
          scrolled && 'justify-center'
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="bg-gradient-to-b bg-opacity-100 from-white to-neutral-50 bg-clip-text font-semibold text-transparent text-xl"
        >
          {/* <Icons.LogoText className='w-24 fill-foreground' /> */}
          Feedbackthing
        </Link>

        {/* Static Nav Tabs */}
        <div
          className={cn(
            'hidden h-[46px] flex-row items-center justify-center gap-2 rounded-full px-2 py-2.5 transition-all hover:border hover:bg-background sm:flex',
            scrolled && 'hidden'
          )}
        >
          {navTabs.map((tab) => (
            <Link
              href={tab.href}
              className="flex h-8 items-center justify-center rounded-full border border-transparent px-3 font-light text-foreground/80 text-sm transition-all hover:border-border hover:bg-foreground/5"
              key={tab.label.toLowerCase()}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Dynamic Nav Tabs */}
        <div
          className={cn(
            '-translate-y-full fixed top-4 flex h-[46px] transform flex-row items-center justify-center gap-2 rounded-full border bg-background px-2 py-2.5 opacity-0 shadow-md transition-transform',
            scrolled && 'translate-y-0 opacity-100'
          )}
        >
          {navTabs.map((tab) => (
            <Link
              href={tab.href}
              className="flex h-8 items-center justify-center rounded-full border border-transparent px-3 font-light text-foreground/80 text-sm transition-all hover:border-border hover:bg-foreground/5"
              key={tab.label.toLowerCase()}
            >
              {tab.label}
            </Link>
          ))}

          {scrolled ? (
            <Link href={formatRootUrl('dash', '/signup')}>
              <Button
                className="h-8 min-w-fit shrink-0 rounded-full border border-background px-2.5 font-normal text-sm sm:inline-flex"
                size="sm"
              >
                Get Started
              </Button>
            </Link>
          ) : null}
        </div>

        {/* Buttons */}
        <div className={cn('flex flex-row items-center justify-center gap-3')}>
          <Link href={formatRootUrl('dash', '/signup')} className="inline-flex">
            <Button className="h-8 sm:inline-flex" size="sm">
              Get Started
            </Button>
          </Link>

          {/* Mobile */}
          <Sheet>
            <SheetTrigger asChild className="sm:hidden">
              <Button
                size="icon"
                className="h-[34px] w-[34px] rounded-full border"
                variant="ghost"
              >
                <MenuIcon className="h-5 w-5 stroke-[1.5px] text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="items-start justify-start pb-3">
                <SheetTitle className="font-medium">Menu</SheetTitle>
              </SheetHeader>

              <div className="-ml-3 flex flex-col items-start justify-start gap-2">
                {navTabs.map((tab) => (
                  <SheetClose key={tab.label.toLowerCase()} asChild>
                    <Link
                      href={tab.href}
                      className="flex h-8 items-center px-3 font-light text-foreground/80 text-sm"
                    >
                      {tab.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
