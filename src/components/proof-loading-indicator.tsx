// src/components/proof-loading-indicator.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const generationSteps = [
  'Polishing the abacus...',
  'Consulting Euclid whispers...',
  'Untangling logical knots...',
  'Dividing by zero (then quickly undoing)...',
  'Arguing with Fermat...',
  'Checking for paradoxes...',
  'Adding Q.E.D. with a flourish...',
];

function ProofGenerationAnimator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % generationSteps.length);
    }, 2500); // Change step every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-8 w-full max-w-xs overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center text-center"
        >
          <p className="text-lg font-medium text-muted-foreground">
            {generationSteps[index]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function ProofLoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-muted-foreground">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="text-center">
        <p className="text-xl font-semibold text-foreground mb-2">Generating Proof</p>
        <p className="text-sm text-muted-foreground mb-6">This may take a moment...</p>
      </div>
      <ProofGenerationAnimator />
    </div>
  );
}
