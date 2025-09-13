// src/components/proof-explorer/proof-view.tsx
import * as React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { ProofLoadingIndicator } from '@/components/proof-loading-indicator';
import { ProofDisplay } from '@/components/proof-display';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

interface ProofViewProps {
  proof: string;
  renderMarkdown: boolean;
  isLoading: boolean;
  isFading: boolean;
  isEditable: boolean;
  onRawProofChange: (newProof: string) => void;
}

const ProofView = React.forwardRef<HTMLDivElement, ProofViewProps>(
  ({ proof, renderMarkdown, isLoading, isFading, isEditable, onRawProofChange }, ref) => {
    return (
      <Card ref={ref}>
        <CardContent className="min-h-[250px] p-6">
          {isLoading ? (
            <ProofLoadingIndicator />
          ) : (
             <div
              className={cn(
                'transition-opacity duration-500 ease-out',
                isFading ? 'opacity-0' : 'opacity-100'
              )}
            >
            {renderMarkdown ? (
              <ProofDisplay content={proof} />
            ) : (
              <Textarea
                className="min-h-[400px] text-sm"
                value={proof}
                onChange={(e) => onRawProofChange(e.target.value)}
                readOnly={!isEditable}
              />
            )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

ProofView.displayName = 'ProofView';

export default ProofView;
