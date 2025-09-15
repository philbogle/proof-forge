// src/hooks/use-proof-explorer.tsx
'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { answerQuestion } from '@/ai/flows/natural-language-questioning';
import { generateProof } from '@/ai/flows/generate-proof-flow';
import { editProof } from '@/ai/flows/edit-proof-flow';
import { classifyIntent } from '@/ai/flows/classify-intent-flow';
import type { FormalityLevel, ProofVersion, ConversationTurn, Theorem } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { isAdmin } from '@/lib/auth';

const LOADING_INDICATOR_DELAY = 500; // ms

interface UseProofExplorerProps {
  proofViewRef: React.RefObject<HTMLDivElement>;
  initialTheoremId: string;
}

/**
 * A post-processing function to ensure $$ delimiters are correctly formatted.
 * It ensures that each $$ is preceded and followed by exactly one newline,
 * and removes any other leading/trailing whitespace on that line.
 * @param proofText The raw markdown proof text.
 * @returns The formatted proof text.
 */
function formatProof(proofText: string): string {
  if (!proofText) return '';
  // This regex finds all occurrences of $$...$$ blocks, trims whitespace around them,
  // and ensures they are separated by a single newline.
  // It handles cases where there might be no newlines, multiple newlines, or just spaces.
  return proofText.replace(/\s*\$\$\s*([\s\S]*?)\s*\$\$\s*/g, '\n\n$$\n$1\n$$\n\n').trim();
}


export function useProofExplorer({ proofViewRef, initialTheoremId }: UseProofExplorerProps) {
  const { user } = useAuth();
  const [selectedTheorem, setSelectedTheorem] = React.useState<Theorem | null>(null);
  const [formalityLevel, setFormalityLevel] =
    React.useState<FormalityLevel>('semiformal');
  const [proof, setProof] = React.useState('');
  const [rawProofEdit, setRawProofEdit] = React.useState('');
  const [proofPages, setProofPages] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isFading, setIsFading] = React.useState(false);

  const [proofCache, setProofCache] = React.useState<
    Record<string, ProofVersion[]>
  >({});
  const [selectedVersion, setSelectedVersion] = React.useState<string>('');

  const [isProofLoading, setIsProofLoading] = React.useState(true);
  const [interactionText, setInteractionText] = React.useState('');
  const [conversationHistory, setConversationHistory] = React.useState<ConversationTurn[]>([]);
  const [isInteractionLoading, setIsInteractionLoading] = React.useState(false);
  const [userBackground] = React.useState(
    'a college student studying mathematics'
  );
  const [renderMarkdown, setRenderMarkdown] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  
  const isUserAdmin = isAdmin(user);

  const { toast } = useToast();

  const loadingTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const fetchTheorem = async () => {
        if (!initialTheoremId) return;
        setIsProofLoading(true);
        try {
            const theoremDoc = await getDoc(doc(db, 'theorems', initialTheoremId));
            if (theoremDoc.exists()) {
                const theoremData = { id: theoremDoc.id, ...theoremDoc.data() } as Theorem;
                if (theoremData.adminApproved || isUserAdmin) {
                    setSelectedTheorem(theoremData);
                } else {
                    setSelectedTheorem(null);
                }
            } else {
                setSelectedTheorem(null);
            }
        } catch (error) {
            console.error("Error fetching theorem:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not fetch the specified theorem.",
            });
        }
    };
    fetchTheorem();
  }, [initialTheoremId, isUserAdmin, toast]);


  const currentProofHistory = React.useMemo(() => {
    if (!selectedTheorem) return [];
    const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;
    return proofCache[cacheKey] || [];
  }, [proofCache, selectedTheorem, formalityLevel]);

  const parseProofIntoPages = (fullProof: string) => {
    if (!fullProof || !selectedTheorem) return [];
  
    // Split the proof by Markdown headers (### 1., ### 2., etc.)
    const pages = fullProof.split(/(?=###\s+\d+\.)/).map(p => p.trim()).filter(Boolean);
  
    return pages.filter(p => p.trim() !== '');
  };


  React.useEffect(() => {
    const pages = parseProofIntoPages(proof);
    setProofPages(pages);
    if (currentPage >= pages.length && pages.length > 0) {
      setCurrentPage(pages.length -1);
    } else if (pages.length === 0) {
      setCurrentPage(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proof, selectedTheorem]);

  React.useEffect(() => {
    if (isEditing) {
      setRawProofEdit(proofPages[currentPage] || '');
      setRenderMarkdown(false); // Default to edit view when entering editing mode
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, currentPage, proofPages]);

  const saveProofVersion = React.useCallback(
    async (level: FormalityLevel, newProof: string) => {
      if (!selectedTheorem) return;
      
      const formattedProof = formatProof(newProof);

      const cacheKey = `${selectedTheorem.id}-${level}`;
      const newVersion: ProofVersion = {
        proof: formattedProof,
        timestamp: new Date().toISOString(),
      };

      if (user) {
        newVersion.user = { name: user.displayName, id: user.uid };
      }

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
    [selectedTheorem, proofCache, user]
  );

  const generateSingleProof = React.useCallback(
    async (
      level: FormalityLevel,
      structuralProof?: string
    ): Promise<string> => {
      if (!selectedTheorem) throw new Error("No theorem selected");
      const { proof: newProof } = await generateProof({
        theoremName: selectedTheorem.name,
        formality: level,
        userBackground,
        structuralProof,
      });

      const formattedProof = formatProof(newProof);
      await saveProofVersion(level, formattedProof);
      return formattedProof;
    },
    [selectedTheorem, userBackground, saveProofVersion]
  );

  const generateNewProof = React.useCallback(
    async (forceRefresh = false) => {
      if (!selectedTheorem) {
         setIsProofLoading(false);
         return;
      }
      setIsFading(true);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = setTimeout(() => {
        setIsProofLoading(true);
      }, LOADING_INDICATOR_DELAY);
      const initialMessage = isUserAdmin
        ? "I am an AI assistant. Feel free to ask me any questions about this proof, or request an edit by describing the change you'd like to see (e.g., 'Make the base case more detailed' or 'Fix the typo in step 2')."
        : "I am an AI assistant. You can ask me any questions about this proof to help you understand it better.";
      
      setConversationHistory([{ question: '', answer: initialMessage }]);
      setInteractionText('');
      setSelectedVersion('');

      const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;
      
      const handleCachedProof = (proofToSet: string) => {
        setTimeout(() => {
          setProof(proofToSet);
          if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
          setIsProofLoading(false);
          setTimeout(() => setIsFading(false), 100);
        }, 300);
      };

      if (
        !forceRefresh &&
        proofCache[cacheKey] &&
        proofCache[cacheKey].length > 0
      ) {
        handleCachedProof(proofCache[cacheKey][0].proof);
        return;
      }

      if (!forceRefresh) {
        try {
          const cachedDoc = await getDoc(doc(db, 'proofs', cacheKey));
          if (cachedDoc.exists()) {
            const data = cachedDoc.data();
            const history: ProofVersion[] = data.history || [];
            if (history.length > 0) {
              setProofCache((prev) => ({ ...prev, [cacheKey]: history }));
              handleCachedProof(history[0].proof);
              return;
            }
          }
        } catch (error: any) {
          console.error('Firestore cache read failed:', error);
        }
      }
      
      // If we've reached here, we need to generate a new proof, so ensure the loader is showing
      if (!isProofLoading && !loadingTimerRef.current) {
         setIsProofLoading(true);
      }
      if (proof) setProof('');


      try {
        const structuralProofLevels: FormalityLevel[] =
          formalityLevel === 'english'
            ? ['semiformal', 'rigorous']
            : formalityLevel === 'semiformal'
            ? ['english', 'rigorous']
            : ['semiformal', 'english'];

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
        if (!structuralProof && formalityLevel !== 'semiformal') {
          const semiformalProof = await generateSingleProof('semiformal');
          newProof = await generateSingleProof(formalityLevel, semiformalProof);
        } else {
          newProof = await generateSingleProof(formalityLevel, structuralProof);
        }

        setProof(newProof);
      } catch (error: any) {
        console.error('Error generating proof:', error);
        toast({
          variant: 'destructive',
          title: 'Proof Generation Error',
          description: `An error occurred: ${error.message}`,
        });
        setProof('Failed to generate proof.');
      } finally {
        if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
        setIsProofLoading(false);
        setTimeout(() => setIsFading(false), 100);
      }
    },
    [
      formalityLevel,
      toast,
      selectedTheorem,
      proofCache,
      isProofLoading,
      proof,
      generateSingleProof,
      isUserAdmin,
    ]
  );

  React.useEffect(() => {
    const run = async () => {
      if (selectedTheorem) {
        await generateNewProof();
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTheorem, formalityLevel]);
  
  const handleToggleEditing = () => {
    if (!isUserAdmin) return;
    setIsEditing(prev => !prev);
  };

  const handleDiscardChanges = () => {
    setIsEditing(false);
    setRenderMarkdown(true);
    // No need to reset rawProofEdit, useEffect handles it
  };


  const handleFormalityChange = (level: FormalityLevel) => {
    if (isEditing) {
      handleDiscardChanges();
    }
    setFormalityLevel(level);
    setIsEditing(false);
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    
    proofViewRef.current?.scrollIntoView();

    setIsFading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsFading(false);
    }, 150);
  };

  const handleClearCache = async () => {
    if (!isUserAdmin || !selectedTheorem) return;
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
        deleteDoc(doc(db, 'proofs', `${selectedTheorem.id}-semiformal`)),
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
    if (!isUserAdmin || !selectedTheorem) return;
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

    setTimeout(() => setIsFading(false), 100);

    toast({
      title: 'Rollback Successful',
      description: `Proof has been rolled back to the version from ${new Date(
        selectedVersion
      ).toLocaleString()}.`,
    });
  };

  const handleRawProofSave = async () => {
    if (!isUserAdmin || !selectedTheorem) return;
    setIsFading(true);
    setIsProofLoading(true);
  
    const pages = [...proofPages];
    pages[currentPage] = rawProofEdit;
  
    // Reconstruct the full proof from all the pages
    const newFullProof = pages.join('\n\n');
  
    await saveProofVersion(formalityLevel, newFullProof);
    // We get the formatted proof from the first item in the updated history
    const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;
    const updatedHistory = proofCache[cacheKey] || [];
    const formattedProof = updatedHistory.length > 0 ? updatedHistory[0].proof : formatProof(newFullProof);
    
    setProof(formattedProof);
  
    setIsProofLoading(false);
    setTimeout(() => {
      setIsFading(false);
      setIsEditing(false);
      setRenderMarkdown(true);
    }, 100);
    toast({
      title: 'Proof Saved',
      description: 'Your changes have been saved.',
    });
  };

  const handleInteraction = async () => {
    if (!interactionText.trim()) return;

    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Sign In Required',
            description: 'Please sign in to interact with the AI assistant.',
        });
        return;
    }
  
    if (!selectedTheorem) return;
    setIsInteractionLoading(true);
    const currentQuestion = interactionText;
    setInteractionText('');
    setConversationHistory(prev => [...prev, { question: currentQuestion, answer: '' }]);
  
    const proofSection = proofPages[currentPage] || '';
    const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;
    const latestProof = proofCache[cacheKey]?.[0]?.proof || proof;
  
    try {
      const { intent } = await classifyIntent({ text: currentQuestion });
  
      if (intent === 'edit' && !isUserAdmin) {
        const adminMessage = "I'm sorry, you must be an administrator to request an edit. You can ask questions about the proof to understand it better.";
        setConversationHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].answer = adminMessage;
          return newHistory;
        });
        setIsInteractionLoading(false);
        return;
      }
  
      if (intent === 'question') {
        const result = await answerQuestion({
          theoremName: selectedTheorem.name,
          theoremText: latestProof,
          question: currentQuestion,
          formalityLevel,
          proofSection,
          history: conversationHistory.slice(0, -1), // Don't include the current question
        });
        setConversationHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].answer = result.answer;
          return newHistory;
        });
      } else if (intent === 'edit') {
        setIsFading(true);
        setIsProofLoading(true);
        const { editedProof, summary } = await editProof({
          proof: latestProof,
          request: currentQuestion,
          theoremName: selectedTheorem.name,
          formality: formalityLevel,
          proofSection,
        });
  
        await saveProofVersion(formalityLevel, editedProof);
        // We get the formatted proof from the first item in the updated history
        const updatedHistory = proofCache[cacheKey] || [];
        const formattedProof = updatedHistory.length > 0 ? updatedHistory[0].proof : formatProof(editedProof);

        setProof(formattedProof);
        setConversationHistory(prev => {
           const newHistory = [...prev];
           newHistory[newHistory.length - 1].answer = summary;
           return newHistory;
        });
  
        setIsProofLoading(false);
        setTimeout(() => setIsFading(false), 100);
      }
    } catch (error: any) {
      console.error(`Error during interaction:`, error);
      const errorMessage = "I'm sorry, I couldn't process your request. Please try again.";
      toast({
        variant: 'destructive',
        title: 'Interaction Error',
        description: `An error occurred: ${error.message}`,
      });
      setConversationHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].answer = errorMessage;
        return newHistory;
      });
       if (isProofLoading) {
        setIsProofLoading(false);
        setIsFading(false);
       }
    } finally {
      setIsInteractionLoading(false);
    }
  };

  return {
    user,
    isUserAdmin,
    isEditing,
    selectedTheorem,
    formalityLevel,
    proof,
    proofPages,
    currentPage,
    isFading,
    proofCache,
    selectedVersion,
    isProofLoading,
    interactionText,
    conversationHistory,
    isInteractionLoading,
    userBackground,
    renderMarkdown,
    rawProofEdit,
    currentProofHistory,
    setProof,
    setRawProofEdit,
    setProofPages,
    handleFormalityChange,
    handlePageChange,
    setRenderMarkdown,
    handleRawProofSave,
    handleInteraction,
    setInteractionText,
    generateNewProof,
    handleClearCache,
    setSelectedVersion,
    handleRollback,
    handleToggleEditing,
    handleDiscardChanges,
  };
}
