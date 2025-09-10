'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { answerQuestion } from '@/ai/flows/natural-language-questioning';
import { Loader2, BookOpen, Search } from 'lucide-react';

import { theorems, type Theorem, type FormalityLevel } from '@/lib/theorems';
import { ProofDisplay } from '@/components/proof-display';
import { Logo } from '@/components/icons';

const formalityLevels: { id: FormalityLevel; name: string }[] = [
  { id: 'plainEnglish', name: 'Plain English' },
  { id: 'englishDescription', name: 'English Description' },
  { id: 'semiFormal', name: 'Semi-Formal' },
  { id: 'rigorousFormal', name: 'Rigorous Formal' },
];

export default function ProofExplorer() {
  const [selectedTheorem, setSelectedTheorem] = React.useState<Theorem>(
    theorems[0]
  );
  const [formalityLevel, setFormalityLevel] =
    React.useState<FormalityLevel>('semiFormal');
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const { toast } = useToast();

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer('');
    try {
      const result = await answerQuestion({
        theoremName: selectedTheorem.name,
        theoremText: selectedTheorem.proofs[formalityLevel],
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
      setIsLoading(false);
    }
  };

  const filteredTheorems = theorems.filter((theorem) =>
    theorem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-6 text-primary" />
            <h1 className="text-lg font-semibold">Proof Explorer</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search theorems..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {filteredTheorems.map((theorem) => (
              <SidebarMenuItem key={theorem.id}>
                <SidebarMenuButton
                  onClick={() => setSelectedTheorem(theorem)}
                  isActive={selectedTheorem.id === theorem.id}
                  className="justify-start"
                >
                  <BookOpen />
                  {theorem.name}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col p-4 md:p-6 lg:p-8">
          <header className="mb-6 flex items-start justify-between">
            <div>
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {selectedTheorem.name}
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
          </header>

          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Proof</CardTitle>
                <CardDescription>
                  This is a presentation of the proof at the selected formality
                  level.
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-blue dark:prose-invert max-w-none font-body text-base leading-relaxed">
                <ProofDisplay
                  key={`${selectedTheorem.id}-${formalityLevel}`}
                  content={selectedTheorem.proofs[formalityLevel]}
                />
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
                <Button onClick={handleAskQuestion} disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? 'Thinking...' : 'Ask'}
                </Button>
                {answer && (
                  <div className="mt-4 rounded-lg border bg-secondary/50 p-4">
                    <p className="font-semibold text-secondary-foreground">Answer:</p>
                    <div className="prose prose-blue dark:prose-invert max-w-none font-body text-sm text-muted-foreground">
                       <ProofDisplay content={answer} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
