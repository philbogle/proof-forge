'use client';

import { Loader2 } from 'lucide-react';

export function ProofLoadingIndicator() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border-dashed text-center">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <div className="flex flex-col items-center gap-1">
        <p className="font-semibold text-foreground">Generating Proof...</p>
        <p className="text-sm text-muted-foreground">
          Our AI mathematician is hard at work. Please wait a moment.
        </p>
      </div>
    </div>
  );
}
