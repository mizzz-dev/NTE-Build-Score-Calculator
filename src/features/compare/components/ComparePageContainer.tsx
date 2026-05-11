'use client';

import { useMemo, useState } from 'react';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { SlotType, StatKey } from '@/lib/score/types';
import { calculateCompareResult, type CompareBuildForm, validateCompareForm } from '../lib/compareCalculator';
import { usePublicMaster } from '@/features/public-master/usePublicMaster';
import { resolveScoreConfig } from '@/features/score/lib/scoreConfigResolver';

const SLOT_LABELS: Record<SlotType, string> = { cartridge: 'カートリッジ', module: 'モジュール', gear: 'ギア', console: 'コンソール' };
const DEFAULT_STAT_KEYS: StatKey[] = ['atk_percent', 'crit_rate', 'crit_dmg', 'hp_flat'];

const initialForm = (): CompareBuildForm => ({
  roleId: 'dps', characterId: '', slot: 'cartridge', mainStatKey: DEFAULT_STAT_KEYS[0], mainStatValue: '', subStats: Array.from({ length: 3 }, () => ({ key: DEFAULT_STAT_KEYS[0], value: '' })),
});

export function ComparePageContainer() {
  const [formA, setFormA] = useState<CompareBuildForm>(initialForm);
  const { loading: masterLoading, warning: masterWarning, viewModel } = usePublicMaster();
  const roleOptions = viewModel?.roleOptions ?? [];
  const characterOptions = viewModel?.characterOptions ?? [];
  const [formB, setFormB] = useState<CompareBuildForm>(initialForm);
  const scoreConfigState = useMemo(() => resolveScoreConfig(viewModel ? { data: viewModel.masterData, source: viewModel.source, warning: masterWarning } : null), [masterWarning, viewModel]);
  const statKeys = useMemo(() => Object.keys(scoreConfigState.config.statRanges) as StatKey[], [scoreConfigState.config]);

  const errorsA = useMemo(() => validateCompareForm(formA), [formA]);
  const errorsB = useMemo(() => validateCompareForm(formB), [formB]);
  const compareResult = useMemo(() => (errorsA.length === 0 && errorsB.length === 0 ? calculateCompareResult(formA, formB, scoreConfigState.config) : null), [errorsA.length, errorsB.length, formA, formB, scoreConfigState.config]);

  const superiority = !compareResult
    ? '--'
    : compareResult.scoreDiff > 0
      ? 'B が優位'
      : compareResult.scoreDiff < 0
        ? 'A が優位'
        : '同点';

  return (
    <div className="space-y-6">
      <SectionHeader title="ビルド比較" subtitle="比較元Aと比較先Bの装備入力から、スコア・ランク・内訳差分を確認できます。" />
      <div className="grid gap-4 lg:grid-cols-2">
        <BuildFormCard label="比較元 A" form={formA} onChange={setFormA} errors={errorsA} roleOptions={roleOptions} characterOptions={characterOptions} statKeys={statKeys} />
        <BuildFormCard label="比較先 B" form={formB} onChange={setFormB} errors={errorsB} roleOptions={roleOptions} characterOptions={characterOptions} statKeys={statKeys} />
      </div>

      {masterLoading && <p className="text-xs text-[var(--color-text-secondary)]">公開マスタを読み込み中です...</p>}
      {masterWarning && <p className="text-xs text-[var(--color-text-secondary)]">{masterWarning}</p>}
      {scoreConfigState.notice && <p className="text-xs text-[var(--color-text-secondary)]">{scoreConfigState.notice}</p>}
      <p className="text-xs text-[var(--color-text-secondary)]">設定ソース: {scoreConfigState.source === 'public-master' ? '公開マスタ' : '標準設定（フォールバック）'}</p>
      <NeonPanel className="space-y-4">
        <h2 className="text-lg font-semibold">比較結果</h2>
        <p className="text-sm">判定: <span className="font-bold text-[var(--color-accent)]">{superiority}</span></p>
        <div className="grid gap-3 md:grid-cols-2">
          <ResultCard title="A" score={compareResult?.resultA.buildScoreNormalized} rank={compareResult?.resultA.rank} breakdown={compareResult?.breakdownA} />
          <ResultCard title="B" score={compareResult?.resultB.buildScoreNormalized} rank={compareResult?.resultB.rank} breakdown={compareResult?.breakdownB} />
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-sm space-y-1">
          <p>差分（B - A）</p>
          <p>スコア差分: {compareResult ? formatSigned(compareResult.scoreDiff) : '--'}</p>
          <p>ランク差分: {compareResult?.rankDiffLabel ?? '--'}</p>
          <p>メイン差分: {compareResult ? formatSigned(compareResult.breakdownDiff.main) : '--'}</p>
          <p>サブ差分: {compareResult ? formatSigned(compareResult.breakdownDiff.sub) : '--'}</p>
          <p>セット差分: {compareResult ? formatSigned(compareResult.breakdownDiff.set) : '--'}</p>
          <p>効果差分: {compareResult ? formatSigned(compareResult.breakdownDiff.effect) : '--'}</p>
        </div>
      </NeonPanel>
    </div>
  );
}

function BuildFormCard({ label, form, onChange, errors, roleOptions, characterOptions, statKeys }: { label: string; form: CompareBuildForm; onChange: (next: CompareBuildForm) => void; errors: string[]; roleOptions: Array<{ id: string; label: string }>; characterOptions: Array<{ id: string; label: string }>; statKeys: StatKey[] }) {
  return (
    <NeonPanel className="space-y-3">
      <h2 className="text-lg font-semibold">{label}</h2>
      <label className="block text-sm">ロール
        <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={form.roleId} onChange={(e) => onChange({ ...form, roleId: e.target.value })}>
          {roleOptions.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
        </select>
      </label>
      <label className="block text-sm">キャラクター
        <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={form.characterId} onChange={(e) => onChange({ ...form, characterId: e.target.value })}>
          {characterOptions.map((character) => <option key={character.id || 'default'} value={character.id}>{character.label}</option>)}
        </select>
      </label>
      <label className="block text-sm">装備タイプ
        <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={form.slot} onChange={(e) => onChange({ ...form, slot: e.target.value as SlotType })}>
          {Object.entries(SLOT_LABELS).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
        </select>
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-sm">メインステータス
          <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={form.mainStatKey} onChange={(e) => onChange({ ...form, mainStatKey: e.target.value as StatKey })}>
            {statKeys.map((key) => <option key={key} value={key}>{key}</option>)}
          </select>
        </label>
        <label className="block text-sm">メイン値
          <input type="number" min={0} className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={form.mainStatValue} onChange={(e) => onChange({ ...form, mainStatValue: e.target.value })} />
        </label>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">サブステータス</p>
        {form.subStats.map((sub, index) => (
          <div className="grid gap-2 sm:grid-cols-2" key={index}>
            <select className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-sm" value={sub.key} onChange={(e) => onChange({ ...form, subStats: form.subStats.map((item, i) => i === index ? { ...item, key: e.target.value as StatKey } : item) })}>
              {statKeys.map((key) => <option key={key} value={key}>{key}</option>)}
            </select>
            <input type="number" min={0} placeholder="未入力可" className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-sm" value={sub.value} onChange={(e) => onChange({ ...form, subStats: form.subStats.map((item, i) => i === index ? { ...item, value: e.target.value } : item) })} />
          </div>
        ))}
      </div>
      {errors.length > 0 && <ul className="list-disc pl-5 text-sm text-[var(--color-danger)]">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
    </NeonPanel>
  );
}

function ResultCard({ title, score, rank, breakdown }: { title: string; score?: number; rank?: string; breakdown?: { main: number; sub: number; set: number; effect: number } }) {
  return <div className="rounded-lg border border-[var(--color-border)] p-3 text-sm space-y-1"><p className="font-semibold">{title}</p><p>スコア: {score != null ? score.toFixed(2) : '--'}</p><p>ランク: {rank ?? '--'}</p><p>メイン: {breakdown ? breakdown.main.toFixed(2) : '--'}</p><p>サブ: {breakdown ? breakdown.sub.toFixed(2) : '--'}</p><p>セット: {breakdown ? breakdown.set.toFixed(2) : '--'}</p><p>効果: {breakdown ? breakdown.effect.toFixed(2) : '--'}</p></div>;
}

function formatSigned(value: number): string { return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`; }
