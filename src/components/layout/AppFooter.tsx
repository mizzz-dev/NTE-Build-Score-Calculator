import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]/85 p-4 text-xs text-[var(--color-text-secondary)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p>本ツールは非公式ファンツールです。</p>
          <p>公式素材の利用可否: 要確認</p>
        </div>
        <nav aria-label="フッターリンク" className="flex gap-3">
          <Link href="/faq" className="hover:text-[var(--color-text-primary)]">FAQ</Link>
          <Link href="/updates" className="hover:text-[var(--color-text-primary)]">更新情報</Link>
          <Link href="/contact" className="hover:text-[var(--color-text-primary)]">お問い合わせ</Link>
        </nav>
      </div>
    </footer>
  );
}
