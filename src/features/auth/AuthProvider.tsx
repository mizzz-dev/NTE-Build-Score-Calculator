'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseAuthEnabled } from '@/lib/supabase/config';
import { readAuthUser, writeAuthUser } from './storage';
import { resolveAuthUserFromHash } from './client';
import type { AuthState } from './types';

const AuthContext = createContext<AuthState>({ status: 'loading', user: null });

function resolveCurrentAuthState(): AuthState {
  if (!isSupabaseAuthEnabled()) return { status: 'disabled', user: null };

  const hashUser = resolveAuthUserFromHash();
  const user = hashUser ?? readAuthUser();

  return { status: user ? 'signed_in' : 'signed_out', user };
}

function persistHashUserIfNeeded(): void {
  const hashUser = resolveAuthUserFromHash();
  if (!hashUser || typeof window === 'undefined') return;

  writeAuthUser(hashUser);
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null });

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) return;
      persistHashUserIfNeeded();
      setState(resolveCurrentAuthState());
    });

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthState(): AuthState {
  return useContext(AuthContext);
}
