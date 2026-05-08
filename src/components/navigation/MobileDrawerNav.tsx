import { GlobalNav } from './GlobalNav';

export function MobileDrawerNav() {
  return (
    <details className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 p-3 md:hidden">
      <summary className="cursor-pointer text-sm font-medium text-[var(--color-text-primary)]">メニュー</summary>
      <div className="pt-3">
        <GlobalNav />
      </div>
    </details>
  );
}
