// src/components/proof-explorer/app-header.tsx
'use client';

import * as React from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, LogOut, Shield, ChevronDown, HelpCircle, User } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { isAdmin } from '@/lib/auth';
import Link from 'next/link';

interface AppHeaderProps {
  onToggleEditing?: () => void;
}

export default function AppHeader({ onToggleEditing }: AppHeaderProps) {
  const { user, auth, loading } = useAuth();
  const isUserAdmin = isAdmin(user);

  const handleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      // Don't log an error if the user just closes the sign-in popup
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        console.error('Error signing in with Google:', error);
      }
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="mb-2 flex items-center justify-between gap-4 text-center">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground hover:no-underline">
          Proof Forge
        </Link>
      </div>
      <div>
        {loading ? (
          <Skeleton className="h-9 w-24 rounded-md" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                { user ? (
                    <Button variant="ghost" aria-label="My Account">
                        <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                            <AvatarFallback>
                                {user.displayName ? user.displayName.charAt(0) : '?'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline">{user.displayName}</span>
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" aria-label="My Account">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                <User className='h-5 w-5' />
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                { user ? (
                    <>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {isUserAdmin && (
                            <DropdownMenuItem asChild>
                            <Link href="/admin">
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Admin</span>
                            </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                            <Link href="/help">
                                <HelpCircle className="mr-2 h-4 w-4" />
                                <span>Help</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem onClick={handleSignIn}>
                            <LogIn className="mr-2 h-4 w-4" />
                            <span>Sign In</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/help">
                                <HelpCircle className="mr-2 h-4 w-4" />
                                <span>Help</span>
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
