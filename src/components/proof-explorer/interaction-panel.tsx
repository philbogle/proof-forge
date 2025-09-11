
// src/components/proof-explorer/interaction-panel.tsx
import * as React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ProofDisplay } from '@/components/proof-display';

interface InteractionPanelProps {
  interactionText: string;
  onInteractionTextChange: (text: string) => void;
  onInteract: (type: 'question' | 'edit') => void;
  isInteractionLoading: boolean;
  answer: string;
}

export default function InteractionPanel({
  interactionText,
  onInteractionTextChange,
  onInteract,
  isInteractionLoading,
  answer,
}: InteractionPanelProps) {
  return (
    <div className="p-1 pt-4">
      <Tabs defaultValue="question" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="question">Ask a Question</TabsTrigger>
          <TabsTrigger value="edit">Request an Edit</TabsTrigger>
        </TabsList>
        <TabsContent value="question" className="space-y-4">
          <Textarea
            placeholder="e.g., What does 'Q.E.D.' mean?"
            value={interactionText}
            onChange={(e) => onInteractionTextChange(e.target.value)}
            className="mt-4 min-h-[100px] font-body"
          />
          <Button
            onClick={() => onInteract('question')}
            disabled={isInteractionLoading}
          >
            {isInteractionLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isInteractionLoading ? 'Thinking...' : 'Ask'}
          </Button>
          {answer && (
            <div className="mt-4 rounded-lg border bg-secondary/50 p-4">
              <p className="font-semibold text-secondary-foreground">
                Answer:
              </p>
              <div className="prose prose-blue dark:prose-invert max-w-none font-body text-sm text-muted-foreground">
                <ProofDisplay content={answer} />
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="edit" className="space-y-4">
          <Textarea
            placeholder="e.g., Explain the first step in more detail."
            value={interactionText}
            onChange={(e) => onInteractionTextChange(e.target.value)}
            className="mt-4 min-h-[100px] font-body"
          />
          <Button
            onClick={() => onInteract('edit')}
            disabled={isInteractionLoading}
          >
            {isInteractionLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isInteractionLoading ? 'Editing...' : 'Submit Edit'}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
