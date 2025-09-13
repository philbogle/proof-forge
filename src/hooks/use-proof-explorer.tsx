
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
  const [currentPage, setCurrentPage] = React.useState(1);
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
    // Split by Markdown headers (### 1. Title)
    const parts = fullProof.split(/(?=###\s+\d+\.)/);
    if (parts.length === 0) return [];
    if (parts.length === 1 && parts[0].trim() === '') return [];

    // The first part might be an intro without a header, so we handle that.
    const pages = parts.map(part => part.trim()).filter(Boolean);
    
    // If the first page is very short and doesn't start with a header, merge it with the next one.
    if (pages.length > 1 && !pages[0].startsWith('###') && pages[0].split('\n').length < 5) {
      const firstPage = pages.shift();
      if (firstPage) {
        pages[0] = firstPage + '\n\n' + pages[0];
      }
    }
    
    // Filter out any empty pages that might have been created.
    return pages.filter(p => p.trim() !== '');
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

      setConversationHistory([]);
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

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsFading(false);
    }, 150);
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

    setTimeout(() => setIsFading(false), 100);

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
    const newFullProof = pages.join('\n\n');

    await saveProofVersion(formalityLevel, newFullProof);
    setProof(newFullProof);

    setIsProofLoading(false);
    setTimeout(() => setIsFading(false), 100);
    toast({
      title: 'Proof Saved',
      description: 'Your changes have been saved.',
    });
    setRenderMarkdown(true);
  };

  const handleInteraction = async () => {
    if (!interactionText.trim()) return;
  
    setIsInteractionLoading(true);
    const currentQuestion = interactionText;
    setInteractionText('');
    setConversationHistory(prev => [...prev, { question: currentQuestion, answer: '' }]);
  
    const proofSection = proofPages[currentPage - 1] || '';
  
    try {
      const { intent } = await classifyIntent({ text: currentQuestion });
  
      if (intent === 'edit' && !user) {
        toast({
          variant: 'destructive',
          title: 'Authentication Required',
          description: 'You must be signed in to request an edit.',
        });
        setConversationHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].answer = "Please sign in to request an edit.";
          return newHistory;
        });
        setIsInteractionLoading(false);
        return;
      }
  
      if (intent === 'question') {
        const result = await answerQuestion({
          theoremName: selectedTheorem.name,
          theoremText: proof,
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
          proof: proof,
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
  };
}
