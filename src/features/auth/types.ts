export type AuthUser = { id: string; email?: string };
export type AuthState = { status: 'loading' | 'signed_in' | 'signed_out' | 'disabled'; user: AuthUser | null };
