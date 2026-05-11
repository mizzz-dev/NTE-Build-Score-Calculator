'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from '@/features/auth/AuthProvider';
import { isSupabaseAuthEnabled } from '@/lib/supabase/config';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { fetchAdminAccessAndDashboard } from './api';
import type { AdminAccessState, AdminDashboardData } from './types';

function AdminMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <li className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </li>
  );
}

export function AdminDashboard() {
  const auth = useAuthState();
  const [access, setAccess] = useState<AdminAccessState>({ kind: 'signed_out' });
  const [data, setData] = useState<AdminDashboardData | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!isSupabaseAuthEnabled()) {
        if (active) setAccess({ kind: 'disabled' });
        return;
      }
      if (auth.status !== 'signed_in' || !auth.user) {
        if (active) setAccess({ kind: 'signed_out' });
        return;
      }

      const result = await fetchAdminAccessAndDashboard(auth.user);
      if (!active) return;

      if (!result.role || !result.data) {
        setAccess({ kind: 'forbidden' });
        return;
      }

      setAccess({ kind: 'authorized', role: result.role });
      setData(result.data);
    };

    void load();

    return () => {
      active = false;
    };
  }, [auth.status, auth.user]);

  return (
    <section className="space-y-6">
      <SectionHeader title="管理ダッシュボード" subtitle="Issue #41: 読み取り専用の初期管理UI" />
      <NeonPanel>
        {auth.status === 'loading' ? <p className="text-sm text-[var(--color-text-secondary)]">認証情報を確認中です...</p> : null}

        {access.kind === 'disabled' ? (
          <p className="text-sm text-[var(--color-text-secondary)]">Supabase未設定のため、管理画面機能は無効です。環境変数設定後に有効化されます。</p>
        ) : null}

        {access.kind === 'signed_out' && auth.status !== 'loading' ? (
          <p className="text-sm text-[var(--color-text-secondary)]">管理画面を表示するにはログインしてください。ヘッダーの「Googleでログイン」を利用できます。</p>
        ) : null}

        {access.kind === 'forbidden' ? (
          <p className="text-sm text-[var(--color-text-secondary)]">権限不足: 管理画面の閲覧には admin / editor / viewer のいずれかのロールが必要です。</p>
        ) : null}

        {access.kind === 'authorized' && data ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">現在のロール: <span className="font-semibold text-[var(--color-text-primary)]">{access.role}</span></p>
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <AdminMetric label="キャラクター" value={data.characters} />
              <AdminMetric label="ロール" value={data.roles} />
              <AdminMetric label="ステータス" value={data.statuses} />
              <AdminMetric label="スコア重み" value={data.scoreWeights} />
              <AdminMetric label="FAQ" value={data.faqs} />
              <AdminMetric label="お知らせ" value={data.announcements} />
              <AdminMetric label="アップデート履歴" value={data.updateHistories} />
              <AdminMetric label="監査ログ" value={access.role === 'admin' ? data.auditLogs ?? 0 : 'adminのみ閲覧可能'} />
            </ul>
            <p className="text-xs text-[var(--color-text-muted)]">本画面は読み取り専用です。作成・更新・削除UIは未実装です。</p>
          </div>
        ) : null}
      </NeonPanel>
    </section>
  );
}
