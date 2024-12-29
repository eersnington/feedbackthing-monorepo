import { env } from '@repo/env';
import { FeatureRow } from './feature-row';
import { PricingPlan } from './pricing-plan';

const pricingPlans = [
  {
    title: 'Hobby',
    description:
      'Get started with the essentials for free. Ideal for testing the waters and collecting feedback on a small scale.',
    price: 'Free',
    buttonText: 'Get Started for Free',
    buttonLink: env.NEXT_PUBLIC_APP_URL,
  },
  {
    title: 'Lite',
    description:
      'Upgrade to handle growing needs with more projects and customization options. Perfect for side hustles or solopreneurs.',
    price: '$16',
    buttonText: 'Get Started for Free',
    buttonLink: env.NEXT_PUBLIC_APP_URL,
    isPopular: true,
  },
  {
    title: 'Growth',
    description:
      'Scale effortlessly with advanced features and integrations to manage multiple projects and larger teams efficiently.',
    price: '$32',
    buttonText: 'Get Started for Free',
    buttonLink: env.NEXT_PUBLIC_APP_URL,
  },
];

const features = [
  {
    feature: 'Projects',
    startup: '1 project',
    growth: '5 projects',
    enterprise: 'Unlimited projects',
  },
  { feature: 'Customization', startup: true, growth: true, enterprise: true },
  { feature: 'Custom Domain', startup: false, growth: true, enterprise: true },
  {
    feature: 'Analytics',
    startup: false,
    growth: true,
    enterprise: true,
  },
  {
    feature: 'API Access',
    startup: false,
    growth: false,
    enterprise: true,
  },
  {
    feature: 'Team Members',
    startup: false,
    growth: false,
    enterprise: '5 members',
  },
  {
    feature: 'Integrations',
    startup: '1 (Discord)',
    growth: '3 (Discord, GitHub, Slack)',
    enterprise: '5+ (Discord, GitHub, Linear, Slack, etc)',
  },
];

export default function Pricing() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl text-center font-regular text-3xl tracking-tighter md:text-5xl">
              Prices that make sense!
            </h2>
            <p className="max-w-xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
              Managing a startup today is already tough.
            </p>
          </div>
          <div className="grid w-full grid-cols-3 divide-x pt-20 text-left lg:grid-cols-4">
            <div className="col-span-3 lg:col-span-1" />
            {pricingPlans.map((plan, index) => (
              <PricingPlan key={index} {...plan} />
            ))}
            <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6">
              <b>Features</b>
            </div>
            <div />
            <div />
            <div />
            {features.map((feature, index) => (
              <FeatureRow key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
