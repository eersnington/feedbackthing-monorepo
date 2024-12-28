'use client';

import { Check, Minus } from 'lucide-react';

interface FeatureRowProps {
  feature: string;
  startup: string | boolean;
  growth: string | boolean;
  enterprise: string | boolean;
}

export function FeatureRow({
  feature,
  startup,
  growth,
  enterprise,
}: FeatureRowProps) {
  const renderCell = (value: string | boolean) => {
    if (typeof value === 'string') {
      return <p className="text-muted-foreground text-sm">{value}</p>;
    }
    return value ? (
      <Check className="h-4 w-4 text-primary" />
    ) : (
      <Minus className="h-4 w-4 text-muted-foreground" />
    );
  };

  return (
    <>
      <div className="col-span-3 px-3 py-4 lg:col-span-1 lg:px-6">
        {feature}
      </div>
      <div className="flex justify-center px-3 py-1 md:px-6 md:py-4">
        {renderCell(startup)}
      </div>
      <div className="flex justify-center px-3 py-1 md:px-6 md:py-4">
        {renderCell(growth)}
      </div>
      <div className="flex justify-center px-3 py-1 md:px-6 md:py-4">
        {renderCell(enterprise)}
      </div>
    </>
  );
}
