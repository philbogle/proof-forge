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
      <Card ref={ref} className='p-6'>
        <CardContent className="min-h-[250px] p-0">
          {isLoading ? (
            <ProofLoadingIndicator />
          ) : (
             <div
              className={cn(
                'transition-opacity duration-700 ease-in-out',
                isFading ? 'opacity-0' : 'opacity-100'
              )}
            >
            {!isEditable && renderMarkdown ? (
              <ProofDisplay content={proof} />
            ) : isEditable ? (
              <Textarea
                className="min-h-[400px] text-sm"
                value={proof}
                onChange={(e) => onRawProofChange(e.target.value)}
              />
            ) : (
                <ProofDisplay content={proof} />
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
