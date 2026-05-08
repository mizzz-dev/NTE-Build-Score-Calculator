import Link from 'next/link';

type PrimaryCTAProps = {
  href: string;
  label: string;
};

export function PrimaryCTA({ href, label }: PrimaryCTAProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg border border-[var(--color-accent)] bg-linear-to-r from-cyan-400/25 to-emerald-300/20 px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition hover:brightness-125"
    >
      {label}
    </Link>
  );
}
