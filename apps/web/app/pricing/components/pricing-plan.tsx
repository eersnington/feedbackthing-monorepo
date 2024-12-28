import { Button } from '@repo/design-system/components/ui/button';
import { MoveRight, PhoneCall } from 'lucide-react';
import Link from 'next/link';

interface PricingPlanProps {
  title: string;
  description: string;
  price: string;
  buttonText: string;
  buttonLink: string;
  isPopular?: boolean;
}

export function PricingPlan({
  title,
  description,
  price,
  buttonText,
  buttonLink,
  isPopular = false,
}: PricingPlanProps) {
  return (
    <div className="flex flex-col gap-2 px-3 py-1 md:px-6 md:py-4">
      <p className="text-2xl">{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
      <p className="mt-8 flex flex-col gap-2 text-xl lg:flex-row lg:items-center">
        <span className="text-4xl">{price}</span>
        <span className="text-muted-foreground text-sm"> / month</span>
      </p>
      <Button
        variant={isPopular ? 'default' : 'outline'}
        className="mt-8 gap-4"
        asChild
      >
        <Link href={buttonLink}>
          {buttonText}{' '}
          {buttonText === 'Contact us' ? (
            <PhoneCall className="h-4 w-4" />
          ) : (
            <MoveRight className="h-4 w-4" />
          )}
        </Link>
      </Button>
    </div>
  );
}
