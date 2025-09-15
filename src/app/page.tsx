// src/app/page.tsx
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Theorem } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import AppHeader from '@/components/proof-explorer/app-header';

async function getTheorems() {
  const theoremsCollection = collection(db, 'theorems');
  const q = query(theoremsCollection, where('adminApproved', '==', true), orderBy('order'));
  const theoremSnapshot = await getDocs(q);
  const theoremsList = theoremSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Theorem));
  return theoremsList;
}

export default async function Home() {
  const theorems = await getTheorems();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <AppHeader />
      <main className="mt-6">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Welcome to Proof Forge</h1>
            <p className="mt-2 text-lg text-muted-foreground">Select a theorem below to begin your exploration.</p>
        </div>
        
        {theorems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {theorems.map((theorem) => (
              <Link href={`/proof/${theorem.id}`} key={theorem.id} className="block hover:no-underline">
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all duration-200">
                  <CardHeader>
                    <CardTitle>{theorem.name}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card">
                <h3 className="text-xl font-semibold">No Theorems Found</h3>
                <p className="text-muted-foreground">An administrator needs to add and approve theorems.</p>
            </div>
        )}
      </main>
    </div>
  );
}
