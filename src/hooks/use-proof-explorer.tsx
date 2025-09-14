// src/hooks/use-proof-explorer.tsx
'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { answerQuestion } from '@/ai/flows/natural-language-questioning';
import { generateProof } from '@/ai/flows/generate-proof-flow';
import { editProof } from '@/ai/flows/edit-proof-flow';
import { classifyIntent } from '@/ai/flows/classify-intent-flow';
import { theorems } from '@/lib/theorems';
import type { FormalityLevel, ProofVersion, ConversationTurn } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { isAdmin } from '@/lib/auth';

const LOADING_INDICATOR_DELAY = 500; // ms

export function useProofExplorer() {
  const { user } = useAuth();
  const [selectedTheoremId, setSelectedTheoremId] = React.useState(
    theorems[0].id
  );
  const [formalityLevel, setFormalityLevel] =
    React.useState<FormalityLevel>('informal');
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
  
    // Find the index of the first step.
    const firstStepIndex = fullProof.search(/###\s+1\./);
  
    let introPage: string;
    let proofSteps: string;
  
    if (firstStepIndex === -1) {
      // If no steps are found, the whole proof is the intro.
      introPage = `${selectedTheorem.statement}\n\n${fullProof}`;
      proofSteps = '';
    } else {
      // Everything before the first step is part of the intro.
      const introText = fullProof.substring(0, firstStepIndex).trim();
      introPage = `${selectedTheorem.statement}${introText ? `\n\n${introText}` : ''}`;
      proofSteps = fullProof.substring(firstStepIndex);
    }
  
    // Split the rest of the proof by Markdown headers (### 2., ### 3., etc.)
    const stepPages = proofSteps.split(/(?=###\s+\d+\.)/).map(p => p.trim()).filter(Boolean);
  
    const pages = [introPage, ...stepPages];
  
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
  }, [proof, selectedTheorem.statement]);

  React.useEffect(() => {
    if (isEditing) {
      setRawProofEdit(proofPages[currentPage] || '');
      setRenderMarkdown(false); // Default to edit view when entering editing mode
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, currentPage, proofPages]);

  const saveProofVersion = React.useCallback(
    async (level: FormalityLevel, newProof: string) => {
      const cacheKey = `${selectedTheorem.id}-${level}`;
      const newVersion: ProofVersion = {
        proof: newProof,
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
    generateNewProof();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTheoremId, formalityLevel]);
  
  const handleToggleEditing = () => {
    if (!isUserAdmin) return;
    setIsEditing(prev => !prev);
  };

  const handleDiscardChanges = () => {
    setIsEditing(false);
    setRenderMarkdown(true);
    // No need to reset rawProofEdit, useEffect handles it
  };


  const handleTheoremChange = (theoremId: string) => {
    setCurrentPage(0);
    setSelectedTheoremId(theoremId);
    setIsEditing(false);
  };

  const handleFormalityChange = (level: FormalityLevel) => {
    setCurrentPage(0);
    setFormalityLevel(level);
    setIsEditing(false);
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsFading(false);
    }, 150);
  };

  const handleClearCache = async () => {
    if (!isUserAdmin) return;
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
    if (!isUserAdmin) return;
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
    if (!isUserAdmin) return;
    setIsFading(true);
    setIsProofLoading(true);

    const pages = [...proofPages];
    pages[currentPage] = rawProofEdit;

    // Reconstruct the full proof from the pages array
    const introContent = pages[0]?.replace(selectedTheorem.statement, '').trim() || '';
    const stepContent = pages.slice(1).join('\n\n');
    const newFullProof = [introContent, stepContent].filter(Boolean).join('\n\n');


    await saveProofVersion(formalityLevel, newFullProof);
    setProof(newFullProof);

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
        setProof(editedProof);
        setConversationHistory(prev => {
           const newHistory = [...prev];
           newHistory[newHistory.length - 1].answer = summary;
           return newHistory;
        });
  
        setIsProofLoading(false);
        setTimeout(() => setIsFading(false), 100);
      }
    } catch (error) {
      console.error(`Error during interaction:`, error);
      const errorMessage = "I'm sorry, I couldn't process your request. Please try again.";
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Could not process your request. Please check the console for details.`,
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
    selectedTheoremId,
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
    setCurrentPage,
    setIsFading,
    setProofCache,
    setSelectedVersion,
    setIsProofLoading,
    setInteractionText,
    setConversationHistory,
    setIsInteractionLoading,
    setRenderMarkdown,
    handleTheoremChange,
    handleFormalityChange,
    handlePageChange,
    handleClearCache,
    handleRollback,
    handleRawProofSave,
    handleInteraction,
    generateNewProof,
    saveProofVersion,
    handleToggleEditing,
    handleDiscardChanges,
  };
}
