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
import { Loader2 } from 'lucide-react';

import { theorems, type Theorem } from '@/lib/theorems';
import type { FormalityLevel } from '@/lib/types';
import { ProofDisplay } from '@/components/proof-display';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

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
  const [renderMarkdown, setRenderMarkdown] = React.useState(true);

  const [suggestions, setSuggestions] = React.useState<Theorem[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = React.useState(false);

  const { toast } = useToast();
  const suggestionsRef = React.useRef<HTMLUListElement>(null);

  const generateNewProof = React.useCallback(
    async (name: string, statement: string) => {
      if (!name || !statement) return;

      setIsProofLoading(true);
      setAnswer('');
      setQuestion('');
      setProof('');
      try {
        const { proofStream } = await generateProof({
          theoremName: name,
          theoremStatement: statement,
          formality: formalityLevel,
          userBackground,
        });

        const reader = proofStream.getReader();
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: true });
          setProof((prevProof) => prevProof + chunk);
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
    },
    [formalityLevel, userBackground, toast]
  );

  React.useEffect(() => {
    // Initial proof generation
    generateNewProof(theoremName, theoremStatement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTheoremInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTheoremName(value);
    if (value) {
      const filteredSuggestions = theorems
        .filter((t) => t.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);
      setSuggestions(filteredSuggestions);
      setIsSuggestionsVisible(true);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (theorem: Theorem) => {
    setTheoremName(theorem.name);
    setTheoremStatement(theorem.statement);
    setIsSuggestionsVisible(false);
    generateNewProof(theorem.name, theorem.statement);
  };

  const handleGenerateClick = () => {
    setIsSuggestionsVisible(false);
    const knownTheorem = theorems.find(
      (t) => t.name.toLowerCase() === theoremName.toLowerCase()
    );
    const statementToUse =
      knownTheorem?.statement ?? `A theorem about ${theoremName}`;
    setTheoremStatement(statementToUse);
    generateNewProof(theoremName, statementToUse);
  };

  const handleFormalityChange = (level: FormalityLevel) => {
    setFormalityLevel(level);
    generateNewProof(theoremName, theoremStatement);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <div className="relative col-span-1 flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="theorem-input" className="text-sm font-medium">
              Theorem
            </Label>
            <Input
              id="theorem-input"
              type="text"
              value={theoremName}
              onChange={handleTheoremInputChange}
              onFocus={() => theoremName && setIsSuggestionsVisible(true)}
              placeholder="Search for a theorem or type your own..."
              className="bg-white"
              autoComplete="off"
            />
            {isSuggestionsVisible && suggestions.length > 0 && (
              <ul
                ref={suggestionsRef}
                className="absolute top-full z-10 mt-1 w-full rounded-md border bg-white shadow-lg"
              >
                {suggestions.map((theorem) => (
                  <li
                    key={theorem.id}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input from losing focus
                      handleSuggestionClick(theorem);
                    }}
                  >
                    {theorem.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <Button
              onClick={handleGenerateClick}
              disabled={isProofLoading || !theoremName.trim()}
            >
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
                  onClick={() => handleFormalityChange(level.id)}
                  className="h-8 px-2 text-xs md:px-3 md:text-sm"
                  disabled={isProofLoading}
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Proof</CardTitle>
                  <CardDescription>
                    This is a dynamically generated presentation of the proof.
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="markdown-toggle" className="text-sm font-medium">
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
              {isProofLoading && !proof ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : renderMarkdown ? (
                <ProofDisplay
                  key={`${theoremName}-${formalityLevel}`}
                  content={proof}
                />
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
  );
}
