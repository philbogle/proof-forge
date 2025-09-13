'use client';

import { WandSparkles } from 'lucide-react';

export function ProofLoadingIndicator() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border-dashed text-center">
      <div className="relative h-28 w-28">
        <WandSparkles className="absolute h-24 w-24 text-primary animate-float" />
        <div className="sparkle-container">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{ '--sparkle-angle': `${i * 30}deg` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="font-semibold text-foreground">Generating Proof...</p>
        <p className="text-sm text-muted-foreground">
          Our AI mathematician is hard at work. Please wait a moment.
        </p>
      </div>
    </div>
  );
}
