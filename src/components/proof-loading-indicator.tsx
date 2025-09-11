import { Wand2 } from 'lucide-react';

export function ProofLoadingIndicator() {
  const sparkles = Array.from({ length: 12 });

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card p-8 text-center">
      <div className="relative h-16 w-16">
        <Wand2 className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-pulse text-primary" />
        {sparkles.map((_, i) => {
          const angle = (i / sparkles.length) * 360;
          const radius = Math.random() * 20 + 30;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-primary"
              style={{
                animation: `sparkle 2s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px)`,
              }}
            />
          );
        })}
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
