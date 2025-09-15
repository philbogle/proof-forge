// src/app/proof/[theoremId]/page.tsx
'use client';

import ProofExplorer from '@/components/proof-explorer';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProofPage() {
  const params = useParams();
  const theoremId = params.theoremId as string;

  if (!theoremId) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading theorem...</p>
      </div>
    );
  }

  return <ProofExplorer initialTheoremId={theoremId} />;
}
