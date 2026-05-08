"use client";

import { useEffect, useState } from 'react';
import { GlobalNav } from './GlobalNav';

export function MobileDrawerNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm"
        onClick={() => setOpen(true)}
      >
        メニュー
      </button>
      <div className={`fixed inset-0 z-40 transition ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <button type="button" aria-label="メニューを閉じる" className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
        <div className="absolute right-0 top-0 h-full w-[84vw] max-w-sm border-l border-[var(--color-border)] bg-[var(--color-bg)] p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold tracking-[0.12em] text-[var(--color-text-muted)]">NAVIGATION</p>
            <button type="button" className="rounded-md border border-[var(--color-border)] px-2 py-1 text-xs" onClick={() => setOpen(false)}>
              閉じる
            </button>
          </div>
          <GlobalNav orientation="vertical" />
        </div>
      </div>
    </div>
  );
}
