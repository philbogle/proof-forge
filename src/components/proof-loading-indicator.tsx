'use client';

import { WandSparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Sparkle {
  id: number;
  style: React.CSSProperties;
}

export function ProofLoadingIndicator() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * 360;
        const radius = Math.random() * 25 + 40;
        return {
          id: i,
          style: {
            animation: `sparkle 2s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px)`,
          },
        };
      });
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card p-8 text-center">
      <div className="relative h-24 w-24">
        <WandSparkles className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-pulse text-primary" />
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-primary"
            style={sparkle.style}
          />
        ))}
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
