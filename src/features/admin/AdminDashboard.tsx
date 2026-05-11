'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthState } from '@/features/auth/AuthProvider';
import { isSupabaseAuthEnabled } from '@/lib/supabase/config';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { createAdminContent, deleteAdminContent, fetchAdminAccessAndDashboard, fetchAdminContentList, updateAdminContent } from './api';
import type { AdminAccessState, AdminContentItem, AdminContentKind, AdminDashboardData } from './types';

const CONTENT_META: Record<AdminContentKind, { label: string; description: string }> = {
  faqs: { label: 'FAQ', description: 'よくある質問の管理' },
  announcements: { label: 'お知らせ', description: '運営告知の管理' },
  updateHistories: { label: 'アップデート履歴', description: '更新履歴の管理' },
};

type FormState = { title: string; body: string; displayOrder: string; publishedAt: string; isPublished: boolean };
const EMPTY_FORM: FormState = { title: '', body: '', displayOrder: '0', publishedAt: '', isPublished: false };

function AdminMetric({ label, value }: { label: string; value: number | string }) {
  return <li className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3"><p className="text-xs text-[var(--color-text-muted)]">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></li>;
}

export function AdminDashboard() {
  const auth = useAuthState();
  const [access, setAccess] = useState<AdminAccessState>({ kind: 'signed_out' });
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [kind, setKind] = useState<AdminContentKind>('faqs');
  const [items, setItems] = useState<AdminContentItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const canEdit = access.kind === 'authorized' && (access.role === 'admin' || access.role === 'editor');

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!isSupabaseAuthEnabled()) return active && setAccess({ kind: 'disabled' });
      if (auth.status !== 'signed_in' || !auth.user) return active && setAccess({ kind: 'signed_out' });
      const result = await fetchAdminAccessAndDashboard(auth.user);
      if (!active) return;
      if (!result.role || !result.data) return setAccess({ kind: 'forbidden' });
      setAccess({ kind: 'authorized', role: result.role });
      setData(result.data);
    };
    void load();
    return () => {
      active = false;
    };
  }, [auth.status, auth.user]);

  const reloadList = async () => {
    if (auth.status !== 'signed_in' || !auth.user || access.kind !== 'authorized') return;
    setLoadingItems(true);
    setError(null);
    try {
      const next = await fetchAdminContentList(auth.user, kind);
      setItems(next);
    } catch {
      setError('一覧取得に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => { void reloadList(); }, [kind, access.kind]);

  const validationError = useMemo(() => {
    if (!form.title.trim()) return 'タイトルは必須です。';
    if (form.title.length > 100) return 'タイトルは100文字以内で入力してください。';
    if (!form.body.trim()) return '本文は必須です。';
    if (form.body.length > 2000) return '本文は2000文字以内で入力してください。';
    const n = Number(form.displayOrder);
    if (!Number.isInteger(n) || n < 0 || n > 9999) return '表示順は0〜9999の整数で入力してください。';
    return null;
  }, [form]);

  const onSubmit = async () => {
    if (!canEdit || !auth.user || validationError) return;
    try {
      const payload = { title: form.title.trim(), body: form.body.trim(), displayOrder: Number(form.displayOrder), publishedAt: form.publishedAt || null, isPublished: form.isPublished };
      if (editingId) await updateAdminContent(auth.user, kind, { id: editingId, ...payload });
      else await createAdminContent(auth.user, kind, payload);
      setForm(EMPTY_FORM); setEditingId(null); await reloadList();
    } catch {
      setError(editingId ? '更新に失敗しました。' : '作成に失敗しました。');
    }
  };

  return (<section className="space-y-6"><SectionHeader title="管理ダッシュボード" subtitle="Issue #43: コンテンツ管理UIの追加" /><NeonPanel>
    {access.kind === 'disabled' && <p className="text-sm text-[var(--color-text-secondary)]">Supabase未設定のため、管理画面機能は無効です。</p>}
    {access.kind === 'signed_out' && auth.status !== 'loading' && <p className="text-sm text-[var(--color-text-secondary)]">管理画面を表示するにはログインしてください。</p>}
    {access.kind === 'forbidden' && <p className="text-sm text-[var(--color-text-secondary)]">権限不足: admin / editor / viewer のロールが必要です。</p>}
    {access.kind === 'authorized' && data && <div className="space-y-4">
      <p className="text-sm text-[var(--color-text-secondary)]">現在のロール: <span className="font-semibold">{access.role}</span></p>
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3"><AdminMetric label="FAQ" value={data.faqs} /><AdminMetric label="お知らせ" value={data.announcements} /><AdminMetric label="アップデート履歴" value={data.updateHistories} /><AdminMetric label="監査ログ" value={access.role === 'admin' ? data.auditLogs ?? 0 : 'adminのみ閲覧可能'} /></ul>
      <div className="flex gap-2">{(Object.keys(CONTENT_META) as AdminContentKind[]).map((k) => <button key={k} type="button" onClick={() => { setKind(k); setEditingId(null); setForm(EMPTY_FORM); }} className={`rounded-md border px-3 py-1 text-sm ${kind === k ? 'border-cyan-400' : 'border-[var(--color-border)]'}`}>{CONTENT_META[k].label}</button>)}</div>
      <p className="text-xs text-[var(--color-text-muted)]">{CONTENT_META[kind].description}</p>
      {error && <p className="text-sm text-red-300">{error}</p>}
      {canEdit ? <div className="space-y-2 rounded-lg border border-[var(--color-border)] p-3">
        <input className="w-full rounded border bg-transparent p-2" placeholder="タイトル（必須、100文字以内）" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
        <textarea className="w-full rounded border bg-transparent p-2" placeholder="本文（必須、2000文字以内）" rows={4} value={form.body} onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))} />
        <div className="grid gap-2 md:grid-cols-3"><input className="rounded border bg-transparent p-2" type="number" min={0} max={9999} value={form.displayOrder} onChange={(e) => setForm((s) => ({ ...s, displayOrder: e.target.value }))} /><input className="rounded border bg-transparent p-2" type="datetime-local" value={form.publishedAt} onChange={(e) => setForm((s) => ({ ...s, publishedAt: e.target.value }))} /><label className="flex items-center gap-2"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((s) => ({ ...s, isPublished: e.target.checked }))} />公開</label></div>
        {validationError && <p className="text-xs text-amber-300">{validationError}</p>}
        <div className="flex gap-2"><button type="button" disabled={Boolean(validationError)} onClick={() => void onSubmit()} className="rounded border px-3 py-1">{editingId ? '更新' : '作成'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }} className="rounded border px-3 py-1">キャンセル</button>}</div>
      </div> : <p className="text-sm text-[var(--color-text-secondary)]">viewer ロールは閲覧のみ可能です。</p>}
      <ul className="space-y-2">{loadingItems ? <li className="text-sm">読み込み中...</li> : items.map((item) => <li key={item.id} className="rounded-lg border p-3"><div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{item.title}</p><p className="text-xs">表示順: {item.displayOrder} / {item.isPublished ? '公開' : '非公開'}</p><p className="mt-1 whitespace-pre-wrap text-sm">{item.body}</p></div>{canEdit && <div className="flex gap-1"><button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => { setEditingId(item.id); setForm({ title: item.title, body: item.body, displayOrder: String(item.displayOrder), publishedAt: item.publishedAt ? item.publishedAt.slice(0, 16) : '', isPublished: item.isPublished }); }}>編集</button><button type="button" className="rounded border px-2 py-1 text-xs" onClick={async () => { if (!auth.user) return; try { await deleteAdminContent(auth.user, kind, item.id); await reloadList(); } catch { setError('削除に失敗しました。'); } }}>削除</button></div>}</div></li>)}</ul>
    </div>}
  </NeonPanel></section>);
}
