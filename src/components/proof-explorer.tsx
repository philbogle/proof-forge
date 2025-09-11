
'use client';

import * as React from 'react';

import { useToast } from '@/hooks/use-toast';
import { answerQuestion } from '@/ai/flows/natural-language-questioning';
import { generateProof } from '@/ai/flows/generate-proof-flow';
import { editProof } from '@/ai/flows/edit-proof-flow';
import { theorems } from '@/lib/theorems';
import type { FormalityLevel } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppHeader from './proof-explorer/app-header';
import TheoremSelector from './proof-explorer/theorem-selector';
import ProofControls from './proof-explorer/proof-controls';
import ProofView from './proof-explorer/proof-view';
import InteractionPanel from './proof-explorer/interaction-panel';

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
  const [visibleAnchor, setVisibleAnchor] = React.useState<string | null>(null);

  const proofCardRef = React.useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const selectedTheorem = React.useMemo(
    () => theorems.find((t) => t.id === selectedTheoremId) || theorems[0],
    [selectedTheoremId]
  );
  
  // Effect for observing which anchor is visible
  React.useEffect(() => {
    const handleScroll = () => {
      if (!proofCardRef.current) return;
  
      const anchors = Array.from(proofCardRef.current.querySelectorAll('a[id^="step-"]'));
      const cardTop = proofCardRef.current.getBoundingClientRect().top;
  
      let firstVisibleAnchor: HTMLElement | null = null;
  
      for (const anchor of anchors) {
        const anchorTop = anchor.getBoundingClientRect().top;
        if (anchorTop >= cardTop) {
          firstVisibleAnchor = anchor as HTMLElement;
          break;
        }
      }
      
      if (firstVisibleAnchor) {
        setVisibleAnchor(firstVisibleAnchor.id);
      } else if (anchors.length > 0) {
        // If no anchor is below the top, the last one must be the visible one.
        setVisibleAnchor(anchors[anchors.length - 1].id);
      }
    };
  
    const proofCardElement = proofCardRef.current;
    if (proofCardElement) {
      proofCardElement.addEventListener('scroll', handleScroll);
    }
  
    // Run once on mount to set initial anchor
    handleScroll();
  
    return () => {
      if (proofCardElement) {
        proofCardElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [proof, renderMarkdown]);
  
  // Effect to scroll to the visible anchor when proof changes
  React.useEffect(() => {
    if (!isProofLoading && visibleAnchor) {
      const targetElement = proofCardRef.current?.querySelector(`#${visibleAnchor}`);
      if (targetElement) {
        // Using a timeout to ensure the browser has time to render and settle.
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        }, 100);
      }
    }
    // We only want this to run when the loading state changes, not when the visibleAnchor changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProofLoading]);


  const generateNewProof = React.useCallback(
    async (forceRefresh = false) => {
      setIsProofLoading(true);
      setShowLoadingIndicator(true); // Always show for feedback
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

      // Find another proof for the same theorem to use for structure
      const structuralProof = Object.keys(proofCache).find(key => key.startsWith(selectedTheorem.id) && key !== cacheKey) 
        ? proofCache[Object.keys(proofCache).find(key => key.startsWith(selectedTheorem.id) && key !== cacheKey)!]
        : undefined;

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
    // generateNewProof is memoized and we only want to run it when these specific dependencies change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTheoremId, formalityLevel]);

  const handleTheoremChange = (theoremId: string) => {
    setVisibleAnchor(null);
    setSelectedTheoremId(theoremId);

  };

  const handleFormalityChange = (level: FormalityLevel) => {
    setFormalityLevel(level);
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
        // Update cache with the edited proof
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
              ref={proofCardRef}
              proof={proof}
              renderMarkdown={renderMarkdown}
              onToggleRenderMarkdown={setRenderMarkdown}
              isLoading={showLoadingIndicator}
            />

            <InteractionPanel
              interactionText={interactionText}
              onInteractionTextChange={setInteractionText}
              onInteract={handleInteraction}
              isInteractionLoading={isInteractionLoading}
              answer={answer}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
