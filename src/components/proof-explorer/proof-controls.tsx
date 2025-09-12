// src/components/proof-explorer/proof-controls.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import type { FormalityLevel } from '@/lib/types';
import PaginationControls from './pagination-controls';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface ProofControlsProps {
  formalityLevels: { id: FormalityLevel; name: string }[];
  formalityLevel: FormalityLevel;
  isProofLoading: boolean;
  onFormalityChange: (level: FormalityLevel) => void;
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProofControls({
  formalityLevels,
  formalityLevel,
  isProofLoading,
  onFormalityChange,
  onRefresh,
  currentPage,
  totalPages,
  onPageChange,
}: ProofControlsProps) {

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-stretch gap-2 rounded-lg border bg-card p-1">
          <div className="flex items-center gap-1">
            {formalityLevels.map((level) => (
              <Button
                key={level.id}
                variant={formalityLevel === level.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFormalityChange(level.id)}
                className="h-8 flex-1 px-2 text-xs md:px-3 md:text-sm"
                disabled={isProofLoading}
              >
                {level.name}
              </Button>
            ))}
          </div>
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isProofLoading}
        />
      </div>
    </div>
  );
}
