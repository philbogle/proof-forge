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
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


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
  const [isProofLoading, setIsProofLoading] = React.useState(true);
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [isAnswerLoading, setIsAnswerLoading] = React.useState(false);
  const [userBackground, setUserBackground] = React.useState(
    'a college student studying mathematics'
  );
  const [renderMarkdown, setRenderMarkdown] = React.useState(true);

  const { toast } = useToast();

  const selectedTheorem = React.useMemo(
    () => theorems.find((t) => t.id === selectedTheoremId) || theorems[0],
    [selectedTheoremId]
  );

  const generateNewProof = React.useCallback(async (forceRefresh = false) => {
    setIsProofLoading(true);
    setAnswer('');
    setQuestion('');
    setProof('');

    const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;
    const cacheDocRef = doc(db, 'proofs', cacheKey);

    if (!forceRefresh) {
      try {
        const cachedDoc = await getDoc(cacheDocRef);
        if (cachedDoc.exists()) {
          setProof(cachedDoc.data().proof);
          setIsProofLoading(false);
          return;
        }
      } catch (error: any) {
        if (error.code === 'unavailable') {
          // Firestore is offline, just fall through to generate a new proof without logging an error.
        } else {
          console.error("Error reading from cache:", error);
        }
      }
    }


    try {
      const { proof } = await generateProof({
        theoremName: selectedTheorem.name,
        theoremStatement: selectedTheorem.statement,
        formality: formalityLevel,
        userBackground,
      });
      setProof(proof);
      try {
        await setDoc(cacheDocRef, { proof, timestamp: new Date() });
      } catch (error) {
        console.error("Error writing to cache:", error);
        toast({
          variant: 'destructive',
          title: 'Cache Error',
          description: 'Could not save the proof to the cache.',
        });
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
      setIsProofLoading(false);
    }
  }, [formalityLevel, userBackground, toast, selectedTheorem]);

  React.useEffect(() => {
    generateNewProof();
  }, [generateNewProof]);

  const handleTheoremChange = (theoremId: string) => {
    setSelectedTheoremId(theoremId);
  };

  const handleFormalityChange = (level: FormalityLevel) => {
    setFormalityLevel(level);
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
            Select a theorem from the list, then explore its proof at different
            levels of formality.
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

        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
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
                      <RefreshCw className={`h-4 w-4 ${isProofLoading ? 'animate-spin' : ''}`} />
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
          <Card>
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
              {isProofLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
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
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Have a question about this theorem or a specific line in the
                proof? Ask here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="e.g., What does 'Q.E.D.' mean?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px] font-body"
              />
              <Button
                onClick={async () => {
                  if (!question.trim()) return;

                  setIsAnswerLoading(true);
                  setAnswer('');
                  try {
                    const result = await answerQuestion({
                      theoremName: selectedTheorem.name,
                      theoremText: proof,
                      question,
                      formalityLevel,
                    });
                    setAnswer(result.answer);
                  } catch (error) {
                    console.error('Error answering question:', error);
                    toast({
                      variant: 'destructive',
                      title: 'Error',
                      description:
                        'Could not get an answer. Please check the console for details.',
                    });
                  } finally {
                    setIsAnswerLoading(false);
                  }
                }}
                disabled={isAnswerLoading}
              >
                {isAnswerLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isAnswerLoading ? 'Thinking...' : 'Ask'}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
