'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    MathJax?: {
      typesetPromise: () => Promise<void>;
    };
  }
}

export function ProofDisplay({ content }: { content: string }) {
  useEffect(() => {
    const typesetMath = async () => {
      if (window.MathJax) {
        try {
          await window.MathJax.typesetPromise();
        } catch (e) {
          console.error('MathJax typesetPromise failed:', e);
        }
      }
    };
    typesetMath();
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
