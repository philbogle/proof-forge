import { Wand2 } from 'lucide-react';

export function ProofLoadingIndicator() {
  const sparkles = Array.from({ length: 4 });

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-card p-8 text-center">
      <div className="relative">
        <Wand2 className="h-10 w-10 animate-pulse text-primary" />
        {sparkles.map((_, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-primary"
            style={{
              animation: `sparkle 1.5s ease-in-out infinite ${i * 0.2}s`,
              transformOrigin: 'center',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateX(30px)`,
            }}
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
