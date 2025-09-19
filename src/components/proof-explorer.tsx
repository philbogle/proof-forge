// src/components/proof-explorer.tsx
'use client';

import * as React from 'react';
import { useProofExplorer } from '@/hooks/use-proof-explorer';
import type { FormalityLevel } from '@/lib/types';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppHeader from './proof-explorer/app-header';
import ProofControls from './proof-explorer/proof-controls';
import ProofView from './proof-explorer/proof-view';
import InteractionPanel from './proof-explorer/interaction-panel';
import AdvancedSettings from './proof-explorer/advanced-settings';
import { Button } from '@/components/ui/button';
import { MessageSquare, Save, X, View, Pencil, ChevronRight, Sparkles, Bot, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const formalityLevels: { id: FormalityLevel; name: string }[] = [
  { id: 'english', name: 'English' },
  { id: 'semiformal', name: 'Semiformal' },
  { id: 'rigorous', name: 'Rigorous' },
];

interface ProofExplorerProps {
    initialTheoremId: string;
}

export default function ProofExplorer({ initialTheoremId }: ProofExplorerProps) {
  const proofViewRef = React.useRef<HTMLDivElement>(null);
  const {
    user,
    isUserAdmin,
    isOwner,
    isEditing,
    selectedTheorem,
    formalityLevel,
    proofPages,
    currentPage,
    isFading,
    isProofLoading,
    isGenerating,
    interactionText,
    conversationHistory,
    isInteractionLoading,
    renderMarkdown,
    rawProofEdit,
    currentProofHistory,
    selectedVersion,
    isChatOpen,
    setIsChatOpen,
    handleFormalityChange,
    handlePageChange,
    setRenderMarkdown,
    setRawProofEdit,
    handleRawProofSave,
    handleInteraction,
    setInteractionText,
    generateNewProof,
    handleClearCache,
    handleDeleteTheorem,
    setSelectedVersion,
    handleRollback,
    handleToggleEditing,
    handleDiscardChanges,
  } = useProofExplorer({ proofViewRef, initialTheoremId });

  const [isDiscardAlertOpen, setIsDiscardAlertOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const interactionPanel = (showTitle: boolean) => (
    <InteractionPanel
      showTitle={showTitle}
      interactionText={interactionText}
      onInteractionTextChange={setInteractionText}
      onInteract={handleInteraction}
      isInteractionLoading={isInteractionLoading}
      conversationHistory={conversationHistory}
      isUserSignedIn={!!user}
      isUserAdmin={isUserAdmin}
      onClose={() => setIsChatOpen(false)}
    />
  );


  if (!selectedTheorem && !isProofLoading) {
    return (
       <div className="flex h-full min-h-screen w-full flex-col">
         <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
           <AppHeader onToggleEditing={handleToggleEditing} />
            <div className="flex flex-col items-center justify-center h-96 border rounded-lg bg-card">
                <h3 className="text-xl font-semibold">Theorem Not Found</h3>
                <p className="text-muted-foreground">The requested theorem could not be found or is not available.</p>
            </div>
         </div>
       </div>
    )
  }

  const canEdit = isUserAdmin || (isOwner && !selectedTheorem?.adminApproved);
  const canDelete = isUserAdmin || isOwner;

  return (
    <TooltipProvider>
      <div className="flex h-full min-h-screen w-full flex-col">
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          <AppHeader onToggleEditing={handleToggleEditing} />
          <div className="space-y-2">
            <div className='my-4'>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Link href="/" className="hover:text-foreground">All Theorems</Link>
                  <ChevronRight className="h-4 w-4 mx-1" />
                  <span className="text-foreground font-medium">{selectedTheorem?.name}</span>
                </div>
            </div>
            <div className="sticky top-0 z-10 bg-background py-4">
              <ProofControls
                formalityLevels={formalityLevels}
                formalityLevel={formalityLevel}
                isProofLoading={isProofLoading || isGenerating}
                onFormalityChange={handleFormalityChange}
                currentPage={currentPage}
                totalPages={proofPages.length}
                onPageChange={handlePageChange}
              />
            </div>
            <div className="space-y-4">
              <ProofView
                ref={proofViewRef}
                proof={
                  isEditing
                    ? rawProofEdit
                    : proofPages[currentPage] || ''
                }
                renderMarkdown={renderMarkdown}
                isLoading={isProofLoading}
                isGenerating={isGenerating}
                isFading={isFading}
                isEditable={isEditing && !renderMarkdown}
                onRawProofChange={setRawProofEdit}
              />

              {!isEditing && (
                <div className="flex justify-end items-center gap-2">
                  {isUserAdmin && (
                    <Button variant="outline" size="sm" onClick={() => generateNewProof(true)} disabled={isProofLoading || isGenerating}>
                      <Sparkles className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                      Recreate
                    </Button>
                  )}
                   {canEdit && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setIsChatOpen(true)}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleToggleEditing}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </>
                  )}
                  {canDelete && selectedTheorem && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the theorem "{selectedTheorem.name}" and all of its associated proof versions. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteTheorem}>
                            Yes, delete theorem
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              )}


              {(isUserAdmin || isOwner) && !isEditing && (
                <div className="mt-4">
                  <AdvancedSettings
                    user={user}
                    isProofLoading={isProofLoading || isGenerating}
                    selectedTheorem={selectedTheorem}
                    handleClearCache={handleClearCache}
                    currentProofHistory={currentProofHistory}
                    selectedVersion={selectedVersion}
                    setSelectedVersion={setSelectedVersion}
                    handleRollback={handleRollback}
                    showAdminControls={isUserAdmin}
                    showOwnerControls={isOwner}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditing && canEdit && (
          <div className="sticky bottom-0 z-20 w-full border-t bg-background/95 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto flex items-center justify-between p-3">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-sm">Editing Mode</span>
                <div className="flex items-center space-x-2">
                  <Pencil className="h-4 w-4" />
                  <Switch
                    id="edit-mode-toggle"
                    checked={renderMarkdown}
                    onCheckedChange={setRenderMarkdown}
                  />
                  <View className="h-4 w-4" />
                  <Label htmlFor="edit-mode-toggle" className="sr-only">
                    Toggle Markdown Preview
                  </Label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDiscardAlertOpen(true)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Discard
                </Button>
                <Button onClick={handleRawProofSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        <AlertDialog
          open={isDiscardAlertOpen}
          onOpenChange={setIsDiscardAlertOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to discard your unsaved changes? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDiscardChanges();
                  setIsDiscardAlertOpen(false);
                }}
              >
                Discard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {isMobile ? (
          <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
            <SheetTrigger asChild>
               <Button className="fixed bottom-4 right-4 z-10 h-12 w-12 rounded-full shadow-lg">
                <MessageSquare className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-full p-0 border-t flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        <div className="flex items-center gap-2">
                            <Bot className="h-6 w-6" />
                            <span className="text-xl font-semibold">AI Assistant</span>
                        </div>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                    {interactionPanel(false)}
                </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="fixed bottom-4 right-4 z-10 w-full max-w-lg">
            <Accordion type="single" collapsible value={isChatOpen ? "chat" : ""} onValueChange={(value) => setIsChatOpen(value === "chat")}>
              <AccordionItem
                value="chat"
                className="border-none flex flex-col items-end"
              >
                <AccordionTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12 rounded-full p-0 shadow-lg flex items-center justify-center hover:no-underline group">
                  <MessageSquare className="h-6 w-6 group-data-[state=open]:hidden" />
                  <X className="h-6 w-6 group-data-[state=closed]:hidden" />
                </AccordionTrigger>
                <AccordionContent className="w-full">
                  <div className="mt-2 rounded-lg border bg-card shadow-xl">
                    {interactionPanel(true)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
