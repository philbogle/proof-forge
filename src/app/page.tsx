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
import { Loader2, Plus } from 'lucide-react';
import { wellKnownTheorems } from '@/lib/theorems';
import { Combobox } from '@/components/ui/combobox';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';


function TheoremCard({ theorem }: { theorem: Theorem }) {
  return (
    <Link href={`/proof/${theorem.id}`} className="block hover:no-underline">
      <Card className="h-full flex flex-col justify-between hover:border-primary/50 hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle>{theorem.name}</CardTitle>
          {!theorem.adminApproved && <CardDescription>Pending approval</CardDescription>}
        </CardHeader>
      </Card>
    </Link>
  );
}

function TheoremCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
        </Card>
    )
}

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [approvedTheorems, setApprovedTheorems] = React.useState<Theorem[]>([]);
  const [userTheorems, setUserTheorems] = React.useState<Theorem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [newTheoremName, setNewTheoremName] = React.useState('');

  const fetchTheorems = React.useCallback(async () => {
    setIsLoading(true);
    
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
              where('adminApproved', '==', false),
              orderBy('order')
            );
            const userSnapshot = await getDocs(userQuery);
            const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Theorem));
            setUserTheorems(userList);
        } catch (error) {
            console.error("Error fetching user's theorems:", error);
        }
    } else {
      setUserTheorems([]);
    }
    
    setIsLoading(false);

  }, [user, toast]);

  React.useEffect(() => {
    if (!authLoading) {
      fetchTheorems();
    }
  }, [authLoading, fetchTheorems]);

  const handleAddTheorem = React.useCallback(async (name: string) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to add a theorem.' });
        return;
    }
    if (!name) {
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
        
        const finalTheoremName = name.endsWith('.') ? name.slice(0, -1) : name;

        await addDoc(collection(db, 'theorems'), {
            name: finalTheoremName,
            owner: owner,
            adminApproved: false,
            order: maxOrder + 1,
        });
        toast({ title: 'Success', description: 'Theorem added and is pending approval.' });
        
        setIsAddDialogOpen(false);
        setNewTheoremName('');
        fetchTheorems();
    } catch(error) {
         console.error('Error saving theorem:', error);
         toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save the theorem.'});
    } finally {
        setIsSaving(false);
    }
  }, [user, toast, approvedTheorems, userTheorems, fetchTheorems]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      // Check if there's a highlighted item in the combobox, if so, let the select handler work
      const activeElement = document.activeElement;
      if (activeElement?.closest('[role="listbox"]')?.contains(activeElement) && activeElement.getAttribute('aria-selected') === 'true') {
        return;
      }
      e.preventDefault();
      handleAddTheorem(newTheoremName);
    }
  };

  const addTheoremDialog = (
    <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
        setIsAddDialogOpen(isOpen);
        if (!isOpen) {
            setNewTheoremName('');
        }
    }}>
        <DialogTrigger asChild>
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Theorem
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] p-0" onKeyDown={handleKeyDown}>
            <DialogHeader className='p-6 pb-0'>
                <DialogTitle>Add New Theorem</DialogTitle>
            </DialogHeader>
            <Combobox
                options={wellKnownTheorems}
                value={newTheoremName}
                onValueChange={setNewTheoremName}
                onSelect={(value) => handleAddTheorem(value)}
                onAddNew={(value) => handleAddTheorem(value)}
                placeholder="Select or type a theorem..."
                searchPlaceholder="Search or type a theorem..."
                emptyMessage="No matching theorem found."
                className='border-none shadow-none'
            />
        </DialogContent>
    </Dialog>
  );


  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <AppHeader />
      <main className="mt-6">
        
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <TheoremCardSkeleton key={i} />)}
            </div>
        ) : (
            <>
                {approvedTheorems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedTheorems.map((theorem) => (
                      <TheoremCard
                        key={theorem.id}
                        theorem={theorem}
                      />
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
                         <TheoremCard
                            key={theorem.id}
                            theorem={theorem}
                          />
                       ))}
                    </div>
                  </div>
                )}
            </>
        )}

        {user && !authLoading && (
            <div className="mt-12 flex justify-center">
                {addTheoremDialog}
            </div>
        )}
      </main>
    </div>
  );
}
