import Link from 'next/link';
import { GlobalNav } from '@/components/navigation/GlobalNav';
import { MobileDrawerNav } from '@/components/navigation/MobileDrawerNav';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="text-sm font-semibold tracking-[0.08em] text-[var(--color-text-primary)] md:text-base">
            NTE BUILD SCORE CALCULATOR
          </Link>
          <span className="hidden rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)] md:inline-flex">
            非公式ファンツール
          </span>
        </div>
        <div className="hidden md:block">
          <GlobalNav />
        </div>
        <MobileDrawerNav />
      </div>
    </header>
  );
}
