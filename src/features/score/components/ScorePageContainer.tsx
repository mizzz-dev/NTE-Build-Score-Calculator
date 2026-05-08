'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { calculateBuildScore } from '@/lib/score';
import { sampleScoreConfig } from '@/lib/score/sampleConfig';
import type { SlotType, StatKey } from '@/lib/score/types';
import { fromShareQuery, SHARE_SUB_STAT_COUNT, toShareQuery } from '../share/mapper';
import type { ScoreShareState } from '../share/types';

const SLOT_LABELS: Record<SlotType, string> = {
  cartridge: 'カートリッジ',
  module: 'モジュール',
  gear: 'ギア',
  console: 'コンソール',
};

const ROLE_OPTIONS = [
  { id: 'dps', label: 'DPS' },
  { id: 'support', label: 'サポート' },
];

const CHARACTER_OPTIONS = [
  { id: 'default', label: '共通' },
  { id: 'alice', label: 'Alice（要確認）' },
  { id: 'bob', label: 'Bob（要確認）' },
];

const STAT_KEYS = Object.keys(sampleScoreConfig.statRanges) as StatKey[];
const DEFAULT_SHARE_STATE: ScoreShareState = {
  roleId: 'dps',
  characterId: '',
  slot: 'cartridge',
  mainStatKey: STAT_KEYS[0],
  mainStatValue: '',
  subStats: Array.from({ length: SHARE_SUB_STAT_COUNT }, () => ({ key: STAT_KEYS[0], value: '' })),
};

export function ScorePageContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [roleId, setRoleId] = useState<string>(DEFAULT_SHARE_STATE.roleId);
  const [characterId, setCharacterId] = useState<string>(DEFAULT_SHARE_STATE.characterId);
  const [slot, setSlot] = useState<SlotType>(DEFAULT_SHARE_STATE.slot);
  const [mainStatKey, setMainStatKey] = useState<StatKey>(DEFAULT_SHARE_STATE.mainStatKey);
  const [mainStatValue, setMainStatValue] = useState<string>(DEFAULT_SHARE_STATE.mainStatValue);
  const [subStats, setSubStats] = useState<Array<{ key: StatKey; value: string }>>(DEFAULT_SHARE_STATE.subStats);
  const [isHydratedFromUrl, setIsHydratedFromUrl] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const shareState = useMemo<ScoreShareState>(() => ({ roleId, characterId, slot, mainStatKey, mainStatValue, subStats }), [roleId, characterId, slot, mainStatKey, mainStatValue, subStats]);

  useEffect(() => {
    const parsed = fromShareQuery(searchParams, DEFAULT_SHARE_STATE);
    setRoleId(parsed.roleId);
    setCharacterId(parsed.characterId);
    setSlot(parsed.slot);
    setMainStatKey(parsed.mainStatKey);
    setMainStatValue(parsed.mainStatValue);
    setSubStats(parsed.subStats);
    setIsHydratedFromUrl(true);
  }, [searchParams]);

  useEffect(() => {
    if (!isHydratedFromUrl) return;
    const nextQuery = toShareQuery(shareState).toString();
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [isHydratedFromUrl, pathname, router, searchParams, shareState]);

  const shareUrl = useMemo(() => {
    const query = toShareQuery(shareState).toString();
    if (typeof window === 'undefined') return `${pathname}?${query}`;
    return `${window.location.origin}${pathname}?${query}`;
  }, [pathname, shareState]);

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
  }, [shareUrl]);

  const errors = useMemo(() => {
    const next: string[] = [];
    if (mainStatValue.trim().length === 0) next.push('メインステータス値は必須です。');
    if (Number(mainStatValue) < 0) next.push('メインステータス値は0以上で入力してください。');
    subStats.forEach((sub, index) => {
      if (sub.value.trim().length === 0) return;
      if (Number(sub.value) < 0) next.push(`サブステータス${index + 1}は0以上で入力してください。`);
    });
    return next;
  }, [mainStatValue, subStats]);

  const result = useMemo(() => {
    if (errors.length > 0) return null;

    const mainValue = Number(mainStatValue);
    if (Number.isNaN(mainValue)) return null;

    const parsedSubStats = subStats
      .filter((sub) => sub.value.trim().length > 0)
      .map((sub) => ({ key: sub.key, value: Number(sub.value) }))
      .filter((sub) => !Number.isNaN(sub.value));

    return calculateBuildScore(
      {
        roleId,
        characterId: characterId || undefined,
        equipmentsBySlot: {
          [slot]: {
            slot,
            mainStatKey,
            mainStatValue: mainValue,
            subStats: parsedSubStats,
          },
        },
      },
      sampleScoreConfig,
    );
  }, [characterId, errors.length, mainStatKey, mainStatValue, roleId, slot, subStats]);

  return (
    <div className="space-y-6">
      <SectionHeader title="スコア計算" subtitle="手動入力した装備ステータスから、スコア・ランク・内訳を確認できます。" />
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <NeonPanel className="space-y-4">
          <h2 className="text-lg font-semibold">入力パネル</h2>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-xs space-y-2">
            <p>共有URL対象: ロール / キャラクター / 装備タイプ / メイン / サブ1〜3</p>
            <p>共有URL対象外: 計算結果表示状態（スコア・ランク・内訳・警告は復元後に再計算）</p>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={handleCopyUrl} className="rounded-md border border-[var(--color-border)] px-3 py-1 text-sm hover:border-[var(--color-accent)]">共有URLをコピー</button>
              <span className="text-xs text-[var(--color-text-secondary)] break-all">{shareUrl}</span>
            </div>
            {copyStatus === 'success' && <p className="text-xs text-[var(--color-accent)]">共有URLをコピーしました。</p>}
            {copyStatus === 'error' && <p className="text-xs text-[var(--color-danger)]">コピーに失敗しました。URLを手動でコピーしてください。</p>}
          </div>

          <label className="block text-sm">
            ロール
            <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
              {ROLE_OPTIONS.map((role) => (
                <option key={role.id} value={role.id}>{role.label}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            キャラクター
            <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={characterId} onChange={(e) => setCharacterId(e.target.value)}>
              {CHARACTER_OPTIONS.map((ch) => (
                <option key={ch.id} value={ch.id === 'default' ? '' : ch.id}>{ch.label}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            装備タイプ
            <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={slot} onChange={(e) => setSlot(e.target.value as SlotType)}>
              {Object.entries(SLOT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              メインステータス
              <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={mainStatKey} onChange={(e) => setMainStatKey(e.target.value)}>
                {STAT_KEYS.map((key) => <option key={key} value={key}>{key}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              メイン値
              <input className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" type="number" min={0} value={mainStatValue} onChange={(e) => setMainStatValue(e.target.value)} />
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">サブステータス</p>
            {subStats.map((sub, index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-2">
                <select className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-sm" value={sub.key} onChange={(e) => setSubStats((prev) => prev.map((item, i) => i === index ? { ...item, key: e.target.value } : item))}>
                  {STAT_KEYS.map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
                <input className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-sm" type="number" min={0} placeholder="未入力可" value={sub.value} onChange={(e) => setSubStats((prev) => prev.map((item, i) => i === index ? { ...item, value: e.target.value } : item))} />
              </div>
            ))}
          </div>

          {errors.length > 0 && <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--color-danger)]">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
        </NeonPanel>

        <NeonPanel className="space-y-3 lg:sticky lg:top-20">
          <h2 className="text-lg font-semibold">計算結果</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">スコア: <span className="text-xl font-bold text-[var(--color-accent)]">{result ? result.buildScoreNormalized.toFixed(2) : '--'}</span></p>
          <p className="text-sm">ランク: <span className="font-semibold">{result?.rank ?? '--'}</span></p>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-sm space-y-1">
            <p>内訳（{SLOT_LABELS[slot]}）</p>
            <p>メイン: {result ? result.equipmentScoresBySlot[slot].mainScore.toFixed(2) : '--'}</p>
            <p>サブ: {result ? result.equipmentScoresBySlot[slot].subScore.toFixed(2) : '--'}</p>
            <p>セット: {result ? result.equipmentScoresBySlot[slot].setBonusScore.toFixed(2) : '--'}</p>
            <p>効果: {result ? result.equipmentScoresBySlot[slot].equipmentEffectScore.toFixed(2) : '--'}</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">警告</p>
            {result && result.warnings.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-xs text-[var(--color-danger)]">
                {result.warnings.map((warning, index) => <li key={`${warning.code}-${index}`}>{warning.code}: {warning.message}</li>)}
              </ul>
            ) : (
              <p className="text-xs text-[var(--color-text-secondary)]">警告はありません。</p>
            )}
          </div>
        </NeonPanel>
      </div>
    </div>
  );
}
