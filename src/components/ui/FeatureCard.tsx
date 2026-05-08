import type { ReactNode } from 'react';

type FeatureCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]/70 p-4">
      <div className="mb-2 text-[var(--color-accent)]">{icon ?? '◆'}</div>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{description}</p>
    </article>
  );
}
