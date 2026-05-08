import Link from 'next/link';
import { GlobalNav } from '@/components/navigation/GlobalNav';
import { MobileDrawerNav } from '@/components/navigation/MobileDrawerNav';

export function AppHeader() {
  return (
    <header className="border-b p-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-3">
        <Link href="/" className="text-lg font-semibold">
          NTE Build Score Calculator
        </Link>
        <div className="hidden md:block">
          <GlobalNav />
        </div>
        <MobileDrawerNav />
      </div>
    </header>
  );
}
