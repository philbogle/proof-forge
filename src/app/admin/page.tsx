// src/app/admin/page.tsx
'use client';

import * as React from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch, query, orderBy, runTransaction } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Save, Trash2, Edit, AlertTriangle, CheckCircle, XCircle, ArrowUp, ArrowDown } from 'lucide-react';
import type { Theorem, TheoremOwner } from '@/lib/types';
import { seedTheorems } from '@/lib/theorems';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [theorems, setTheorems] = React.useState<Theorem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSeeding, setIsSeeding] = React.useState(false);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [currentTheorem, setCurrentTheorem] = React.useState<Partial<Theorem>>({});
  const [isSaving, setIsSaving] = React.useState(false);

  const fetchTheorems = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const theoremsCollection = collection(db, 'theorems');
       const q = query(theoremsCollection, orderBy('order'));
      const theoremSnapshot = await getDocs(q);
      const theoremsList = theoremSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Theorem[];
      setTheorems(theoremsList);
    } catch (error) {
      console.error('Error fetching theorems:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch theorems from the database.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchTheorems();
  }, [fetchTheorems]);

  const handleSeedDatabase = async () => {
    if (!user) return;
    setIsSeeding(true);
    try {
      const batch = writeBatch(db);
      const theoremsCollection = collection(db, 'theorems');
      const owner: TheoremOwner = { id: user.uid, name: user.displayName };

      seedTheorems.forEach((theorem) => {
        const docRef = doc(theoremsCollection); // Firestore will generate a new ID
        batch.set(docRef, { ...theorem, owner, adminApproved: true });
      });

      await batch.commit();
      toast({
        title: 'Success',
        description: 'Database has been seeded with initial theorems.',
      });
      fetchTheorems(); // Refresh the list
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: 'Could not seed the database. Check console for errors.',
      });
    } finally {
      setIsSeeding(false);
    }
  };
  
  const handleOpenDialog = (theorem?: Theorem) => {
    if (theorem) {
      setCurrentTheorem(theorem);
    } else {
      const nextOrder = theorems.length > 0 ? Math.max(...theorems.map(t => t.order)) + 1 : 0;
      setCurrentTheorem({ name: '', adminApproved: true, order: nextOrder });
    }
    setIsDialogOpen(true);
  };
  
  const handleSaveChanges = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
        return;
    }
    if (!currentTheorem.name) {
        toast({ variant: 'destructive', title: 'Validation Error', description: 'Name is required.' });
        return;
    }

    setIsSaving(true);
    try {
        if (currentTheorem.id) {
            // Update existing theorem
            const theoremRef = doc(db, 'theorems', currentTheorem.id);
            await updateDoc(theoremRef, {
                name: currentTheorem.name,
            });
            toast({ title: 'Success', description: 'Theorem updated successfully.' });
        } else {
            // Add new theorem
            const owner: TheoremOwner = { id: user.uid, name: user.displayName };
            await addDoc(collection(db, 'theorems'), {
                name: currentTheorem.name,
                owner: owner,
                adminApproved: true,
                order: currentTheorem.order,
            });
            toast({ title: 'Success', description: 'Theorem added successfully.' });
        }
        setIsDialogOpen(false);
        setCurrentTheorem({});
        fetchTheorems();
    } catch(error) {
         console.error('Error saving theorem:', error);
         toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save the theorem.'});
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteTheorem = async (theoremId: string) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'theorems', theoremId));
      toast({
        title: 'Success',
        description: 'Theorem has been deleted.',
      });
      fetchTheorems(); // Refresh list
    } catch (error) {
      console.error('Error deleting theorem:', error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: 'Could not delete the theorem.',
      });
      setIsLoading(false);
    }
  };

  const handleApprovalChange = async (theoremId: string, approved: boolean) => {
    try {
        const theoremRef = doc(db, 'theorems', theoremId);
        await updateDoc(theoremRef, {
            adminApproved: approved
        });
        toast({ title: 'Success', description: `Theorem approval status updated.`});
        // Update local state to reflect change immediately
        setTheorems(theorems => theorems.map(t => 
            t.id === theoremId ? { ...t, adminApproved: approved } : t
        ));
    } catch (error) {
        console.error("Error updating approval status: ", error);
        toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update approval status.'});
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= theorems.length) {
      return;
    }

    const newTheorems = [...theorems];
    const currentTheorem = newTheorems[currentIndex];
    const otherTheorem = newTheorems[newIndex];

    try {
      await runTransaction(db, async (transaction) => {
        const currentRef = doc(db, 'theorems', currentTheorem.id);
        const otherRef = doc(db, 'theorems', otherTheorem.id);

        // The transaction swaps the order values in Firestore
        transaction.update(currentRef, { order: otherTheorem.order });
        transaction.update(otherRef, { order: currentTheorem.order });
      });
      
      // Optimistically update UI state
      // Swap the order properties locally
      const tempOrder = currentTheorem.order;
      currentTheorem.order = otherTheorem.order;
      otherTheorem.order = tempOrder;
      
      // Now swap their positions in the array
      [newTheorems[currentIndex], newTheorems[newIndex]] = [newTheorems[newIndex], newTheorems[currentIndex]];
      
      // Set the state with the correctly reordered array
      setTheorems(newTheorems);

      toast({ title: 'Success', description: 'Theorem order updated.' });
    } catch (error) {
      console.error('Error reordering theorems:', error);
      toast({ variant: 'destructive', title: 'Reorder Failed', description: 'Could not update theorem order.' });
      fetchTheorems(); // Refetch to correct any optimistic UI errors
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Theorems</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add Theorem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentTheorem.id ? 'Edit Theorem' : 'Add New Theorem'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Theorem Name"
                value={currentTheorem.name || ''}
                onChange={(e) => setCurrentTheorem({ ...currentTheorem, name: e.target.value })}
              />
            </div>
             <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
          </DialogContent>
        </Dialog>
      </div>

       {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : theorems.length === 0 ? (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>No Theorems Found</CardTitle>
                <CardDescription>Your database is empty. You can seed it with the default theorems.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleSeedDatabase} disabled={isSeeding}>
                {isSeeding ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <AlertTriangle className="mr-2 h-4 w-4" />
                )}
                Seed Database with Default Theorems
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {theorems.map((theorem, index) => (
            <Card key={theorem.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleReorder(index, 'up')} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4"/>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleReorder(index, 'down')} disabled={index === theorems.length - 1}>
                        <ArrowDown className="h-4 w-4"/>
                      </Button>
                    </div>
                    <div>
                      <CardTitle>{theorem.name}</CardTitle>
                      <CardDescription>Owner: {theorem.owner?.name || theorem.owner?.id || 'Unknown'} | Order: {theorem.order}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                      <Switch
                        id={`approved-switch-${theorem.id}`}
                        checked={theorem.adminApproved}
                        onCheckedChange={(checked) => handleApprovalChange(theorem.id, checked)}
                      />
                      <Label htmlFor={`approved-switch-${theorem.id}`}>Approved</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                 <div className="flex items-center gap-2 mt-4 text-sm">
                    {theorem.adminApproved ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={theorem.adminApproved ? 'text-green-600' : 'text-red-600'}>
                        {theorem.adminApproved ? 'Visible to all users' : 'Hidden from users'}
                    </span>
                 </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                 <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(theorem)}>
                   <Edit className="mr-2 h-4 w-4" /> Edit
                 </Button>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the theorem and all associated proof versions.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteTheorem(theorem.id)}>
                            Continue
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
