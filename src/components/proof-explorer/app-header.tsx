
// src/components/proof-explorer/app-header.tsx
import * as React from 'react';

export default function AppHeader() {
  return (
    <header className="mb-8 flex items-center justify-center gap-4 text-center">
       <div className="flex items-center gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Proof Explorer
        </h1>
      </div>
    </header>
  );
}
