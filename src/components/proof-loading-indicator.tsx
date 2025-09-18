// src/components/proof-loading-indicator.tsx
'use client';

import { Loader2 } from 'lucide-react';

export function ProofLoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p className="text-lg font-medium">Generating Proof...</p>
    </div>
  );
}
