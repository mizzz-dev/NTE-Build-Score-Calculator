import type { ReactNode } from 'react';

type NeonPanelProps = {
  children: ReactNode;
  className?: string;
};

export function NeonPanel({ children, className }: NeonPanelProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)]/80 p-5 shadow-[0_0_30px_rgba(82,243,255,0.08)] backdrop-blur ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
