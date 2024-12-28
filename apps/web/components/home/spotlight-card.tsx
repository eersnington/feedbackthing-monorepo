'use client';

import { cn } from '@repo/design-system/lib/utils';
import type React from 'react';
import { useRef,  useState } from 'react';

export default function BentoCardWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // biome-ignore lint/style/useBlockStatements: <explanation>
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    // setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    // biome-ignore lint/nursery/noStaticElementInteractions: <explanation>
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative max-w-md select-none overflow-hidden rounded-md border bg-[#0F1116]',
        className
      )}
    >
      <div
        className="-inset-px pointer-events-none absolute hidden opacity-0 transition duration-300 sm:block"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.06), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}
