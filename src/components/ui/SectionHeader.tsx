type SectionHeaderProps = {
  title: string;
  subtitle: string;
};

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="text-xs tracking-[0.2em] text-[var(--color-accent-strong)] uppercase">NTE BUILD</p>
      <h1 className="text-2xl font-bold leading-tight md:text-3xl">{title}</h1>
      <p className="text-sm text-[var(--color-text-secondary)] md:text-base">{subtitle}</p>
    </header>
  );
}
