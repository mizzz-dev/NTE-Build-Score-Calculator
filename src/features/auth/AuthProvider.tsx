'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseAuthEnabled } from '@/lib/supabase/config';
import { readAuthUser, writeAuthUser } from './storage';
import { resolveAuthUserFromHash } from './client';
import type { AuthState } from './types';
const AuthContext = createContext<AuthState>({ status: 'loading', user: null });
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null });
  useEffect(() => {
    if (!isSupabaseAuthEnabled()) { setState({ status: 'disabled', user: null }); return; }
    const hashUser = resolveAuthUserFromHash();
    if (hashUser) { writeAuthUser(hashUser); window.history.replaceState(null, '', window.location.pathname + window.location.search); }
    const user = hashUser ?? readAuthUser();
    setState({ status: user ? 'signed_in' : 'signed_out', user });
  }, []);
  const value = useMemo(() => state, [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthState(): AuthState { return useContext(AuthContext); }
