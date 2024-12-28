import { GridPattern } from '@repo/design-system/components/ui/grid-pattern';
import { Spotlight } from '@repo/design-system/components/ui/spotlight';
import { cn } from '@repo/design-system/lib/utils';
import Image from 'next/image';

export default function SpotlightPreview() {
  return (
    <div className="relative flex min-h-dvh w-full overflow-hidden rounded-md bg-black/[0.96] bg-grid-white/[0.02] antialiased md:items-center md:justify-center">
      <Spotlight
        className="-top-40 md:-top-20 left-0 md:left-60"
        fill="white"
      />
      <GridPattern
        width={80}
        height={80}
        squares={[
          // Core center pattern (5-12 range)
          [7, 8],
          [7, 8], // repeated for emphasis
          [8, 7],
          [8, 7], // repeated for emphasis
          [6, 6],
          [9, 9],
          [7, 10],
          [10, 7],
          [8, 11],
          [11, 8],
          [6, 9],
          [9, 6],

          // Scattered elements
          [5, 8],
          [8, 5],
          [11, 11],
          [12, 9],
          [9, 12],
          [6, 11],

          // Outer elements for depth
          [4, 7],
          [13, 8],
          [8, 14],
          [14, 9],
          [3, 10],
          [15, 7],

          // Far elements for atmosphere
          [2, 8],
          [16, 9],
          [9, 15],
          [7, 2],
        ]}
        className={cn(
          '[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] h-[200%]'
        )}
      />{' '}
      <div className=" relative z-10 mx-auto mb-12 w-full max-w-4xl p-4 py-20 md:pt-0">
        <div className="flex w-full flex-row items-center justify-center gap-4">
          <Image
            src="/logo-black.svg"
            width={96}
            height={96}
            alt="Logo Dark"
            className="mx-2 rounded-2xl"
          />
          <h1 className="bg-gradient-to-b bg-opacity-50 from-neutral-50 to-neutral-400 bg-clip-text text-center font-bold text-4xl text-transparent md:text-7xl">
            Feedbackthing
          </h1>
        </div>

        <p className="mt-12 bg-gradient-to-b bg-opacity-50 from-neutral-50 to-neutral-400 bg-clip-text text-center font-medium text-4xl text-transparent">
          Build products that your users love.
        </p>
      </div>
    </div>
  );
}
