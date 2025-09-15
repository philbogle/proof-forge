'use client';

import { Loader2 } from 'lucide-react';

export function ProofLoadingIndicator() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border-dashed text-center">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
