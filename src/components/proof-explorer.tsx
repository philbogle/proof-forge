
'use client';

import * as React from 'react';

import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { answerQuestion } from '@/ai/flows/natural-language-questioning';
import { generateProof } from '@/ai/flows/generate-proof-flow';
import { editProof } from '@/ai/flows/edit-proof-flow';
import { theorems } from '@/lib/theorems';
import type { FormalityLevel, ProofVersion } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Trash2, History, RefreshCw, Save } from 'lucide-react';
import AppHeader from './proof-explorer/app-header';
import TheoremSelector from './proof-explorer/theorem-selector';
import ProofControls from './proof-explorer/proof-controls';
import ProofView from './proof-explorer/proof-view';
import InteractionPanel from './proof-explorer/interaction-panel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const formalityLevels: { id: FormalityLevel; name: string }[] = [
  { id: 'english', name: 'English' },
  { id: 'informal', name: 'Informal' },
  { id: 'rigorous', name: 'Rigorous' },
];

export default function ProofExplorer() {
  const { user } = useAuth();
  const [selectedTheoremId, setSelectedTheoremId] = React.useState(
    theorems[0].id
  );
  const [formalityLevel, setFormalityLevel] =
    React.useState<FormalityLevel>('informal');
  const [proof, setProof] = React.useState('');
  const [rawProofEdit, setRawProofEdit] = React.useState('');
  const [proofPages, setProofPages] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isFading, setIsFading] = React.useState(false);

  const [proofCache, setProofCache] = React.useState<
    Record<string, ProofVersion[]>
  >({});
  const [selectedVersion, setSelectedVersion] = React.useState<string>('');

  const [isProofLoading, setIsProofLoading] = React.useState(true);
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

  const currentProofHistory = React.useMemo(() => {
    const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;
    return proofCache[cacheKey] || [];
  }, [proofCache, selectedTheorem.id, formalityLevel]);

  const parseProofIntoPages = (fullProof: string) => {
    if (!fullProof) return [];
    const pages = fullProof
      .split(/(<a id="step-\d+"><\/a>)/)
      .filter((p) => p.trim() !== '');

    const combinedPages: string[] = [];
    for (let i = 0; i < pages.length; i += 2) {
      if (i + 1 < pages.length) {
        combinedPages.push(pages[i] + pages[i + 1]);
      } else {
        if (!pages[i].startsWith('<a')) {
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
    } else if (pages.length === 1 && currentPage !== 1) {
      setCurrentPage(1);
    } else if (pages.length > 0 && currentPage === 0) {
      setCurrentPage(1);
    }
  }, [proof, currentPage]);

  React.useEffect(() => {
    if (!renderMarkdown && user) {
      setRawProofEdit(proofPages[currentPage - 1] || '');
    }
  }, [renderMarkdown, user, currentPage, proofPages]);

  const saveProofVersion = React.useCallback(
    async (level: FormalityLevel, newProof: string) => {
      const cacheKey = `${selectedTheorem.id}-${level}`;
      const newVersion: ProofVersion = {
        proof: newProof,
        timestamp: new Date().toISOString(),
        user: user ? { name: user.displayName, id: user.uid } : undefined,
      };

      const updatedHistory = [newVersion, ...(proofCache[cacheKey] || [])].slice(
        0,
        10
      );

      setProofCache((prev) => ({ ...prev, [cacheKey]: updatedHistory }));

      try {
        await setDoc(doc(db, 'proofs', cacheKey), {
          history: updatedHistory,
        });
      } catch (error) {
        console.error('Firestore cache write failed:', error);
      }
    },
    [selectedTheorem.id, proofCache, user]
  );

  const generateSingleProof = React.useCallback(
    async (
      level: FormalityLevel,
      structuralProof?: string
    ): Promise<string> => {
      const { proof: newProof } = await generateProof({
        theoremName: selectedTheorem.name,
        theoremStatement: selectedTheorem.statement,
        formality: level,
        userBackground,
        structuralProof,
      });

      await saveProofVersion(level, newProof);
      return newProof;
    },
    [selectedTheorem, userBackground, saveProofVersion]
  );

  const generateNewProof = React.useCallback(
    async (forceRefresh = false) => {
      setIsFading(true);
      setIsProofLoading(true);
      setAnswer('');
      setInteractionText('');
      setSelectedVersion('');

      const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;

      if (
        !forceRefresh &&
        proofCache[cacheKey] &&
        proofCache[cacheKey].length > 0
      ) {
        setProof(proofCache[cacheKey][0].proof);
        setIsProofLoading(false);
        setTimeout(() => setIsFading(false), 50);
        return;
      }

      if (!forceRefresh) {
        try {
          const cachedDoc = await getDoc(doc(db, 'proofs', cacheKey));
          if (cachedDoc.exists()) {
            const data = cachedDoc.data();
            const history: ProofVersion[] = data.history || [];
            if (history.length > 0) {
              setProof(history[0].proof);
              setProofCache((prev) => ({ ...prev, [cacheKey]: history }));
              setIsProofLoading(false);
              setTimeout(() => setIsFading(false), 50);
              return;
            }
          }
        } catch (error: any) {
          console.error('Firestore cache read failed:', error);
        }
      }

      if (isProofLoading) {
        if (proof) setProof('');
      }

      try {
        const structuralProofLevels: FormalityLevel[] =
          formalityLevel === 'english'
            ? ['informal', 'rigorous']
            : formalityLevel === 'informal'
              ? ['english', 'rigorous']
              : ['informal', 'english'];

        let structuralProof: string | undefined;

        for (const level of structuralProofLevels) {
          const structuralProofKey = `${selectedTheorem.id}-${level}`;
          const history = proofCache[structuralProofKey];
          if (history && history.length > 0) {
            structuralProof = history[0].proof;
            if (structuralProof) break;
          }

          try {
            const cachedDoc = await getDoc(
              doc(db, 'proofs', structuralProofKey)
            );
            if (cachedDoc.exists()) {
              const data = cachedDoc.data();
              const structuralHistory: ProofVersion[] = data.history || [];
              if (structuralHistory.length > 0) {
                structuralProof = structuralHistory[0].proof;
                break;
              }
            }
          } catch (error) {
            /* ignore */
          }
        }

        let newProof;
        if (!structuralProof && formalityLevel !== 'informal') {
          const informalProof = await generateSingleProof('informal');
          newProof = await generateSingleProof(formalityLevel, informalProof);
        } else {
          newProof = await generateSingleProof(formalityLevel, structuralProof);
        }

        setProof(newProof);
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
        setTimeout(() => setIsFading(false), 50);
      }
    },
    [
      formalityLevel,
      userBackground,
      toast,
      selectedTheorem,
      proofCache,
      isProofLoading,
      proof,
      generateSingleProof,
    ]
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
    if (!user) return;
    const keysToClear = Object.keys(proofCache).filter((key) =>
      key.startsWith(selectedTheorem.id)
    );

    const newCache = { ...proofCache };
    keysToClear.forEach((key) => {
      delete newCache[key];
    });
    setProofCache(newCache);

    try {
      const deletePromises = [
        deleteDoc(doc(db, 'proofs', `${selectedTheorem.id}-english`)),
        deleteDoc(doc(db, 'proofs', `${selectedTheorem.id}-informal`)),
        deleteDoc(doc(db, 'proofs', `${selectedTheorem.id}-rigorous`)),
      ];
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing Firestore cache:', error);
      toast({
        variant: 'destructive',
        title: 'Cache Error',
        description:
          'Could not clear the Firestore cache. Please check the console.',
      });
    }

    toast({
      title: 'Cache Cleared',
      description: `The cache for "${selectedTheorem.name}" has been cleared.`,
    });

    generateNewProof(true);
  };

  const handleRollback = async () => {
    if (!user) return;
    if (!selectedVersion) {
      toast({
        variant: 'destructive',
        title: 'No Version Selected',
        description: 'Please select a version to rollback to.',
      });
      return;
    }

    const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;
    const history = proofCache[cacheKey] || [];
    const versionToRestore = history.find(
      (v) => v.timestamp === selectedVersion
    );

    if (!versionToRestore) {
      toast({
        variant: 'destructive',
        title: 'Version Not Found',
        description: 'The selected version could not be found in the history.',
      });
      return;
    }

    setIsFading(true);
    // This moves the selected version to the top of the history list
    const newHistory = [
      versionToRestore,
      ...history.filter((v) => v.timestamp !== selectedVersion),
    ];

    setProofCache((prev) => ({ ...prev, [cacheKey]: newHistory }));
    setProof(versionToRestore.proof);

    try {
      await setDoc(doc(db, 'proofs', cacheKey), {
        history: newHistory,
      });
    } catch (error) {
      console.error('Firestore cache write failed during rollback:', error);
    }

    setTimeout(() => setIsFading(false), 50);

    toast({
      title: 'Rollback Successful',
      description: `Proof has been rolled back to the version from ${new Date(
        selectedVersion
      ).toLocaleString()}.`,
    });
  };
  
  const handleRawProofSave = async () => {
    if (!user) return;
    setIsFading(true);
    setIsProofLoading(true);

    const pages = [...proofPages];
    pages[currentPage - 1] = rawProofEdit;
    const newFullProof = pages.join('');

    await saveProofVersion(formalityLevel, newFullProof);
    setProof(newFullProof);

    setIsProofLoading(false);
    setTimeout(() => setIsFading(false), 50);
    toast({
      title: 'Proof Saved',
      description: 'Your changes have been saved.',
    });
  };

  const handleInteraction = async (type: 'question' | 'edit') => {
    if (!interactionText.trim()) return;

    if (type === 'edit' && !user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be signed in to request an edit.',
      });
      return;
    }

    setIsInteractionLoading(true);
    setAnswer('');

    const proofSection = proofPages[currentPage - 1] || '';

    try {
      if (type === 'question') {
        const result = await answerQuestion({
          theoremName: selectedTheorem.name,
          theoremText: proof,
          question: interactionText,
          formalityLevel,
          proofSection,
        });
        setAnswer(result.answer);
      } else if (type === 'edit') {
        setIsFading(true);
        setIsProofLoading(true);
        const { editedProof } = await editProof({
          proof: proof,
          request: interactionText,
          theoremName: selectedTheorem.name,
          formality: formalityLevel,
          proofSection,
        });

        await saveProofVersion(formalityLevel, editedProof);
        setProof(editedProof);

        setIsProofLoading(false);
        setTimeout(() => setIsFading(false), 50);
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
      <div className="flex h-full min-h-screen w-full flex-col">
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <AppHeader />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="sticky top-6 space-y-4">
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
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <ProofView
                proof={!renderMarkdown && user ? rawProofEdit : (proofPages[currentPage - 1] || '')}
                renderMarkdown={renderMarkdown}
                isLoading={isProofLoading}
                isFading={isFading}
                isEditable={!renderMarkdown && !!user}
                onRawProofChange={setRawProofEdit}
              />
              <div className="flex w-full items-center justify-end space-x-2">
                {!renderMarkdown && user && (
                  <Button onClick={handleRawProofSave} size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
                <Label htmlFor="markdown-toggle" className="text-sm font-medium">
                  Rendered
                </Label>
                <Switch
                  id="markdown-toggle"
                  checked={renderMarkdown}
                  onCheckedChange={setRenderMarkdown}
                />
              </div>

              <InteractionPanel
                interactionText={interactionText}
                onInteractionTextChange={setInteractionText}
                onInteract={handleInteraction}
                isInteractionLoading={isInteractionLoading}
                answer={answer}
                isUserSignedIn={!!user}
              />
              
              {user && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="advanced-settings">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <AlertCircle className="h-4 w-4" />
                        Advanced Settings
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardContent className="space-y-6 pt-6">
                          <div className="space-y-2">
                            <h4 className="font-semibold">
                              Refresh and Regenerate Proof
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Force a new proof to be generated, ignoring the
                              current cache. This will be attributed to you.
                            </p>
                            <Button
                              variant="secondary"
                              onClick={() => generateNewProof(true)}
                              disabled={isProofLoading}
                            >
                              <RefreshCw
                                className={`mr-2 h-4 w-4 ${
                                  isProofLoading ? 'animate-spin' : ''
                                }`}
                              />
                              {isProofLoading
                                ? 'Refreshing...'
                                : 'Refresh Proof'}
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">
                                Clear Theorem Cache
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Delete all cached proofs for "
                                {selectedTheorem.name}" and regenerate.
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              onClick={handleClearCache}
                              size="sm"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Clear
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  Proof Version History
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Rollback to a previous version of the proof for
                                  the current formality level.
                                </p>
                              </div>
                            </div>
                            {currentProofHistory.length > 0 ? (
                              <div className="flex items-end gap-2">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                  <Label htmlFor="version-select">
                                    Select Version
                                  </Label>
                                  <Select
                                    onValueChange={setSelectedVersion}
                                    value={selectedVersion}
                                  >
                                    <SelectTrigger id="version-select">
                                      <SelectValue placeholder="Select a version to restore" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {currentProofHistory.map((version) => (
                                        <SelectItem
                                          key={version.timestamp}
                                          value={version.timestamp}
                                        >
                                          {new Date(
                                            version.timestamp
                                          ).toLocaleString()}{' '}
                                          {version.user?.name &&
                                            `by ${version.user.name}`}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  onClick={handleRollback}
                                  disabled={!selectedVersion}
                                >
                                  <History className="mr-2 h-4 w-4" />
                                  Rollback
                                </Button>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No history available for this proof and formality
                                level.
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

    