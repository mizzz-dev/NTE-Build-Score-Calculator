'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { SlotType, StatKey } from '@/lib/score/types';
import { calculateCompareResult, type CompareBuildForm, validateCompareForm } from '../lib/compareCalculator';
import { usePublicMaster } from '@/features/public-master/usePublicMaster';
import { resolveScoreConfig } from '@/features/score/lib/scoreConfigResolver';
import { ScoreOcrAssistPanel } from '@/features/ocr/components/ScoreOcrAssistPanel';
import { createBrowserTesseractAdapter, type OcrProgressStatus } from '@/features/ocr/lib/adapter';
import { runScoreOcrAssist } from '@/features/ocr/lib/scoreOcrAssist';
import { applyCompareOcrDraftToForm, canRunCompareWithOcrGuard, createInitialCompareOcrSideState, type CompareOcrSideState, type CompareSide, unresolvedCount } from '../lib/compareOcr';

const SLOT_LABELS: Record<SlotType, string> = { cartridge: 'カートリッジ', module: 'モジュール', gear: 'ギア', console: 'コンソール' };
const DEFAULT_STAT_KEYS: StatKey[] = ['atk_percent', 'crit_rate', 'crit_dmg', 'hp_flat'];

const initialForm = (): CompareBuildForm => ({
  roleId: 'dps', characterId: '', slot: 'cartridge', mainStatKey: DEFAULT_STAT_KEYS[0], mainStatValue: '', subStats: Array.from({ length: 3 }, () => ({ key: DEFAULT_STAT_KEYS[0], value: '' })),
});

export function ComparePageContainer() {
  const [formA, setFormA] = useState<CompareBuildForm>(initialForm);
  const [formB, setFormB] = useState<CompareBuildForm>(initialForm);
  const [ocrA, setOcrA] = useState<CompareOcrSideState>(createInitialCompareOcrSideState());
  const [ocrB, setOcrB] = useState<CompareOcrSideState>(createInitialCompareOcrSideState());
  const [ocrRawTextA, setOcrRawTextA] = useState('');
  const [ocrRawTextB, setOcrRawTextB] = useState('');
  const [ocrProgressA, setOcrProgressA] = useState<'idle' | OcrProgressStatus>('idle');
  const [ocrProgressB, setOcrProgressB] = useState<'idle' | OcrProgressStatus>('idle');
  const startedRefA = useRef<number | null>(null);
  const startedRefB = useRef<number | null>(null);
  const [elapsedA, setElapsedA] = useState(0);
  const [elapsedB, setElapsedB] = useState(0);

  const { loading: masterLoading, warning: masterWarning, viewModel, data: masterData, source: masterSource } = usePublicMaster();
  const roleOptions = viewModel?.roleOptions ?? [];
  const characterOptions = viewModel?.characterOptions ?? [];
  const statusCandidates = useMemo(() => masterData?.statuses ?? [], [masterData?.statuses]);
  const scoreConfigState = useMemo(() => resolveScoreConfig(masterData && masterSource ? { data: masterData, source: masterSource, warning: masterWarning } : null), [masterData, masterSource, masterWarning]);
  const statKeys = useMemo(() => Object.keys(scoreConfigState.config.statRanges) as StatKey[], [scoreConfigState.config]);

  const errorsA = useMemo(() => validateCompareForm(formA), [formA]);
  const errorsB = useMemo(() => validateCompareForm(formB), [formB]);
  const guard = useMemo(() => canRunCompareWithOcrGuard({ formAErrors: errorsA, formBErrors: errorsB, sideA: ocrA, sideB: ocrB }), [errorsA, errorsB, ocrA, ocrB]);
  const unresolvedA = useMemo(() => unresolvedCount(ocrA.candidate), [ocrA.candidate]);
  const unresolvedB = useMemo(() => unresolvedCount(ocrB.candidate), [ocrB.candidate]);
  const unresolvedTotal = unresolvedA + unresolvedB;
  const compareResult = useMemo(() => (guard.canCompare ? calculateCompareResult(formA, formB, scoreConfigState.config) : null), [guard.canCompare, formA, formB, scoreConfigState.config]);

  const handleOcr = useCallback(async (side: CompareSide, file: File | null) => {
    if (!file) return;
    const setState = side === 'A' ? setOcrA : setOcrB;
    const rawText = side === 'A' ? ocrRawTextA : ocrRawTextB;
    const setProgress = side === 'A' ? setOcrProgressA : setOcrProgressB;
    const startedRef = side === 'A' ? startedRefA : startedRefB;
    const setElapsed = side === 'A' ? setElapsedA : setElapsedB;
    setState((prev) => ({ ...prev, status: 'processing', error: null, reviewAcknowledged: false }));
    setProgress('loading_engine');
    startedRef.current = Date.now();
    setElapsed(0);
    const adapter = createBrowserTesseractAdapter((status) => {
      setProgress(status);
      if (startedRef.current) setElapsed(Date.now() - startedRef.current);
    });
    const result = await runScoreOcrAssist({ file, rawText, statusCandidates, adapter });
    setState({ status: result.status, error: result.error, candidate: result.candidate, reviewAcknowledged: false });
    setProgress('idle');
  }, [ocrRawTextA, ocrRawTextB, statusCandidates]);

  const superiority = !compareResult ? '--' : compareResult.scoreDiff > 0 ? 'B が優位' : compareResult.scoreDiff < 0 ? 'A が優位' : '同点';

  return (<div className="space-y-6"><SectionHeader title="ビルド比較" subtitle="比較元Aと比較先Bの装備入力から、スコア・ランク・内訳差分を確認できます。" />
    <div className="grid gap-4 lg:grid-cols-2">
      <BuildFormCard label="比較元 A" form={formA} onChange={setFormA} errors={errorsA} roleOptions={roleOptions} characterOptions={characterOptions} statKeys={statKeys} />
      <BuildFormCard label="比較先 B" form={formB} onChange={setFormB} errors={errorsB} roleOptions={roleOptions} characterOptions={characterOptions} statKeys={statKeys} />
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <CompareOcrCard side="A" state={ocrA} rawText={ocrRawTextA} progressStatus={ocrProgressA} elapsedMs={elapsedA} statKeys={statKeys} onRawTextChange={setOcrRawTextA} onSelectImage={(f) => handleOcr('A', f)} onUpdateState={setOcrA} onApply={() => { setFormA((curr) => applyCompareOcrDraftToForm(ocrA.candidate, curr)); setOcrA((p) => ({ ...p, reviewAcknowledged: true })); }} />
      <CompareOcrCard side="B" state={ocrB} rawText={ocrRawTextB} progressStatus={ocrProgressB} elapsedMs={elapsedB} statKeys={statKeys} onRawTextChange={setOcrRawTextB} onSelectImage={(f) => handleOcr('B', f)} onUpdateState={setOcrB} onApply={() => { setFormB((curr) => applyCompareOcrDraftToForm(ocrB.candidate, curr)); setOcrB((p) => ({ ...p, reviewAcknowledged: true })); }} />
    </div>
    {!guard.canCompare && <NeonPanel className="space-y-2 text-sm"><p className="font-medium text-[var(--color-danger)]">比較実行前にA/Bの確認が必要です（未確定0件で比較可能）。</p>{guard.hasOcrBlockingReason && <><p className="text-xs text-[var(--color-danger)]">未確定残件: 合計{unresolvedTotal}件（A: {unresolvedA}件 / B: {unresolvedB}件）</p><p className="text-xs text-[var(--color-text-secondary)]">確認順ガイド: 1) 比較Aの未確定を解消 → 2) 比較Bの未確定を解消 → 3) A/Bの確認済みチェックをON</p></>}<ul className="list-disc pl-5 text-[var(--color-danger)]">{guard.reasons.map((r) => <li key={r}>{r}</li>)}</ul></NeonPanel>}

    {masterLoading && <p className="text-xs text-[var(--color-text-secondary)]">公開マスタを読み込み中です...</p>}
    {masterWarning && <p className="text-xs text-[var(--color-text-secondary)]">{masterWarning}</p>}
    {scoreConfigState.notice && <p className="text-xs text-[var(--color-text-secondary)]">{scoreConfigState.notice}</p>}
    <p className="text-xs text-[var(--color-text-secondary)]">設定ソース: {scoreConfigState.source === 'public-master' ? '公開マスタ' : '標準設定（フォールバック）'}</p>
    <NeonPanel className="space-y-4"><h2 className="text-lg font-semibold">比較結果</h2><p className="text-sm">判定: <span className="font-bold text-[var(--color-accent)]">{superiority}</span></p>
      <div className="grid gap-3 md:grid-cols-2"><ResultCard title="A" score={compareResult?.resultA.buildScoreNormalized} rank={compareResult?.resultA.rank} breakdown={compareResult?.breakdownA} /><ResultCard title="B" score={compareResult?.resultB.buildScoreNormalized} rank={compareResult?.resultB.rank} breakdown={compareResult?.breakdownB} /></div></NeonPanel></div>);
}

function CompareOcrCard({ side, state, rawText, progressStatus, elapsedMs, statKeys, onRawTextChange, onSelectImage, onUpdateState, onApply }: { side: CompareSide; state: CompareOcrSideState; rawText: string; progressStatus: 'idle' | OcrProgressStatus; elapsedMs: number; statKeys: StatKey[]; onRawTextChange: (v: string) => void; onSelectImage: (f: File | null) => void; onUpdateState: (updater: (prev: CompareOcrSideState) => CompareOcrSideState) => void; onApply: () => void }) {
  return <NeonPanel className="space-y-2"><ScoreOcrAssistPanel status={state.status} progressStatus={progressStatus} processingElapsedMs={elapsedMs} error={state.error} rawText={rawText} candidate={state.candidate} panelTitle={`OCR入力補助（比較${side}）`} statKeyOptions={statKeys} onRawTextChange={onRawTextChange} onSelectImage={onSelectImage} onUpdateCandidate={(next) => onUpdateState((prev) => ({ ...prev, candidate: next, reviewAcknowledged: false }))} onApplyCandidate={onApply} />
  {state.status === 'error' && <p className="text-xs text-[var(--color-danger)]">比較{side}のみOCR失敗。手動入力で継続できます。</p>}
  <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={state.reviewAcknowledged} onChange={(e) => onUpdateState((prev) => ({ ...prev, reviewAcknowledged: e.target.checked }))} />比較{side}のOCR反映内容を確認済み</label></NeonPanel>;
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

function ResultCard({ title, score, rank, breakdown }: { title: string; score?: number; rank?: string; breakdown?: { main: number; sub: number; set: number; effect: number } }) { return <div className="rounded-lg border border-[var(--color-border)] p-3 text-sm space-y-1"><p className="font-semibold">{title}</p><p>スコア: {score != null ? score.toFixed(2) : '--'}</p><p>ランク: {rank ?? '--'}</p><p>メイン: {breakdown ? breakdown.main.toFixed(2) : '--'}</p><p>サブ: {breakdown ? breakdown.sub.toFixed(2) : '--'}</p><p>セット: {breakdown ? breakdown.set.toFixed(2) : '--'}</p><p>効果: {breakdown ? breakdown.effect.toFixed(2) : '--'}</p></div>; }
