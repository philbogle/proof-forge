// src/components/proof-explorer/pagination-controls.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Label } from '../ui/label';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationControlsProps) {
  const handlePrevious = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  if (totalPages <= 1 && !isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-2 md:items-end">
      <Label className="text-xs text-muted-foreground">Step</Label>
      <div className="flex items-center space-x-2 rounded-lg border bg-card p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage <= 1 || isLoading}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium text-muted-foreground">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={currentPage >= totalPages || isLoading}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
