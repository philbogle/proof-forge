// src/components/proof-loading-indicator.tsx
'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ProofLoadingIndicator() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-3/4 rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}
