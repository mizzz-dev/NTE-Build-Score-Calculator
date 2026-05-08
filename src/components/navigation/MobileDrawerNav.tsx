import { GlobalNav } from './GlobalNav';

export function MobileDrawerNav() {
  return (
    <details className="md:hidden">
      <summary className="cursor-pointer py-2">メニュー</summary>
      <div className="pt-2">
        <GlobalNav />
      </div>
    </details>
  );
}
