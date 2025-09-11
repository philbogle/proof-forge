// src/components/proof-explorer/proof-view.tsx
import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ProofLoadingIndicator } from '@/components/proof-loading-indicator';
import { ProofDisplay } from '@/components/proof-display';
import { cn } from '@/lib/utils';

interface ProofViewProps {
  proof: string;
  renderMarkdown: boolean;
  onToggleRenderMarkdown: (checked: boolean) => void;
  isLoading: boolean;
  isFading: boolean;
}

const ProofView = React.forwardRef<HTMLDivElement, ProofViewProps>(
  ({ proof, renderMarkdown, onToggleRenderMarkdown, isLoading, isFading }, ref) => {
    return (
      <Card ref={ref}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Proof</CardTitle>
              <CardDescription>
                This is a dynamically generated presentation of the proof.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="markdown-toggle"
                className="text-sm font-medium"
              >
                Raw
              </Label>
              <Switch
                id="markdown-toggle"
                checked={!renderMarkdown}
                onCheckedChange={(checked) => onToggleRenderMarkdown(!checked)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="min-h-[250px]">
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
              <pre className="whitespace-pre-wrap font-code text-sm">
                <code>{proof}</code>
              </pre>
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
