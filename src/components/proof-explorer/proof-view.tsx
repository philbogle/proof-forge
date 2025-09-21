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
import { TextSelectionPopover } from './text-selection-popover';

interface ProofViewProps {
  proof: string;
  renderMarkdown: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  isFading: boolean;
  isEditable: boolean;
  onRawProofChange: (newProof: string) => void;
  onExplainSelection: (selection: string) => void;
}

const ProofView = React.forwardRef<HTMLDivElement, ProofViewProps>(
  ({ proof, renderMarkdown, isLoading, isGenerating, isFading, isEditable, onRawProofChange, onExplainSelection }, ref) => {
    const [selection, setSelection] = React.useState<{ text: string; rect: DOMRect | null }>({ text: '', rect: null });
    const contentRef = React.useRef<HTMLDivElement>(null);

    const handleMouseUp = () => {
      const currentSelection = window.getSelection();
      if (currentSelection && currentSelection.toString().trim().length > 0) {
        const range = currentSelection.getRangeAt(0);
        if (contentRef.current && contentRef.current.contains(range.commonAncestorContainer)) {
          setSelection({
            text: currentSelection.toString(),
            rect: range.getBoundingClientRect(),
          });
        } else {
            setSelection({ text: '', rect: null });
        }
      } else {
        setSelection({ text: '', rect: null });
      }
    };

    const handleExplain = () => {
      onExplainSelection(selection.text);
      setSelection({ text: '', rect: null });
    };

    React.useEffect(() => {
        // Close popover if user scrolls
        const handleScroll = () => {
            if (selection.rect) {
                setSelection({ text: '', rect: null });
            }
        };
        window.addEventListener('scroll', handleScroll, true); // Use capture to get scroll events early
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [selection.rect]);

    const showLoadingSkeleton = isLoading && !isGenerating;

    return (
      <Card ref={ref} className='p-6 scroll-mt-32'>
        <CardContent 
            className={cn("min-h-[450px] p-0 relative", isGenerating && "flex items-center justify-center")}
            onMouseUp={handleMouseUp}
            ref={contentRef}
        >
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

           {selection.rect && (
                <TextSelectionPopover
                    selectionRect={selection.rect}
                    containerRef={contentRef}
                    onExplain={handleExplain}
                    onClose={() => setSelection({ text: '', rect: null })}
                />
            )}
        </CardContent>
      </Card>
    );
  }
);

ProofView.displayName = 'ProofView';

export default ProofView;
