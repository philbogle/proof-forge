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
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { isAdmin } from '@/lib/auth';
import { formatProof } from '@/lib/proof-formatting';
import { useIsMobile } from './use-mobile';
import { useRouter } from 'next/navigation';

const LOADING_INDICATOR_DELAY = 300; // ms


export function useProofExplorer({ proofViewRef, initialTheoremId }: UseProofExplorerProps) {
  const { user } = useAuth();
  const router = useRouter();
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
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [interactionText, setInteractionText] = React.useState('');
  const [conversationHistory, setConversationHistory] = React.useState<ConversationTurn[]>([]);
  const [isInteractionLoading, setIsInteractionLoading] = React.useState(false);
  const [isEditingProof, setIsEditingProof] = React.useState(false);
  const [userBackground] = React.useState(
    'a college student studying mathematics'
  );
  const [renderMarkdown, setRenderMarkdown] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isTitleEditDialogOpen, setIsTitleEditDialogOpen] = React.useState(false);
  const [newTheoremTitle, setNewTheoremTitle] = React.useState('');
  
  const isUserAdmin = isAdmin(user);
  const isOwner = user?.uid === selectedTheorem?.owner?.id;
  const isMobile = useIsMobile();

  const { toast } = useToast();

  const loadingTimerRef = React. useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const fetchTheorem = async () => {
        if (!initialTheoremId) {
            setIsProofLoading(false); // No ID, so nothing to load
            return;
        };

        setIsProofLoading(true);
        try {
            const theoremDocRef = doc(db, 'theorems', initialTheoremId);
            const theoremDoc = await getDoc(theoremDocRef);

            if (theoremDoc.exists()) {
                const theoremData = { id: theoremDoc.id, ...theoremDoc.data() } as Theorem;
                // Unauthenticated users can only see approved theorems.
                if (!theoremData.adminApproved && !user) {
                    setSelectedTheorem(null);
                } else {
                    // Security rules handle the rest of the access control.
                    setSelectedTheorem(theoremData);
                    setNewTheoremTitle(theoremData.name);
                }
            } else {
                setSelectedTheorem(null);
                toast({
                    variant: "destructive",
                    title: "Not Found",
                    description: "The requested theorem does not exist.",
                });
            }
        } catch (error) {
            console.error("Error fetching theorem:", error);
            setSelectedTheorem(null);
            // This will catch permission errors from Firestore security rules
            toast({
                variant: "destructive",
                title: "Error",
                description: "You might not have permission to view this theorem or it does not exist.",
            });
        } finally {
            setIsProofLoading(false);
        }
    };
    fetchTheorem();
  }, [initialTheoremId, toast, user]);


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
      setRawProofEdit(proof); // Start editing with the full proof
      setRenderMarkdown(false); // Default to edit view when entering editing mode
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const saveProofVersion = React.useCallback(
    async (level: FormalityLevel, newProof: string): Promise<string> => {
      if (!selectedTheorem) throw new Error("Theorem not selected");
      
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
        // Revert the optimistic update in cache
        setProofCache((prev) => ({ ...prev, [cacheKey]: proofCache[cacheKey] || [] }));
        throw error; // re-throw to be caught by the caller
      }
      return formattedProof;
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

      const formattedProof = await saveProofVersion(level, newProof);
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
      
      const initialMessage = isUserAdmin
        ? "I am an AI assistant. Feel free to ask me any questions about this proof, or request an edit by describing the change you'd like to see (e.g., 'Make the base case more detailed' or 'Fix the typo in step 2')."
        : "I am an AI assistant. You can ask me any questions about this proof to help you understand it better.";
      
      setConversationHistory([{ question: '', answer: initialMessage }]);
      setInteractionText('');
      setSelectedVersion('');

      const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;
      
      const handleCachedProof = (proofToSet: string) => {
        setProof(proofToSet);
        if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
        setIsProofLoading(false);
        setIsFading(false);
      };
      
      if (
        !forceRefresh &&
        proofCache[cacheKey] &&
        proofCache[cacheKey].length > 0
        ) {
        handleCachedProof(proofCache[cacheKey][0].proof);
        return;
      }
      
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = setTimeout(() => {
        setIsProofLoading(true);
      }, LOADING_INDICATOR_DELAY);

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
      
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      setIsProofLoading(false);
      setIsGenerating(true);

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
        setIsGenerating(false);
        setIsFading(false);
      }
    },
    [
      formalityLevel,
      toast,
      selectedTheorem,
      proofCache,
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
    if (!isUserAdmin && !isOwner) return;
    setIsEditing(prev => !prev);
  };

  const handleDiscardChanges = () => {
    setIsEditing(false);
    setRenderMarkdown(true);
    setRawProofEdit(proof);
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
    
    if (isMobile) {
      proofViewRef.current?.scrollIntoView();
    }

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

  const handleDeleteTheorem = async () => {
    if (!selectedTheorem || (!isUserAdmin && !isOwner)) {
        toast({variant: 'destructive', title: 'Error', description: 'You do not have permission to delete this theorem.'});
        return;
    }
    try {
        await deleteDoc(doc(db, 'theorems', selectedTheorem.id));
        await handleClearCache(); // Also clear proofs from cache and DB
        toast({ title: 'Success', description: 'Theorem has been deleted.' });
        router.push('/');
    } catch (error) {
        console.error('Error deleting theorem:', error);
        toast({variant: 'destructive', title: 'Deletion Failed', description: 'Could not delete the theorem.'});
    }
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

    setIsFading(false);

    toast({
      title: 'Rollback Successful',
      description: `Proof has been rolled back to the version from ${new Date(
        selectedVersion
      ).toLocaleString()}.`,
    });
  };

  const handleRawProofSave = () => {
    if (!isUserAdmin && !isOwner || !selectedTheorem) return;

    const previousProof = proof;
  
    const formattedProof = formatProof(rawProofEdit);
    
    setProof(formattedProof);
    setIsEditing(false);
    setRenderMarkdown(true);
    toast({
      title: 'Proof Saved',
      description: 'Your changes have been saved.',
    });

    // Background save
    saveProofVersion(formalityLevel, formattedProof).catch((error) => {
        console.error("Failed to save proof:", error);
        // Revert UI on failure
        setProof(previousProof); 
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save your changes. Your view has been reverted."
        });
    });
  };

  const handleSaveTitle = async () => {
    if (!selectedTheorem || !(isUserAdmin || isOwner)) {
      toast({ variant: 'destructive', title: 'Permission Denied', description: 'You cannot edit this theorem\'s title.' });
      return;
    }
    if (!newTheoremTitle.trim()) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Title cannot be empty.' });
      return;
    }

    const oldTitle = selectedTheorem.name;
    const finalNewTitle = newTheoremTitle.trim();

    // Optimistic UI update
    setSelectedTheorem(prev => prev ? { ...prev, name: finalNewTitle } : null);
    setIsTitleEditDialogOpen(false);
    toast({ title: 'Success', description: 'Theorem title updated successfully.' });

    try {
      const theoremRef = doc(db, 'theorems', selectedTheorem.id);
      await updateDoc(theoremRef, { name: finalNewTitle });
    } catch (error) {
      console.error('Error updating theorem title:', error);
      // Revert optimistic update on failure
      setSelectedTheorem(prev => prev ? { ...prev, name: oldTitle } : null);
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update the theorem title.' });
    }
  };

  const handleInteraction = async () => {
    if (!interactionText.trim() || !selectedTheorem) return;

    setIsInteractionLoading(true);
    const currentQuestion = interactionText;
    setInteractionText('');
    setConversationHistory(prev => [...prev, { question: currentQuestion, answer: '' }]);
  
    const proofSection = proofPages[currentPage] || '';
    const cacheKey = `${selectedTheorem.id}-${formalityLevel}`;
    const latestProof = proofCache[cacheKey]?.[0]?.proof || proof;
    const canEdit = isUserAdmin || (isOwner && !selectedTheorem.adminApproved);
  
    try {
      const { intent } = await classifyIntent({ text: currentQuestion });
  
      if (intent === 'edit' && !canEdit) {
        const message = isOwner ? "You can only edit a theorem once it's been approved." : "You can only edit your own theorems before they have been approved. You can still ask questions about the proof.";
        setConversationHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].answer = message;
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
        setIsEditingProof(true);
        setIsFading(true);
        // Do not set isGenerating, as it shows a different loading indicator
        const { editedProof, summary } = await editProof({
          proof: latestProof,
          request: currentQuestion,
          theoremName: selectedTheorem.name,
          formality: formalityLevel,
          proofSection,
        });
  
        const formattedProof = await saveProofVersion(formalityLevel, editedProof);

        setProof(formattedProof);
        setConversationHistory(prev => {
           const newHistory = [...prev];
           newHistory[newHistory.length - 1].answer = summary;
           return newHistory;
        });
  
        setIsFading(false);
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
    } finally {
      setIsInteractionLoading(false);
      setIsEditingProof(false);
    }
  };

  return {
    user,
    isUserAdmin,
    isOwner,
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
    isGenerating,
    interactionText,
    conversationHistory,
    isInteractionLoading,
    isEditingProof,
    userBackground,
    renderMarkdown,
    rawProofEdit,
    currentProofHistory,
    isChatOpen,
    setIsChatOpen,
    isTitleEditDialogOpen,
    setIsTitleEditDialogOpen,
    newTheoremTitle,
    setNewTheoremTitle,
    handleSaveTitle,
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
    handleDeleteTheorem,
    setSelectedVersion,
    handleRollback,
    handleToggleEditing,
    handleDiscardChanges,
  };
}
interface UseProofExplorerProps {
    proofViewRef: React.RefObject<HTMLDivElement>;
    initialTheoremId: string;
}
