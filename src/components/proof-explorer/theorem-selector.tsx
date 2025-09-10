
// src/components/proof-explorer/theorem-selector.tsx
import * as React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Theorem } from '@/lib/types';

interface TheoremSelectorProps {
  theorems: Theorem[];
  selectedTheoremId: string;
  onTheoremChange: (theoremId: string) => void;
}

export default function TheoremSelector({
  theorems,
  selectedTheoremId,
  onTheoremChange,
}: TheoremSelectorProps) {
  return (
    <div className="mb-8 grid grid-cols-1 items-end gap-4">
      <div className="col-span-1 flex flex-col gap-2">
        <Label htmlFor="theorem-select" className="text-sm font-medium">
          Theorem
        </Label>
        <Select value={selectedTheoremId} onValueChange={onTheoremChange}>
          <SelectTrigger id="theorem-select" className="bg-white">
            <SelectValue placeholder="Select a theorem" />
          </SelectTrigger>
          <SelectContent>
            {theorems.map((theorem) => (
              <SelectItem key={theorem.id} value={theorem.id}>
                {theorem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
