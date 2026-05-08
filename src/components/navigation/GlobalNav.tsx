import Link from 'next/link';
import { navItems } from './navItems';

export function GlobalNav() {
  return (
    <nav aria-label="グローバルナビゲーション">
      <ul className="flex flex-wrap gap-3 text-sm">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link className="underline" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
