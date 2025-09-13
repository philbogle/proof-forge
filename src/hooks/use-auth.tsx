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
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
