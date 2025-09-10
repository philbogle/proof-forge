
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

interface ProofViewProps {
  proof: string;
  renderMarkdown: boolean;
  onToggleRenderMarkdown: (checked: boolean) => void;
  isLoading: boolean;
}

const ProofView = React.forwardRef<HTMLDivElement, ProofViewProps>(
  ({ proof, renderMarkdown, onToggleRenderMarkdown, isLoading }, ref) => {
    return (
      <Card ref={ref} className="max-h-[60vh] overflow-y-auto">
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
        <CardContent>
          {isLoading ? (
            <ProofLoadingIndicator />
          ) : renderMarkdown ? (
            <ProofDisplay content={proof} />
          ) : (
            <pre className="whitespace-pre-wrap font-code text-sm">
              <code>{proof}</code>
            </pre>
          )}
        </CardContent>
      </Card>
    );
  }
);

ProofView.displayName = 'ProofView';

export default ProofView;
