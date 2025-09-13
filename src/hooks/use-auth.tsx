// src/hooks/use-auth.tsx
'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import type { User, Auth } from 'firebase/auth';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import type { AuthContextType } from '@/lib/types';

const AuthContext = createContext<AuthContextType>({
  auth: null,
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Initialize auth instance directly, not in an effect
  const [auth] = useState<Auth>(getAuth(app));

  useEffect(() => {
    console.log('Auth provider mounted, auth instance available:', auth);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Auth state changed: User is signed in.', user);
        setUser(user);
      } else {
        console.log('Auth state changed: User is signed out.');
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('Auth provider unmounted, unsubscribing from auth state changes.');
      unsubscribe();
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
