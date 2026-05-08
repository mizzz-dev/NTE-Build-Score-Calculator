import { getSupabaseClientConfig } from '@/lib/supabase/config';
import type { AuthUser } from './types';

const AUTH_USER_KEY = 'nte_auth_user_v1';

function buildRedirectUrl(): string {
  return typeof window === 'undefined' ? '' : `${window.location.origin}/`;
}

export function startGoogleLogin(): void {
  const config = getSupabaseClientConfig();
  if (!config || typeof window === 'undefined') return;

  const redirectTo = encodeURIComponent(buildRedirectUrl());
  window.location.assign(`${config.url}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`);
}

export function logout(): void {
  const config = getSupabaseClientConfig();
  if (!config || typeof window === 'undefined') return;

  window.localStorage.removeItem(AUTH_USER_KEY);
  window.location.assign(`${config.url}/auth/v1/logout`);
}

export function resolveAuthUserFromHash(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const userId = params.get('user_id') ?? params.get('sub');
  const email = params.get('email') ?? undefined;
  const accessToken = params.get('access_token') ?? undefined;

  return userId ? { id: userId, email, accessToken } : null;
}
