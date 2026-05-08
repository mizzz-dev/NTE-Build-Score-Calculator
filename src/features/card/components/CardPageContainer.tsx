'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { calculateBuildScore } from '@/lib/score';
import { sampleScoreConfig } from '@/lib/score/sampleConfig';
import type { SlotType, StatKey } from '@/lib/score/types';
import { deleteGuestHistory, listGuestHistory, saveGuestHistory } from '@/features/history/storage';
import { canUseCloudStorage, deleteCloudHistory, listCloudHistory, saveCloudHistory, type CloudHistoryEntry } from '@/features/history/cloudStorage';
import { useAuthState } from '@/features/auth/AuthProvider';
import type { GuestHistoryEntry } from '@/features/history/types';
import { exportElementToPng } from '../lib/cardImage';

const SLOT_LABELS: Record<SlotType, string> = { cartridge: 'カートリッジ', module: 'モジュール', gear: 'ギア', console: 'コンソール' };
const ROLE_OPTIONS = [{ id: 'dps', label: 'DPS' }, { id: 'support', label: 'サポート' }];
const STAT_KEYS = Object.keys(sampleScoreConfig.statRanges) as StatKey[];

function listCardHistory(): GuestHistoryEntry[] {
  return listGuestHistory().filter((entry) => entry.kind === 'card');
}

export function CardPageContainer() {
  const [characterName, setCharacterName] = useState('');
  const [roleId, setRoleId] = useState('dps');
  const [slot, setSlot] = useState<SlotType>('cartridge');
  const [mainStatKey, setMainStatKey] = useState<StatKey>(STAT_KEYS[0]);
  const [mainStatValue, setMainStatValue] = useState('');
  const [subStats, setSubStats] = useState(Array.from({ length: 3 }, () => ({ key: STAT_KEYS[0], value: '' })));
  const [comment, setComment] = useState('');
  const [saveState, setSaveState] = useState<'idle'|'saving'|'success'|'error'>('idle');
  const [history, setHistory] = useState<GuestHistoryEntry[]>(() => listCardHistory());
  const [historySaveStatus, setHistorySaveStatus] = useState<'idle'|'success'>('idle');
  const [cloudHistory, setCloudHistory] = useState<CloudHistoryEntry[]>([]);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [cloudSaveStatus, setCloudSaveStatus] = useState<'idle'|'saving'|'success'|'error'>('idle');
  const auth = useAuthState();
  const cloudEnabled = canUseCloudStorage(auth.user);
  const previewRef = useRef<HTMLDivElement>(null);

  const errors = useMemo(() => {
    const next: string[] = [];
    if (mainStatValue.trim().length === 0) next.push('メインステータス値は必須です。');
    if (Number(mainStatValue) < 0) next.push('メインステータス値は0以上で入力してください。');
    subStats.forEach((sub, index) => {
      if (sub.value.trim().length > 0 && Number(sub.value) < 0) next.push(`サブステータス${index + 1}は0以上で入力してください。`);
    });
    return next;
  }, [mainStatValue, subStats]);

  const result = useMemo(() => {
    if (errors.length > 0 || Number.isNaN(Number(mainStatValue))) return null;
    return calculateBuildScore({
      roleId,
      equipmentsBySlot: {
        [slot]: {
          slot,
          mainStatKey,
          mainStatValue: Number(mainStatValue),
          subStats: subStats.filter((s) => s.value.trim().length > 0).map((s) => ({ key: s.key, value: Number(s.value) })).filter((s) => !Number.isNaN(s.value)),
        },
      },
    }, sampleScoreConfig);
  }, [errors.length, mainStatKey, mainStatValue, roleId, slot, subStats]);

  const createdAt = useMemo(() => new Date().toLocaleString('ja-JP'), []);

  const handleSave = async () => {
    if (!previewRef.current) return;
    setSaveState('saving');
    try {
      await exportElementToPng(previewRef.current, `build-card-${Date.now()}.png`);
      setSaveState('success');
    } catch {
      setSaveState('error');
    }
  };

  const handleSaveHistory = () => {
    if (!result) return;
    const mainValue = Number(mainStatValue);
    if (Number.isNaN(mainValue)) return;
    const parsedSubStats = subStats.filter((s) => s.value.trim().length > 0).map((s) => ({ key: s.key, value: Number(s.value) })).filter((s) => !Number.isNaN(s.value));
    const next = saveGuestHistory({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind: 'card',
      createdAt: new Date().toISOString(),
      payload: {
        roleId,
        slot,
        mainStatKey,
        mainStatValue: mainValue,
        subStats: parsedSubStats,
        score: result.buildScoreNormalized,
        rank: result.rank,
      },
    });
    setHistory(next.filter((entry) => entry.kind === 'card'));
    setHistorySaveStatus('success');
  };

  const handleSaveCloud = async () => {
    if (!result || !auth.user || !cloudEnabled) return;
    try {
      setCloudSaveStatus('saving');
      setCloudError(null);
      const mainValue = Number(mainStatValue);
      const parsedSubStats = subStats.filter((s) => s.value.trim().length > 0).map((s) => ({ key: s.key, value: Number(s.value) })).filter((s) => !Number.isNaN(s.value));
      await saveCloudHistory(auth.user, { kind: 'card', payload: { roleId, slot, mainStatKey, mainStatValue: mainValue, subStats: parsedSubStats, score: result.buildScoreNormalized, rank: result.rank } });
      setCloudHistory(await listCloudHistory(auth.user));
      setCloudSaveStatus('success');
    } catch (e) {
      setCloudSaveStatus('error');
      setCloudError(e instanceof Error ? e.message : 'クラウド保存に失敗しました。');
    }
  };

  const handleDeleteCloud = async (id: string) => {
    if (!auth.user || !cloudEnabled) return;
    try {
      await deleteCloudHistory(auth.user, id);
      setCloudHistory((prev) => prev.filter((entry) => entry.id !== id));
    } catch (e) {
      setCloudError(e instanceof Error ? e.message : '削除に失敗しました。');
    }
  };

  const handleDeleteHistory = (id: string) => {
    const next = deleteGuestHistory(id);
    setHistory(next.filter((entry) => entry.kind === 'card'));
  };

  useEffect(() => {
    if (auth.status !== 'signed_in' || !cloudEnabled || !auth.user) return;
    listCloudHistory(auth.user).then(setCloudHistory).catch((e: Error) => setCloudError(e.message));
  }, [auth.status, auth.user, cloudEnabled]);

  return <div className="space-y-6">
    <SectionHeader title="ビルドカード生成" subtitle="入力した装備情報からスコア付きカードを作成し、PNG保存できます。" />
    <div className="grid gap-4 xl:grid-cols-2">
      <NeonPanel className="space-y-3">
        <h2 className="text-lg font-semibold">入力フォーム</h2>
        <label className="block text-sm">キャラ名<input className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={characterName} onChange={(e) => setCharacterName(e.target.value)} placeholder="任意入力" /></label>
        <label className="block text-sm">ロール<select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={roleId} onChange={(e) => setRoleId(e.target.value)}>{ROLE_OPTIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
        <label className="block text-sm">装備タイプ<select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={slot} onChange={(e) => setSlot(e.target.value as SlotType)}>{Object.entries(SLOT_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <div className="grid gap-2 sm:grid-cols-2"><label className="block text-sm">メインステータス<select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={mainStatKey} onChange={(e) => setMainStatKey(e.target.value as StatKey)}>{STAT_KEYS.map((key) => <option key={key} value={key}>{key}</option>)}</select></label><label className="block text-sm">メイン値<input type="number" min={0} className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={mainStatValue} onChange={(e) => setMainStatValue(e.target.value)} /></label></div>
        <div className="space-y-2"><p className="text-sm font-medium">サブステータス</p>{subStats.map((sub, i) => <div className="grid gap-2 sm:grid-cols-2" key={i}><select className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-sm" value={sub.key} onChange={(e) => setSubStats((prev) => prev.map((item, idx) => idx === i ? { ...item, key: e.target.value as StatKey } : item))}>{STAT_KEYS.map((key) => <option key={key} value={key}>{key}</option>)}</select><input type="number" min={0} className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-sm" value={sub.value} onChange={(e) => setSubStats((prev) => prev.map((item, idx) => idx === i ? { ...item, value: e.target.value } : item))} placeholder="未入力可" /></div>)}</div>
        <label className="block text-sm">コメント<textarea className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="自由入力" /></label>
        {errors.length > 0 && <ul className="list-disc pl-5 text-sm text-[var(--color-danger)]">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
        <button type="button" className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent)] disabled:opacity-50" onClick={handleSave} disabled={!result || saveState === 'saving'}>PNGで保存</button>
        <button type="button" className="ml-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent)] disabled:opacity-50" onClick={handleSaveHistory} disabled={!result}>入力結果を履歴保存</button>
        {saveState === 'success' && <p className="text-xs text-[var(--color-accent)]">PNG保存を開始しました。</p>}
        {saveState === 'error' && <p className="text-xs text-[var(--color-danger)]">PNG保存に失敗しました。</p>}
        {historySaveStatus === 'success' && <p className="text-xs text-[var(--color-accent)]">履歴に保存しました（最大20件）。</p>}
        <button type="button" className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent)] disabled:opacity-50" onClick={handleSaveCloud} disabled={!result || !cloudEnabled || auth.status !== 'signed_in' || cloudSaveStatus === 'saving'}>クラウド保存</button>
        {auth.status !== 'signed_in' && <p className="text-xs text-[var(--color-text-secondary)]">クラウド保存するにはログインしてください。</p>}
        {!cloudEnabled && auth.status === 'signed_in' && <p className="text-xs text-[var(--color-text-secondary)]">Supabase未設定またはセッション期限切れのためクラウド保存を利用できません。</p>}
        {cloudSaveStatus === 'success' && <p className="text-xs text-[var(--color-accent)]">クラウドに保存しました。</p>}
        {cloudError && <p className="text-xs text-[var(--color-danger)]">{cloudError}</p>}
        <div>
          <p className="mb-1 text-sm font-medium">クラウド保存済み</p>
          {cloudHistory.length === 0 ? <p className="text-xs text-[var(--color-text-secondary)]">クラウド保存データはありません。</p> : (
            <ul className="space-y-2">
              {cloudHistory.map((entry) => <li key={entry.id} className="rounded-md border border-[var(--color-border)] p-2 text-xs"><p>{new Date(entry.createdAt).toLocaleString('ja-JP')} / {SLOT_LABELS[entry.payload.slot]} / {entry.payload.mainStatKey}:{entry.payload.mainStatValue}</p><p>スコア: {entry.payload.score.toFixed(2)} / ランク: {entry.payload.rank}</p><button type="button" className="mt-1 underline" onClick={() => handleDeleteCloud(entry.id)}>削除</button></li>)}
            </ul>
          )}
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">保存済み履歴</p>
          {history.length === 0 ? <p className="text-xs text-[var(--color-text-secondary)]">履歴はありません。</p> : (
            <ul className="space-y-2">
              {history.map((entry) => <li key={entry.id} className="rounded-md border border-[var(--color-border)] p-2 text-xs"><p>{new Date(entry.createdAt).toLocaleString('ja-JP')} / {SLOT_LABELS[entry.payload.slot]} / {entry.payload.mainStatKey}:{entry.payload.mainStatValue}</p><p>スコア: {entry.payload.score.toFixed(2)} / ランク: {entry.payload.rank}</p><button type="button" className="mt-1 underline" onClick={() => handleDeleteHistory(entry.id)}>削除</button></li>)}
            </ul>
          )}
        </div>
      </NeonPanel>

      <NeonPanel className="overflow-hidden">
        <h2 className="mb-3 text-lg font-semibold">カードプレビュー</h2>
        <div className="mx-auto w-full max-w-xl rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-sm" ref={previewRef}>
          <p className="text-xs text-[var(--color-text-secondary)]">※ 非公式ファンツール（公式素材は未使用）</p>
          <p className="mt-2 text-xl font-bold">装備ビルドカード</p>
          <div className="mt-3 grid gap-1 sm:grid-cols-2">
            <p>キャラ名: {characterName || '未入力'}</p><p>ロール: {ROLE_OPTIONS.find((r) => r.id === roleId)?.label ?? roleId}</p>
            <p>装備タイプ: {SLOT_LABELS[slot]}</p><p>メイン: {mainStatKey} / {mainStatValue || '--'}</p>
            {subStats.map((sub, i) => <p key={i}>サブ{i + 1}: {sub.key} / {sub.value || '--'}</p>)}
            <p>スコア: {result ? result.buildScoreNormalized.toFixed(2) : '--'}</p><p>ランク: {result?.rank ?? '--'}</p>
          </div>
          <div className="mt-3 rounded-md border border-[var(--color-border)] p-2"><p className="text-xs text-[var(--color-text-secondary)]">コメント</p><p className="whitespace-pre-wrap">{comment || '（なし）'}</p></div>
          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">作成日時: {createdAt}</p>
        </div>
      </NeonPanel>
    </div>
  </div>;
}
