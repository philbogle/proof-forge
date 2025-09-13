// src/components/proof-explorer/interaction-panel.tsx
import * as React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ProofDisplay } from '@/components/proof-display';

interface InteractionPanelProps {
  interactionText: string;
  onInteractionTextChange: (text: string) => void;
  onInteract: (type: 'question' | 'edit') => void;
  isInteractionLoading: boolean;
  answer: string;
  isUserSignedIn: boolean;
}

export default function InteractionPanel({
  interactionText,
  onInteractionTextChange,
  onInteract,
  isInteractionLoading,
  answer,
  isUserSignedIn,
}: InteractionPanelProps) {
  const [activeTab, setActiveTab] = React.useState('question');
  
  React.useEffect(() => {
    if (!isUserSignedIn && activeTab === 'edit') {
      setActiveTab('question');
    }
  }, [isUserSignedIn, activeTab]);

  return (
    <div className="p-1 pt-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="question">Ask a Question</TabsTrigger>
          <TabsTrigger value="edit" disabled={!isUserSignedIn}>
            Request an Edit
          </TabsTrigger>
        </TabsList>
        <TabsContent value="question" className="space-y-4">
          <div className="mt-4 flex gap-2 font-body">
            <Input
              placeholder="e.g., What does 'Q.E.D.' mean?"
              value={interactionText}
              onChange={(e) => onInteractionTextChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onInteract('question')}
            />
            <Button
              onClick={() => onInteract('question')}
              disabled={isInteractionLoading}
            >
              {isInteractionLoading && activeTab === 'question' && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isInteractionLoading && activeTab === 'question' ? 'Thinking...' : 'Ask'}
            </Button>
          </div>
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
          <div className="mt-4 flex gap-2 font-body">
            <Input
              placeholder="e.g., Explain the first step in more detail."
              value={interactionText}
              onChange={(e) => onInteractionTextChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onInteract('edit')}
              disabled={!isUserSignedIn}
            />
            <Button
              onClick={() => onInteract('edit')}
              disabled={isInteractionLoading || !isUserSignedIn}
            >
              {isInteractionLoading && activeTab === 'edit' && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isInteractionLoading && activeTab === 'edit' ? 'Editing...' : 'Submit Edit'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
