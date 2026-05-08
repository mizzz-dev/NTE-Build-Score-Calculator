'use client';

import { useMemo, useRef, useState } from 'react';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { calculateBuildScore } from '@/lib/score';
import { sampleScoreConfig } from '@/lib/score/sampleConfig';
import type { SlotType, StatKey } from '@/lib/score/types';
import { exportElementToPng } from '../lib/cardImage';

const SLOT_LABELS: Record<SlotType, string> = { cartridge: 'カートリッジ', module: 'モジュール', gear: 'ギア', console: 'コンソール' };
const ROLE_OPTIONS = [{ id: 'dps', label: 'DPS' }, { id: 'support', label: 'サポート' }];
const STAT_KEYS = Object.keys(sampleScoreConfig.statRanges) as StatKey[];

export function CardPageContainer() {
  const [characterName, setCharacterName] = useState('');
  const [roleId, setRoleId] = useState('dps');
  const [slot, setSlot] = useState<SlotType>('cartridge');
  const [mainStatKey, setMainStatKey] = useState<StatKey>(STAT_KEYS[0]);
  const [mainStatValue, setMainStatValue] = useState('');
  const [subStats, setSubStats] = useState(Array.from({ length: 3 }, () => ({ key: STAT_KEYS[0], value: '' })));
  const [comment, setComment] = useState('');
  const [saveState, setSaveState] = useState<'idle'|'saving'|'success'|'error'>('idle');
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
        {saveState === 'success' && <p className="text-xs text-[var(--color-accent)]">PNG保存を開始しました。</p>}
        {saveState === 'error' && <p className="text-xs text-[var(--color-danger)]">PNG保存に失敗しました。</p>}
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
