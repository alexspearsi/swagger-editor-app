'use client';

import { createContext, useContext } from 'react';

import type { User } from '@/types/user';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
});

export function AuthProvider({ user, children }: { user: User | null; children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
