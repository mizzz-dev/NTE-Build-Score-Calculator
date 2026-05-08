import type { ReactNode } from 'react';
import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import { GlobalNav } from '@/components/navigation/GlobalNav';
import { AuthProvider } from '@/features/auth/AuthProvider';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-transparent">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 md:py-8 lg:gap-8">
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit lg:w-64">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/85 p-4 shadow-[0_0_36px_rgba(82,243,255,0.08)] backdrop-blur">
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--color-text-muted)]">GLOBAL NAV</p>
            <GlobalNav orientation="vertical" />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <AppFooter />
      </div>
    </AuthProvider>
  );
}
