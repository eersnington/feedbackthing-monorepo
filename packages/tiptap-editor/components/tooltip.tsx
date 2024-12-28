import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import type React from 'react';

export default function DefaultTooltip({
  children,
  content,
  disabled,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip open={disabled ? false : undefined}>
        <TooltipTrigger asChild className="select-none">
          {children}
        </TooltipTrigger>
        <TooltipContent className="flex h-8 items-center justify-center">
          <span className="font-normal text-foreground/50 text-xs">
            {content}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
