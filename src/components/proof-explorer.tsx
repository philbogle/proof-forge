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
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';

import { theorems, type Theorem, type FormalityLevel } from '@/lib/theorems';
import { ProofDisplay } from '@/components/proof-display';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const formalityLevels: { id: FormalityLevel; name: string }[] = [
  { id: 'plainEnglish', name: 'Plain English' },
  { id: 'englishDescription', name: 'English Description' },
  { id: 'semiFormal', name: 'Semi-Formal' },
  { id: 'rigorousFormal', name: 'Rigorous Formal' },
];

export default function ProofExplorer() {
  const [theoremName, setTheoremName] = React.useState(theorems[0].name);
  const [theoremStatement, setTheoremStatement] = React.useState(
    theorems[0].statement
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
  const [comboOpen, setComboOpen] = React.useState(false);

  const { toast } = useToast();

  const handleTheoremSelect = (theorem: Theorem) => {
    setTheoremName(theorem.name);
    setTheoremStatement(theorem.statement);
    setComboOpen(false);
  };

  const generateNewProof = React.useCallback(async () => {
    if (!theoremName) return;

    setIsProofLoading(true);
    try {
      const result = await generateProof({
        theoremName: theoremName,
        theoremStatement: theoremStatement,
        formality: formalityLevel,
        userBackground,
      });
      setProof(result.proof);
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
  }, [theoremName, theoremStatement, formalityLevel, userBackground, toast]);

  React.useEffect(() => {
    generateNewProof();
  }, [theoremName, theoremStatement, formalityLevel, userBackground, generateNewProof]);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsAnswerLoading(true);
    setAnswer('');
    try {
      const result = await answerQuestion({
        theoremName: theoremName,
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
  };

  return (
    <div className="flex h-full min-h-screen flex-col items-center bg-gray-50/50 p-4 font-headline md:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Proof Explorer
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Select a theorem from the list or type your own, then explore its
            proof at different levels of formality.
          </p>
        </header>

        <div className="mb-8 grid grid-cols-1 items-end gap-4 md:grid-cols-3">
          <div className="col-span-1 flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="theorem-select" className="text-sm font-medium">
              Theorem
            </Label>
            <Popover open={comboOpen} onOpenChange={setComboOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboOpen}
                  className="w-full justify-between bg-white"
                  id="theorem-select"
                >
                  <span className="truncate">{theoremName}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search for a theorem or type your own..."
                    onValueChange={(value) => {
                      setTheoremName(value);
                      const knownTheorem = theorems.find(
                        (t) => t.name.toLowerCase() === value.toLowerCase()
                      );
                      setTheoremStatement(knownTheorem ? knownTheorem.statement : `A theorem about ${value}`);
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <p className="p-4 text-sm text-muted-foreground">
                        No theorem found. Press enter to generate a proof for
                        what you typed.
                      </p>
                    </CommandEmpty>
                    <CommandGroup>
                      {theorems.map((theorem) => (
                        <CommandItem
                          key={theorem.id}
                          value={theorem.name}
                          onSelect={() => handleTheoremSelect(theorem)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              theoremName === theorem.name
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {theorem.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <Button onClick={generateNewProof} disabled={isProofLoading}>
              {isProofLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Generate Proof
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {theoremName}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Label className="text-xs text-muted-foreground">
              Formality Level
            </Label>
            <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
              {formalityLevels.map((level) => (
                <Button
                  key={level.id}
                  variant={formalityLevel === level.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFormalityLevel(level.id)}
                  className="h-8 px-2 text-xs md:px-3 md:text-sm"
                >
                  {level.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proof</CardTitle>
              <CardDescription>
                This is a dynamically generated presentation of the proof at the
                selected formality level.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-blue dark:prose-invert max-w-none font-body text-base leading-relaxed">
              {isProofLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <ProofDisplay
                  key={`${theoremName}-${formalityLevel}`}
                  content={proof}
                />
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
              <Button onClick={handleAskQuestion} disabled={isAnswerLoading}>
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
  );
}
