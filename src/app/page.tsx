// src/app/page.tsx
'use client';

import * as React from 'react';
import { collection, getDocs, query, where, orderBy, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Theorem, TheoremOwner } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import AppHeader from '@/components/proof-explorer/app-header';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Save } from 'lucide-react';
import { wellKnownTheorems } from '@/lib/theorems';
import { Combobox } from '@/components/ui/combobox';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

function TheoremCard({ theorem }: { theorem: Theorem }) {
  return (
    <Link href={`/proof/${theorem.id}`} key={theorem.id} className="block hover:no-underline">
      <Card className="h-full flex flex-col justify-center hover:border-primary/50 hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle>{theorem.name}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [approvedTheorems, setApprovedTheorems] = React.useState<Theorem[]>([]);
  const [userTheorems, setUserTheorems] = React.useState<Theorem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [newTheoremName, setNewTheoremName] = React.useState('');
  const isMobile = useIsMobile();

  const fetchTheorems = React.useCallback(async () => {
    setIsLoading(true);

    // Reset states
    setApprovedTheorems([]);
    setUserTheorems([]);

    // 1. Fetch all approved theorems
    try {
      const approvedQuery = query(collection(db, 'theorems'), where('adminApproved', '==', true), orderBy('order'));
      const approvedSnapshot = await getDocs(approvedQuery);
      const approvedList = approvedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Theorem));
      setApprovedTheorems(approvedList);
    } catch (error) {
        console.error("Error fetching approved theorems:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch approved theorems from the database.',
        });
    }

    // 2. Fetch user's unapproved theorems
    if (user) {
        try {
            const userQuery = query(
              collection(db, 'theorems'),
              where('owner.id', '==', user.uid),
              where('adminApproved', '==', false)
            );
            const userSnapshot = await getDocs(userQuery);
            const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Theorem));
            // Sort on the client side
            userList.sort((a, b) => a.order - b.order);
            setUserTheorems(userList);
        } catch (error) {
            console.error("Error fetching user's theorems:", error);
            // Don't show a toast for this, as it's an expected error for users without the index
            // and doesn't prevent the main content from loading.
        }
    }
    
    setIsLoading(false);

  }, [user, toast]);

  React.useEffect(() => {
    if (!authLoading) {
      fetchTheorems();
    }
  }, [authLoading, fetchTheorems]);

  const handleAddTheorem = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to add a theorem.' });
        return;
    }
    if (!newTheoremName) {
        toast({ variant: 'destructive', title: 'Validation Error', description: 'Theorem name is required.' });
        return;
    }

    setIsSaving(true);
    try {
        const owner: TheoremOwner = { id: user.uid, name: user.displayName };
        const maxOrder = Math.max(
          ...approvedTheorems.map(t => t.order),
          ...userTheorems.map(t => t.order),
          -1
        );
        
        await addDoc(collection(db, 'theorems'), {
            name: newTheoremName,
            owner: owner,
            adminApproved: false, // Always false for user-added theorems
            order: maxOrder + 1,
        });
        toast({ title: 'Success', description: 'Theorem added and is pending approval.' });
        
        setIsDialogOpen(false);
        setNewTheoremName('');
        fetchTheorems(); // Refresh the lists
    } catch(error) {
         console.error('Error saving theorem:', error);
         toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save the theorem.'});
    } finally {
        setIsSaving(false);
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <AppHeader />
      <main className="mt-6">
        <div className="flex items-center justify-between mb-8">
            <div className="text-left">
                <h1 className="text-4xl font-bold tracking-tight">Welcome to Proof Forge</h1>
                <p className="mt-2 text-lg text-muted-foreground">Select a theorem below to begin your exploration.</p>
            </div>
            {user && !authLoading && !isMobile && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Theorem
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add New Theorem</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Combobox
                                options={wellKnownTheorems}
                                value={newTheoremName}
                                onChange={setNewTheoremName}
                                placeholder="Select a theorem..."
                                searchPlaceholder="Search for a theorem..."
                                emptyMessage="No matching theorem found."
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddTheorem} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Theorem
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
        
        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <>
                {approvedTheorems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedTheorems.map((theorem) => (
                      <TheoremCard key={theorem.id} theorem={theorem} />
                    ))}
                  </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card">
                        <h3 className="text-xl font-semibold">No Theorems Found</h3>
                        <p className="text-muted-foreground">An administrator needs to add and approve theorems.</p>
                    </div>
                )}

                {userTheorems.length > 0 && (
                  <div className="mt-12">
                    <Separator className="my-6" />
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold tracking-tight">My Theorems</h2>
                      <p className="mt-2 text-lg text-muted-foreground">These are your submissions that are pending administrator approval.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {userTheorems.map((theorem) => (
                         <TheoremCard key={theorem.id} theorem={theorem} />
                       ))}
                    </div>
                  </div>
                )}
            </>
        )}
      </main>
    </div>
  );
}
