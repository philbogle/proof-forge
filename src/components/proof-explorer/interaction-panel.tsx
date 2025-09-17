// src/components/proof-explorer/interaction-panel.tsx
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, User, Bot, MessageSquare, Send, X } from 'lucide-react';
import { ProofDisplay } from '@/components/proof-display';
import type { ConversationTurn } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface InteractionPanelProps {
  interactionText: string;
  onInteractionTextChange: (text: string) => void;
  onInteract: () => void;
  isInteractionLoading: boolean;
  conversationHistory: ConversationTurn[];
  isUserSignedIn: boolean;
  isUserAdmin: boolean;
  onClose?: () => void;
}

export default function InteractionPanel({
  interactionText,
  onInteractionTextChange,
  onInteract,
  isInteractionLoading,
  conversationHistory,
  isUserSignedIn,
  isUserAdmin,
  onClose,
}: InteractionPanelProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, isInteractionLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onInteract();
    }
  };

  const getPlaceholderText = () => {
    if (isUserAdmin) {
        return "Ask a question or request an edit...";
    }
    return "Ask a question about the proof...";
  }

  return (
    <div className="flex h-full flex-col p-4">
       <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          <h2 className="text-xl font-semibold">AI Assistant</h2>
        </div>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="space-y-4">
          {conversationHistory.map((turn, index) => (
            <div key={index} className="space-y-4">
              {turn.question && (
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <User className="h-5 w-5 text-secondary-foreground" />
                  </span>
                  <div className="flex-1 rounded-lg border bg-secondary/30 p-3 text-sm">
                    <p>{turn.question}</p>
                  </div>
                </div>
              )}
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
          {isInteractionLoading && (
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </span>
              <div className="flex-1 rounded-lg border bg-card p-3 text-sm">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="mt-auto border-t pt-4">
        <div className="flex gap-2">
          <Input
            placeholder={getPlaceholderText()}
            value={interactionText}
            onChange={(e) => onInteractionTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isInteractionLoading}
          />
          <Button
            onClick={() => onInteract()}
            disabled={isInteractionLoading || !interactionText.trim()}
          >
            {isInteractionLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Submit</span>
          </Button>
        </div>
        {!isUserSignedIn && !isUserAdmin && (
          <p className="mt-2 text-xs text-muted-foreground">
            Sign in as an administrator to request edits.
          </p>
        )}
      </div>
    </div>
  );
}
