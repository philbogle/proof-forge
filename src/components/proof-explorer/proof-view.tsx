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
import { Skeleton } from '../ui/skeleton';

interface ProofViewProps {
  proof: string;
  renderMarkdown: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  isFading: boolean;
  isEditable: boolean;
  onRawProofChange: (newProof: string) => void;
}

const ProofView = React.forwardRef<HTMLDivElement, ProofViewProps>(
  ({ proof, renderMarkdown, isLoading, isGenerating, isFading, isEditable, onRawProofChange }, ref) => {

    const showLoadingSkeleton = isLoading && !isGenerating;

    return (
      <Card ref={ref} className='p-6 scroll-mt-32'>
        <CardContent className={cn("min-h-[450px] p-0", (isLoading || isGenerating) && "flex items-center justify-center")}>
          {isGenerating ? (
            <ProofLoadingIndicator />
          ) : showLoadingSkeleton ? (
             <div className="space-y-6 w-full">
                <Skeleton className="h-8 w-4/5" />
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-10/12" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
             </div>
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
