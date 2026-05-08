'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './navItems';

type GlobalNavProps = {
  orientation?: 'horizontal' | 'vertical';
};

export function GlobalNav({ orientation = 'horizontal' }: GlobalNavProps) {
  const pathname = usePathname();
  const isVertical = orientation === 'vertical';

  return (
    <nav aria-label="グローバルナビゲーション">
      <ul className={`text-sm ${isVertical ? 'grid gap-2' : 'flex flex-wrap gap-2'}`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                className={`inline-flex rounded-lg border px-3 py-1.5 transition ${isVertical ? 'w-full justify-start' : ''} ${
                  isActive
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-text-primary)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]'
                }`}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
