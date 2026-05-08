'use client';
import { logout, startGoogleLogin } from '@/features/auth/client';
import { useAuthState } from '@/features/auth/AuthProvider';
export function AuthStatus() {
  const auth = useAuthState();
  if (auth.status === 'loading') return <span className="text-xs text-[var(--color-text-muted)]">認証状態を確認中...</span>;
  if (auth.status === 'disabled') return <span className="text-xs text-[var(--color-text-muted)]">ログイン機能は未設定です</span>;
  if (auth.status === 'signed_in') return <div className="flex items-center gap-2"><span className="text-xs text-[var(--color-text-muted)]">ログイン中</span><button type="button" onClick={logout} className="rounded border border-[var(--color-border)] px-2 py-1 text-xs">ログアウト</button></div>;
  return <button type="button" onClick={startGoogleLogin} className="rounded border border-[var(--color-border)] px-2 py-1 text-xs">Googleでログイン</button>;
}
