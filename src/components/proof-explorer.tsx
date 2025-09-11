
'use client';

import * as React from 'react';

import { useToast } from '@/hooks/use-toast';
import { answerQuestion } from '@/ai/flows/natural-language-questioning';
import { generateProof } from '@/ai/flows/generate-proof-flow';
import { editProof } from '@/ai/flows/edit-proof-flow';
import { theorems } from '@/lib/theorems';
import type { FormalityLevel } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Trash2 } from 'lucide-react';
import AppHeader from './proof-explorer/app-header';
import TheoremSelector from './proof-explorer/theorem-selector';
import ProofControls from './proof-explorer/proof-controls';
import ProofView from './proof-explorer/proof-view';
import InteractionPanel from './proof-explorer/interaction-panel';
import PaginationControls from './proof-explorer/pagination-controls';

const formalityLevels: { id: FormalityLevel; name: string }[] = [
  { id: 'informalEnglish', name: 'Informal English' },
  { id: 'semiFormal', name: 'Semi-Formal' },
  { id: 'rigorous', name: 'Rigorous' },
];

export default function ProofExplorer() {
  const [selectedTheoremId, setSelectedTheoremId] = React.useState(
    theorems[0].id
  );
  const [formalityLevel, setFormalityLevel] =
    React.useState<FormalityLevel>('semiFormal');
  const [proof, setProof] = React.useState('');
  const [proofPages, setProofPages] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  const [proofCache, setProofCache] = React.useState<Record<string, string>>(
    {}
  );
  const [isProofLoading, setIsProofLoading] = React.useState(true);
  const [showLoadingIndicator, setShowLoadingIndicator] = React.useState(false);
  const [interactionText, setInteractionText] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [isInteractionLoading, setIsInteractionLoading] = React.useState(false);
  const [userBackground, setUserBackground] = React.useState(
    'a college student studying mathematics'
  );
  const [renderMarkdown, setRenderMarkdown] = React.useState(true);

  const { toast } = useToast();

  const selectedTheorem = React.useMemo(
    () => theorems.find((t) => t.id === selectedTheoremId) || theorems[0],
    [selectedTheoremId]
  );

  const parseProofIntoPages = (fullProof: string) => {
    if (!fullProof) return [];
    const pages = fullProof.split(/(<a id="step-\d+"><\/a>)/).filter(p => p.trim() !== '');
    
    const combinedPages: string[] = [];
    for (let i = 0; i < pages.length; i += 2) {
      if (i + 1 < pages.length) {
        combinedPages.push(pages[i] + pages[i+1]);
      } else {
        if(!pages[i].startsWith('<a')) {
          if (combinedPages.length > 0) {
             combinedPages[combinedPages.length - 1] += pages[i];
          } else {
             combinedPages.push(pages[i]);
          }
        }
      }
    }
    return combinedPages.length > 0 ? combinedPages : [fullProof];
  };
  
  React.useEffect(() => {
    const pages = parseProofIntoPages(proof);
    setProofPages(pages);
    if (currentPage > pages.length && pages.length > 0) {
      setCurrentPage(pages.length);
    } else if (pages.length > 0 && currentPage === 0) {
      setCurrentPage(1);
    }
  }, [proof, currentPage]);


  const generateNewProof = React.useCallback(
    async (forceRefresh = false) => {
      setIsProofLoading(true);
      setShowLoadingIndicator(true);
      setAnswer('');
      setInteractionText('');

      const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;

      if (!forceRefresh && proofCache[cacheKey]) {
        setProof(proofCache[cacheKey]);
        setIsProofLoading(false);
        setShowLoadingIndicator(false);
        return;
      }
      
      const loadingTimer = setTimeout(() => {
        setShowLoadingIndicator(true);
      }, 300);

      if (!forceRefresh) {
        try {
          const cachedDoc = await getDoc(doc(db, 'proofs', cacheKey));
          if (cachedDoc.exists()) {
            const cachedProof = cachedDoc.data().proof;
            setProof(cachedProof);
            setProofCache((prev) => ({ ...prev, [cacheKey]: cachedProof }));
            clearTimeout(loadingTimer);
            setShowLoadingIndicator(false);
            setIsProofLoading(false);
            return;
          }
        } catch (error: any) {
          console.error('Firestore cache read failed:', error);
        }
      }
      
      if (!showLoadingIndicator) {
         if (proof) setProof('');
      }

      const structuralProofKey = Object.keys(proofCache).find(key => key.startsWith(selectedTheorem.id) && key !== cacheKey);
      const structuralProof = structuralProofKey ? proofCache[structuralProofKey] : undefined;


      try {
        const { proof: newProof } = await generateProof({
          theoremName: selectedTheorem.name,
          theoremStatement: selectedTheorem.statement,
          formality: formalityLevel,
          userBackground,
          structuralProof,
        });
        setProof(newProof);
        setProofCache((prev) => ({ ...prev, [cacheKey]: newProof }));
        try {
          await setDoc(doc(db, 'proofs', cacheKey), {
            proof: newProof,
            timestamp: new Date(),
          });
        } catch (error) {
          console.error('Firestore cache write failed:', error);
        }
      } catch (error) {
        console.error('Error generating proof:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            'Could not generate the proof. Please check the console for details.',
        });
        setProof('Failed to generate proof.');
      } finally {
        clearTimeout(loadingTimer);
        setShowLoadingIndicator(false);
        setIsProofLoading(false);
      }
    },
    [formalityLevel, userBackground, toast, selectedTheorem, proofCache, showLoadingIndicator, proof]
  );

  React.useEffect(() => {
    generateNewProof();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTheoremId, formalityLevel]);

  const handleTheoremChange = (theoremId: string) => {
    setCurrentPage(1);
    setSelectedTheoremId(theoremId);
  };

  const handleFormalityChange = (level: FormalityLevel) => {
    setFormalityLevel(level);
  };

  const handleClearCache = async () => {
    const keysToClear = Object.keys(proofCache).filter(key => key.startsWith(selectedTheorem.id));
    
    // Clear local cache
    const newCache = {...proofCache};
    keysToClear.forEach(key => {
        delete newCache[key];
    });
    setProofCache(newCache);

    // Clear Firestore cache
    try {
        const deletePromises = keysToClear.map(key => deleteDoc(doc(db, 'proofs', key)));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Error clearing Firestore cache:", error);
         toast({
          variant: 'destructive',
          title: 'Cache Error',
          description: 'Could not clear the Firestore cache. Please check the console.',
        });
    }

    toast({
        title: 'Cache Cleared',
        description: `The cache for "${selectedTheorem.name}" has been cleared.`,
    });

    generateNewProof(true);
  };
  
  const handleInteraction = async (type: 'question' | 'edit') => {
    if (!interactionText.trim()) return;

    setIsInteractionLoading(true);
    setAnswer('');

    try {
      if (type === 'question') {
        const result = await answerQuestion({
          theoremName: selectedTheorem.name,
          theoremText: proof,
          question: interactionText,
          formalityLevel,
        });
        setAnswer(result.answer);
      } else if (type === 'edit') {
        setIsProofLoading(true);
        const result = await editProof({
          proof: proof,
          request: interactionText,
          theoremName: selectedTheorem.name,
          formality: formalityLevel,
        });
        setProof(result.editedProof);
        const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;
        setProofCache((prev) => ({ ...prev, [cacheKey]: result.editedProof }));
        try {
            await setDoc(doc(db, 'proofs', cacheKey), {
            proof: result.editedProof,
            timestamp: new Date(),
          });
        } catch (error) {
           console.error('Firestore cache write failed:', error);
        } finally {
            setIsProofLoading(false);
        }
      }
    } catch (error) {
      console.error(`Error during ${type}:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Could not process your request. Please check the console for details.`,
      });
    } finally {
      setIsInteractionLoading(false);
    }
  };


  return (
    <TooltipProvider>
      <div className="flex h-full min-h-screen flex-col items-center bg-gray-50/50 p-4 font-headline md:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          <AppHeader />

          <TheoremSelector
            theorems={theorems}
            selectedTheoremId={selectedTheoremId}
            onTheoremChange={handleTheoremChange}
          />

          <ProofControls
            selectedTheorem={selectedTheorem}
            formalityLevels={formalityLevels}
            formalityLevel={formalityLevel}
            isProofLoading={isProofLoading}
            onFormalityChange={handleFormalityChange}
            onRefresh={() => generateNewProof(true)}
          />

          <div className="space-y-6">
            <ProofView
              proof={proofPages[currentPage - 1] || ''}
              renderMarkdown={renderMarkdown}
              onToggleRenderMarkdown={setRenderMarkdown}
              isLoading={showLoadingIndicator}
            />

            <PaginationControls
              currentPage={currentPage}
              totalPages={proofPages.length}
              onPageChange={setCurrentPage}
              isLoading={isProofLoading}
            />

            <InteractionPanel
              interactionText={interactionText}
              onInteractionTextChange={setInteractionText}
              onInteract={handleInteraction}
              isInteractionLoading={isInteractionLoading}
              answer={answer}
            />
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced-settings">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    Advanced Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Clear Theorem Cache</h4>
                          <p className="text-sm text-muted-foreground">
                            Delete all cached proofs for "{selectedTheorem.name}" and regenerate.
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={handleClearCache}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Clear Cache
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
