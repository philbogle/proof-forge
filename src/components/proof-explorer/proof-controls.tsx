
// src/components/proof-explorer/proof-controls.tsx
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import type { FormalityLevel, Theorem } from '@/lib/types';

interface ProofControlsProps {
  selectedTheorem: Theorem;
  formalityLevels: { id: FormalityLevel; name: string }[];
  formalityLevel: FormalityLevel;
  isProofLoading: boolean;
  onFormalityChange: (level: FormalityLevel) => void;
  onRefresh: () => void;
}

export default function ProofControls({
  selectedTheorem,
  formalityLevels,
  formalityLevel,
  isProofLoading,
  onFormalityChange,
  onRefresh,
}: ProofControlsProps) {
  return (
    <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-6 flex flex-col items-start justify-between gap-4 border-b border-border bg-gray-50/80 p-4 backdrop-blur-sm md:flex-row md:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {selectedTheorem.name}
        </h2>
      </div>
      <div className="flex flex-col items-start gap-2 md:items-end">
        <Label className="text-xs text-muted-foreground">
          Formality Level
        </Label>
        <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
          {formalityLevels.map((level) => (
            <Button
              key={level.id}
              variant={formalityLevel === level.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onFormalityChange(level.id)}
              className="h-8 px-2 text-xs md:px-3 md:text-sm"
              disabled={isProofLoading}
            >
              {level.name}
            </Button>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                disabled={isProofLoading}
                className="h-8 w-8"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isProofLoading ? 'animate-spin' : ''}`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh Proof</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
