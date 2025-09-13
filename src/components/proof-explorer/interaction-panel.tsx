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
import { Loader2, User, Bot, MessageSquare } from 'lucide-react';
import { ProofDisplay } from '@/components/proof-display';
import type { ConversationTurn } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface InteractionPanelProps {
  interactionText: string;
  onInteractionTextChange: (text: string) => void;
  onInteract: (type: 'question' | 'edit') => void;
  isInteractionLoading: boolean;
  conversationHistory: ConversationTurn[];
  isUserSignedIn: boolean;
}

export default function InteractionPanel({
  interactionText,
  onInteractionTextChange,
  onInteract,
  isInteractionLoading,
  conversationHistory,
  isUserSignedIn,
}: InteractionPanelProps) {
  const [activeTab, setActiveTab] = React.useState('question');
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);


  React.useEffect(() => {
    if (!isUserSignedIn && activeTab === 'edit') {
      setActiveTab('question');
    }
  }, [isUserSignedIn, activeTab]);

  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [conversationHistory, isInteractionLoading]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onInteract(activeTab as 'question' | 'edit');
    }
  }

  return (
    <div className="flex h-full flex-col p-4 max-h-[60vh]">
       <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        <h2 className="text-xl font-semibold">AI Assistant</h2>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="question">Ask a Question</TabsTrigger>
          <TabsTrigger value="edit" disabled={!isUserSignedIn}>
            Request an Edit
          </TabsTrigger>
        </TabsList>
        <TabsContent value="question" className="flex flex-1 flex-col space-y-4 mt-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4 -mr-4" viewportRef={viewportRef}>
             <div className="space-y-4" ref={scrollAreaRef}>
              {conversationHistory.map((turn, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                      <User className="h-5 w-5 text-secondary-foreground" />
                    </span>
                    <div className="flex-1 rounded-lg border bg-secondary/30 p-3 text-sm">
                      <p>{turn.question}</p>
                    </div>
                  </div>
                  {turn.answer && (
                    <div className="flex items-start gap-3">
                       <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </span>
                      <div className="flex-1 rounded-lg border bg-card p-3 text-sm">
                        <ProofDisplay content={turn.answer} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isInteractionLoading && activeTab === 'question' && (
                <div className="flex items-start gap-3">
                   <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </span>
                  <div className="flex-1 rounded-lg border bg-card p-3 text-sm">
                     <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
           <div className="mt-4 flex gap-2 border-t pt-4">
            <Input
              placeholder="e.g., What does 'Q.E.D.' mean?"
              value={interactionText}
              onChange={(e) => onInteractionTextChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={() => onInteract('question')}
              disabled={isInteractionLoading || !interactionText.trim()}
            >
              {isInteractionLoading && activeTab === 'question' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isInteractionLoading && activeTab === 'question' ? 'Thinking...' : 'Ask'}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="edit" className="flex flex-1 flex-col space-y-4 overflow-hidden">
          <div className="flex-1" />
          <div className="mt-4 flex gap-2 border-t pt-4">
            <Input
              placeholder="e.g., Explain the first step in more detail."
              value={interactionText}
              onChange={(e) => onInteractionTextChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!isUserSignedIn || isInteractionLoading}
            />
            <Button
              onClick={() => onInteract('edit')}
              disabled={isInteractionLoading || !isUserSignedIn || !interactionText.trim()}
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
