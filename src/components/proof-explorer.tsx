'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { answerQuestion } from '@/ai/flows/natural-language-questioning';
import { generateProof } from '@/ai/flows/generate-proof-flow';
import { editProof } from '@/ai/flows/edit-proof-flow';
import { Loader2, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { theorems } from '@/lib/theorems';
import type { FormalityLevel } from '@/lib/types';
import { ProofDisplay } from '@/components/proof-display';
import { ProofLoadingIndicator } from '@/components/proof-loading-indicator';
import { Switch } from '@/components/ui/switch';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleAnchor(entry.target.id);
          }
        });
      },
      { root: proofCardRef.current, threshold: 0.5 }
    );

    const anchors = proofCardRef.current?.querySelectorAll('a[id^="step-"]');
    if (anchors) {
      anchors.forEach((anchor) => observer.observe(anchor));
    }

    return () => {
      if (anchors) {
        anchors.forEach((anchor) => observer.unobserve(anchor));
      }
    };
  }, [proof, renderMarkdown]);
  
  // Effect to scroll to the visible anchor when proof changes
  React.useEffect(() => {
    if (!isProofLoading && visibleAnchor) {
      const targetElement = proofCardRef.current?.querySelector(`#${visibleAnchor}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [isProofLoading, visibleAnchor, proof]);


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
          if (error.code !== 'unavailable' && error.code !== 'failed-precondition' && error.code !== 'permission-denied') {
            console.error('Firestore cache read failed:', error);
          }
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
          <header className="mb-8 flex flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Proof Explorer
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Select a theorem from the list, then explore its proof at
              different levels of formality.
            </p>
          </header>

          <div className="mb-8 grid grid-cols-1 items-end gap-4">
            <div className="col-span-1 flex flex-col gap-2">
              <Label htmlFor="theorem-select" className="text-sm font-medium">
                Theorem
              </Label>
              <Select
                value={selectedTheoremId}
                onValueChange={handleTheoremChange}
              >
                <SelectTrigger id="theorem-select" className="bg-white">
                  <SelectValue placeholder="Select a theorem" />
                </SelectTrigger>
                <SelectContent>
                  {theorems.map((theorem) => (
                    <SelectItem key={theorem.id} value={theorem.id}>
                      {theorem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-6 flex flex-col items-start justify-between gap-4 border-b border-border bg-gray-50/80 p-4 backdrop-blur-sm md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {selectedTheorem.name}
              </h2>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <Label className="text-xs text-muted-foreground">
                Formality Level
              </Label>
              <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
                {formalityLevels.map((level) => (
                  <Button
                    key={level.id}
                    variant={formalityLevel === level.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleFormalityChange(level.id)}
                    className="h-8 px-2 text-xs md:px-3 md:text-sm"
                    disabled={isProofLoading}
                  >
                    {level.name}
                  </Button>
                ))}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => generateNewProof(true)}
                      disabled={isProofLoading}
                      className="h-8 w-8"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          isProofLoading ? 'animate-spin' : ''
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh Proof</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card ref={proofCardRef} className="max-h-[60vh] overflow-y-auto">
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
                      onCheckedChange={(checked) => setRenderMarkdown(!checked)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {showLoadingIndicator ? (
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

            <Card>
              <CardHeader>
                <CardTitle>Interact with the Proof</CardTitle>
                <CardDescription>
                  Ask a question about the proof or suggest an edit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="question" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="question">Ask a Question</TabsTrigger>
                    <TabsTrigger value="edit">Request an Edit</TabsTrigger>
                  </TabsList>
                  <TabsContent value="question" className="space-y-4">
                    <Textarea
                      placeholder="e.g., What does 'Q.E.D.' mean?"
                      value={interactionText}
                      onChange={(e) => setInteractionText(e.target.value)}
                      className="mt-4 min-h-[100px] font-body"
                    />
                    <Button
                      onClick={() => handleInteraction('question')}
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
                      onChange={(e) => setInteractionText(e.target.value)}
                      className="mt-4 min-h-[100px] font-body"
                    />
                    <Button
                      onClick={() => handleInteraction('edit')}
                      disabled={isInteractionLoading}
                    >
                      {isInteractionLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isInteractionLoading ? 'Editing...' : 'Submit Edit'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
