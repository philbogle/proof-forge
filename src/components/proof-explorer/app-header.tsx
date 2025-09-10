
// src/components/proof-explorer/app-header.tsx
import * as React from 'react';

export default function AppHeader() {
  return (
    <header className="mb-8 flex flex-col items-center gap-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Proof Explorer
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Select a theorem from the list, then explore its proof at different
        levels of formality.
      </p>
    </header>
  );
}
