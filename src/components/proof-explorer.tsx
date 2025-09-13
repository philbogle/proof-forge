
// src/components/proof-explorer.tsx
'use client';

import * as React from 'react';
import { useProofExplorer } from '@/hooks/use-proof-explorer';
import { theorems } from '@/lib/theorems';
import type { FormalityLevel } from '@/lib/types';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppHeader from './proof-explorer/app-header';
import TheoremSelector from './proof-explorer/theorem-selector';
import ProofControls from './proof-explorer/proof-controls';
import ProofView from './proof-explorer/proof-view';
import InteractionPanel from './proof-explorer/interaction-panel';
import AdvancedSettings from './proof-explorer/advanced-settings';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Save } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const formalityLevels: { id: FormalityLevel; name: string }[] = [
  { id: 'english', name: 'English' },
  { id: 'informal', name: 'Informal' },
  { id: 'rigorous', name: 'Rigorous' },
];

export default function ProofExplorer() {
  const {
    user,
    selectedTheorem,
    selectedTheoremId,
    formalityLevel,
    proofPages,
    currentPage,
    isFading,
    isProofLoading,
    interactionText,
    conversationHistory,
    isInteractionLoading,
    renderMarkdown,
    rawProofEdit,
    currentProofHistory,
    selectedVersion,
    handleTheoremChange,
    handleFormalityChange,
    handlePageChange,
    setRenderMarkdown,
    setRawProofEdit,
    handleRawProofSave,
    handleInteraction,
    setInteractionText,
    generateNewProof,
    handleClearCache,
    setSelectedVersion,
    handleRollback,
  } = useProofExplorer();

  const latestVersion = currentProofHistory[0];

  return (
    <TooltipProvider>
      <div className="flex h-full min-h-screen w-full flex-col">
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          <AppHeader />
          <div className="space-y-6">
            <TheoremSelector
              theorems={theorems}
              selectedTheoremId={selectedTheoremId}
              onTheoremChange={handleTheoremChange}
            />
            <ProofControls
              formalityLevels={formalityLevels}
              formalityLevel={formalityLevel}
              isProofLoading={isProofLoading}
              onFormalityChange={handleFormalityChange}
              onRefresh={() => generateNewProof(true)}
              currentPage={currentPage}
              totalPages={proofPages.length}
              onPageChange={handlePageChange}
            />
            <div className="space-y-6">
              <ProofView
                proof={
                  !renderMarkdown && user
                    ? rawProofEdit
                    : proofPages[currentPage - 1] || ''
                }
                renderMarkdown={renderMarkdown}
                isLoading={isProofLoading}
                isFading={isFading}
                isEditable={!renderMarkdown && !!user}
                onRawProofChange={setRawProofEdit}
              />
              <div>
                <div className="flex w-full items-center justify-between">
                  <div className="text-sm text-muted-foreground font-body">
                    {latestVersion && !isProofLoading && (
                      <span>
                        Last updated
                        {latestVersion.user?.name &&
                          ` by ${latestVersion.user.name}`}
                        {' on '}
                        {new Date(latestVersion.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!renderMarkdown && user && (
                      <Button onClick={handleRawProofSave} size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    )}
                    <Label
                      htmlFor="markdown-toggle"
                      className="text-sm font-medium"
                    >
                      Rendered
                    </Label>
                    <Switch
                      id="markdown-toggle"
                      checked={renderMarkdown}
                      onCheckedChange={setRenderMarkdown}
                    />
                  </div>
                </div>
              </div>

              {user && (
                <div className="mt-6">
                  <AdvancedSettings
                    user={user}
                    isProofLoading={isProofLoading}
                    generateNewProof={generateNewProof}
                    selectedTheorem={selectedTheorem}
                    handleClearCache={handleClearCache}
                    currentProofHistory={currentProofHistory}
                    selectedVersion={selectedVersion}
                    setSelectedVersion={setSelectedVersion}
                    handleRollback={handleRollback}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="fixed bottom-4 right-4 z-10 w-full max-w-md">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none flex flex-col items-end">
              <AccordionTrigger asChild>
                <Button
                  variant="default"
                  className="h-12 w-12 rounded-full p-0 shadow-lg"
                >
                  <MessageSquare className="h-6 w-6" />
                </Button>
              </AccordionTrigger>
              <AccordionContent className="w-full">
                <div className="mt-2 rounded-lg border bg-card shadow-xl">
                  <InteractionPanel
                    interactionText={interactionText}
                    onInteractionTextChange={setInteractionText}
                    onInteract={handleInteraction}
                    isInteractionLoading={isInteractionLoading}
                    conversationHistory={conversationHistory}
                    isUserSignedIn={!!user}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </TooltipProvider>
  );
}
