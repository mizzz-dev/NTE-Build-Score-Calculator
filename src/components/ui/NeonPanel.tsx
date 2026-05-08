import type { ReactNode } from 'react';

type NeonPanelProps = {
  children: ReactNode;
  className?: string;
};

export function NeonPanel({ children, className }: NeonPanelProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)]/80 p-5 shadow-[var(--glow-accent)] backdrop-blur ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
