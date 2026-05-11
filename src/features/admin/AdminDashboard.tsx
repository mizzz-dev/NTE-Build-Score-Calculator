'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useAuthState } from '@/features/auth/AuthProvider';
import { isSupabaseAuthEnabled } from '@/lib/supabase/config';
import {
  createAdminContent,
  createAdminMasterItem,
  deleteAdminContent,
  deleteAdminMasterItem,
  fetchAdminAccessAndDashboard,
  fetchAdminContentList,
  fetchAdminMasterList,
  updateAdminContent,
  updateAdminMasterItem,
} from './api';
import type {
  AdminAccessState,
  AdminContentItem,
  AdminContentKind,
  AdminDashboardData,
  AdminMasterItem,
  AdminMasterKind,
  AdminStatKind,
} from './types';

const CONTENT_META: Record<AdminContentKind, { label: string; description: string }> = {
  faqs: { label: 'FAQ', description: 'よくある質問の管理' },
  announcements: { label: 'お知らせ', description: '運営告知の管理' },
  updateHistories: { label: 'アップデート履歴', description: '更新履歴の管理' },
};

const MASTER_META: Record<AdminMasterKind, { label: string; description: string }> = {
  characters: { label: 'キャラクター', description: 'キャラクター基本マスタの管理' },
  roles: { label: 'ロール', description: 'ロール基本マスタの管理' },
  statuses: { label: 'ステータス', description: 'ステータス基本マスタの管理' },
};

type ContentFormState = {
  title: string;
  body: string;
  displayOrder: string;
  publishedAt: string;
  isPublished: boolean;
};

const EMPTY_CONTENT_FORM: ContentFormState = {
  title: '',
  body: '',
  displayOrder: '0',
  publishedAt: '',
  isPublished: false,
};

type MasterFormState = {
  key: string;
  displayName: string;
  sortOrder: string;
  isActive: boolean;
  unit: string;
  statKind: AdminStatKind;
};

const EMPTY_MASTER_FORM: MasterFormState = {
  key: '',
  displayName: '',
  sortOrder: '0',
  isActive: true,
  unit: '',
  statKind: 'fixed',
};

function AdminMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <li className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </li>
  );
}

function toContentForm(item: AdminContentItem): ContentFormState {
  return {
    title: item.title,
    body: item.body,
    displayOrder: String(item.displayOrder),
    publishedAt: item.publishedAt ? item.publishedAt.slice(0, 16) : '',
    isPublished: item.isPublished,
  };
}

function toMasterForm(item: AdminMasterItem): MasterFormState {
  return {
    key: item.key,
    displayName: item.displayName,
    sortOrder: String(item.sortOrder),
    isActive: item.isActive,
    unit: item.unit ?? '',
    statKind: item.statKind ?? 'fixed',
  };
}

export function AdminDashboard() {
  const auth = useAuthState();
  const [access, setAccess] = useState<AdminAccessState>({ kind: 'signed_out' });
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [contentKind, setContentKind] = useState<AdminContentKind>('faqs');
  const [contentItems, setContentItems] = useState<AdminContentItem[]>([]);
  const [masterKind, setMasterKind] = useState<AdminMasterKind>('characters');
  const [masterItems, setMasterItems] = useState<AdminMasterItem[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingMasters, setLoadingMasters] = useState(false);
  const [contentEditingId, setContentEditingId] = useState<string | null>(null);
  const [masterEditingId, setMasterEditingId] = useState<string | null>(null);
  const [contentForm, setContentForm] = useState<ContentFormState>(EMPTY_CONTENT_FORM);
  const [masterForm, setMasterForm] = useState<MasterFormState>(EMPTY_MASTER_FORM);
  const [error, setError] = useState<string | null>(null);

  const canEdit = access.kind === 'authorized' && (access.role === 'admin' || access.role === 'editor');

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      async function load() {
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
          setData(null);
          return;
        }

        setAccess({ kind: 'authorized', role: result.role });
        setData(result.data);
      }

      void load();
    });

    return () => {
      active = false;
    };
  }, [auth.status, auth.user]);

  const reloadContent = useCallback(async () => {
    if (auth.status !== 'signed_in' || !auth.user || access.kind !== 'authorized') return;

    setLoadingContent(true);
    setError(null);
    try {
      setContentItems(await fetchAdminContentList(auth.user, contentKind));
    } catch {
      setError('コンテンツ一覧取得に失敗しました。');
    } finally {
      setLoadingContent(false);
    }
  }, [access.kind, auth.status, auth.user, contentKind]);

  const reloadMasters = useCallback(async () => {
    if (auth.status !== 'signed_in' || !auth.user || access.kind !== 'authorized') return;

    setLoadingMasters(true);
    setError(null);
    try {
      setMasterItems(await fetchAdminMasterList(auth.user, masterKind));
    } catch {
      setError('マスタ一覧取得に失敗しました。');
    } finally {
      setLoadingMasters(false);
    }
  }, [access.kind, auth.status, auth.user, masterKind]);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (active) void reloadContent();
    });

    return () => {
      active = false;
    };
  }, [reloadContent]);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (active) void reloadMasters();
    });

    return () => {
      active = false;
    };
  }, [reloadMasters]);

  const contentValidationError = useMemo(() => {
    if (!contentForm.title.trim()) return 'タイトルは必須です。';
    if (contentForm.title.length > 100) return 'タイトルは100文字以内で入力してください。';
    if (!contentForm.body.trim()) return '本文は必須です。';
    if (contentForm.body.length > 2000) return '本文は2000文字以内で入力してください。';

    const displayOrder = Number(contentForm.displayOrder);
    if (!Number.isInteger(displayOrder) || displayOrder < 0 || displayOrder > 9999) {
      return '表示順は0〜9999の整数で入力してください。';
    }

    return null;
  }, [contentForm]);

  const masterValidationError = useMemo(() => {
    if (!masterForm.key.trim()) return 'ID/キーは必須です。';
    if (!/^[a-z0-9_-]+$/.test(masterForm.key)) return 'ID/キーは英小文字・数字・アンダースコア・ハイフンのみ使用できます。';
    if (masterForm.key.length > 50) return 'ID/キーは50文字以内で入力してください。';
    if (!masterForm.displayName.trim()) return '表示名は必須です。';
    if (masterForm.displayName.length > 100) return '表示名は100文字以内で入力してください。';

    const sortOrder = Number(masterForm.sortOrder);
    if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 9999) {
      return '表示順は0〜9999の整数で入力してください。';
    }

    if (masterKind === 'statuses') {
      if (masterForm.unit.length > 20) return '単位は20文字以内で入力してください。';
      if (masterForm.unit && !/^[%A-Za-z\-_/ぁ-んァ-ヶー一-龠0-9]+$/.test(masterForm.unit)) return '単位の形式が不正です。';
    }

    return null;
  }, [masterForm, masterKind]);

  const resetContentForm = () => {
    setContentEditingId(null);
    setContentForm(EMPTY_CONTENT_FORM);
  };

  const resetMasterForm = () => {
    setMasterEditingId(null);
    setMasterForm(EMPTY_MASTER_FORM);
  };

  const handleContentSubmit = async () => {
    if (!canEdit || !auth.user || contentValidationError) return;

    const payload = {
      title: contentForm.title.trim(),
      body: contentForm.body.trim(),
      displayOrder: Number(contentForm.displayOrder),
      publishedAt: contentForm.publishedAt || null,
      isPublished: contentForm.isPublished,
    };

    try {
      if (contentEditingId) await updateAdminContent(auth.user, contentKind, { id: contentEditingId, ...payload });
      else await createAdminContent(auth.user, contentKind, payload);
      resetContentForm();
      await reloadContent();
    } catch {
      setError(contentEditingId ? 'コンテンツ更新に失敗しました。' : 'コンテンツ作成に失敗しました。');
    }
  };

  const handleMasterSubmit = async () => {
    if (!canEdit || !auth.user || masterValidationError) return;

    const payload = {
      key: masterForm.key.trim(),
      displayName: masterForm.displayName.trim(),
      sortOrder: Number(masterForm.sortOrder),
      isActive: masterForm.isActive,
      unit: masterKind === 'statuses' ? masterForm.unit.trim() || null : null,
      statKind: masterKind === 'statuses' ? masterForm.statKind : null,
    };

    try {
      if (masterEditingId) await updateAdminMasterItem(auth.user, masterKind, { id: masterEditingId, ...payload });
      else await createAdminMasterItem(auth.user, masterKind, payload);
      resetMasterForm();
      await reloadMasters();
    } catch {
      setError(masterEditingId ? 'マスタ更新に失敗しました。' : 'マスタ作成に失敗しました。');
    }
  };

  const handleContentDelete = async (id: string) => {
    if (!canEdit || !auth.user) return;
    if (!window.confirm('削除しますか？')) return;

    try {
      await deleteAdminContent(auth.user, contentKind, id);
      await reloadContent();
    } catch {
      setError('コンテンツ削除に失敗しました。');
    }
  };

  const handleMasterDelete = async (id: string) => {
    if (!canEdit || !auth.user) return;
    if (!window.confirm('削除しますか？')) return;

    try {
      await deleteAdminMasterItem(auth.user, masterKind, id);
      await reloadMasters();
    } catch {
      setError('マスタ削除に失敗しました。');
    }
  };

  return (
    <section className="space-y-6">
      <SectionHeader title="管理ダッシュボード" subtitle="Issue #45: 基本マスタ管理UIの追加" />
      <NeonPanel className="space-y-4">
        {access.kind === 'disabled' && <p className="text-sm text-[var(--color-text-secondary)]">Supabase未設定のため、管理画面機能は無効です。</p>}
        {access.kind === 'signed_out' && auth.status !== 'loading' && <p className="text-sm text-[var(--color-text-secondary)]">管理画面を表示するにはログインしてください。</p>}
        {access.kind === 'forbidden' && <p className="text-sm text-[var(--color-text-secondary)]">権限不足: admin / editor / viewer のロールが必要です。</p>}

        {access.kind === 'authorized' && data && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              現在のロール: <span className="font-semibold">{access.role}</span>
            </p>
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

            {error && <p className="text-sm text-red-300">{error}</p>}

            <NeonPanel className="space-y-3">
              <p className="text-sm font-semibold">コンテンツ管理</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CONTENT_META) as AdminContentKind[]).map((item) => (
                  <button key={item} type="button" onClick={() => { setContentKind(item); resetContentForm(); }} className={`rounded-md border px-3 py-1 text-sm ${contentKind === item ? 'border-cyan-400' : 'border-[var(--color-border)]'}`}>
                    {CONTENT_META[item].label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">{CONTENT_META[contentKind].description}</p>
              {canEdit ? (
                <div className="space-y-2 rounded-lg border border-[var(--color-border)] p-3">
                  <input className="w-full rounded border bg-transparent p-2" placeholder="タイトル（必須、100文字以内）" value={contentForm.title} onChange={(event) => setContentForm((state) => ({ ...state, title: event.target.value }))} />
                  <textarea className="w-full rounded border bg-transparent p-2" placeholder="本文（必須、2000文字以内）" rows={4} value={contentForm.body} onChange={(event) => setContentForm((state) => ({ ...state, body: event.target.value }))} />
                  <div className="grid gap-2 md:grid-cols-3">
                    <input className="rounded border bg-transparent p-2" type="number" min={0} max={9999} value={contentForm.displayOrder} onChange={(event) => setContentForm((state) => ({ ...state, displayOrder: event.target.value }))} />
                    <input className="rounded border bg-transparent p-2" type="datetime-local" value={contentForm.publishedAt} onChange={(event) => setContentForm((state) => ({ ...state, publishedAt: event.target.value }))} />
                    <label className="flex items-center gap-2"><input type="checkbox" checked={contentForm.isPublished} onChange={(event) => setContentForm((state) => ({ ...state, isPublished: event.target.checked }))} />公開</label>
                  </div>
                  {contentValidationError && <p className="text-xs text-amber-300">{contentValidationError}</p>}
                  <div className="flex gap-2">
                    <button type="button" disabled={Boolean(contentValidationError)} onClick={() => void handleContentSubmit()} className="rounded border px-3 py-1">{contentEditingId ? '更新' : '作成'}</button>
                    {contentEditingId && <button type="button" onClick={resetContentForm} className="rounded border px-3 py-1">キャンセル</button>}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">viewer ロールは閲覧のみ可能です。</p>
              )}
              <ul className="space-y-2">
                {loadingContent && <li className="text-sm">読み込み中...</li>}
                {!loadingContent && contentItems.map((item) => (
                  <li key={item.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs">表示順: {item.displayOrder} / {item.isPublished ? '公開' : '非公開'}</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm">{item.body}</p>
                      </div>
                      {canEdit && (
                        <div className="flex gap-1">
                          <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => { setContentEditingId(item.id); setContentForm(toContentForm(item)); }}>編集</button>
                          <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => void handleContentDelete(item.id)}>削除</button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </NeonPanel>

            <NeonPanel className="space-y-3">
              <p className="text-sm font-semibold">基本マスタ管理</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(MASTER_META) as AdminMasterKind[]).map((item) => (
                  <button key={item} type="button" onClick={() => { setMasterKind(item); resetMasterForm(); }} className={`rounded-md border px-3 py-1 text-sm ${masterKind === item ? 'border-cyan-400' : 'border-[var(--color-border)]'}`}>
                    {MASTER_META[item].label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">{MASTER_META[masterKind].description}</p>
              {canEdit ? (
                <div className="space-y-2 rounded-lg border border-[var(--color-border)] p-3">
                  <input className="w-full rounded border bg-transparent p-2" placeholder="ID/キー（英小文字・数字・_・-、必須）" value={masterForm.key} onChange={(event) => setMasterForm((state) => ({ ...state, key: event.target.value }))} disabled={Boolean(masterEditingId)} />
                  <input className="w-full rounded border bg-transparent p-2" placeholder="表示名（必須、100文字以内）" value={masterForm.displayName} onChange={(event) => setMasterForm((state) => ({ ...state, displayName: event.target.value }))} />
                  <div className="grid gap-2 md:grid-cols-3">
                    <input className="rounded border bg-transparent p-2" type="number" min={0} max={9999} value={masterForm.sortOrder} onChange={(event) => setMasterForm((state) => ({ ...state, sortOrder: event.target.value }))} />
                    <label className="flex items-center gap-2"><input type="checkbox" checked={masterForm.isActive} onChange={(event) => setMasterForm((state) => ({ ...state, isActive: event.target.checked }))} />有効</label>
                    {masterKind === 'statuses' && <select className="rounded border bg-transparent p-2" value={masterForm.statKind} onChange={(event) => setMasterForm((state) => ({ ...state, statKind: event.target.value as AdminStatKind }))}><option value="fixed">固定値</option><option value="percent">割合</option></select>}
                  </div>
                  {masterKind === 'statuses' && <input className="w-full rounded border bg-transparent p-2" placeholder="単位（任意、20文字以内。例: %, pt）" value={masterForm.unit} onChange={(event) => setMasterForm((state) => ({ ...state, unit: event.target.value }))} />}
                  {masterValidationError && <p className="text-xs text-amber-300">{masterValidationError}</p>}
                  <div className="flex gap-2">
                    <button type="button" disabled={Boolean(masterValidationError)} onClick={() => void handleMasterSubmit()} className="rounded border px-3 py-1">{masterEditingId ? '更新' : '作成'}</button>
                    {masterEditingId && <button type="button" onClick={resetMasterForm} className="rounded border px-3 py-1">キャンセル</button>}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">viewer ロールは閲覧のみ可能です。</p>
              )}
              <ul className="space-y-2">
                {loadingMasters && <li className="text-sm">読み込み中...</li>}
                {!loadingMasters && masterItems.map((item) => (
                  <li key={item.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{item.displayName}</p>
                        <p className="text-xs">ID: {item.key} / 表示順: {item.sortOrder} / {item.isActive ? '有効' : '無効'}{masterKind === 'statuses' ? ` / ${item.statKind === 'percent' ? '割合' : '固定値'}${item.unit ? ` / 単位: ${item.unit}` : ''}` : ''}</p>
                      </div>
                      {canEdit && (
                        <div className="flex gap-1">
                          <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => { setMasterEditingId(item.id); setMasterForm(toMasterForm(item)); }}>編集</button>
                          <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => void handleMasterDelete(item.id)}>削除</button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </NeonPanel>
          </div>
        )}
      </NeonPanel>
    </section>
  );
}
