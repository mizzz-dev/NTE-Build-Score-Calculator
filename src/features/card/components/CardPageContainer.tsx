'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { calculateBuildScore } from '@/lib/score';
import type { SlotType, StatKey } from '@/lib/score/types';
import { deleteGuestHistory, listGuestHistory, saveGuestHistory } from '@/features/history/storage';
import { canUseCloudStorage, deleteCloudHistory, listCloudHistory, saveCloudHistory, type CloudHistoryEntry } from '@/features/history/cloudStorage';
import { listMigrationGuestHistory, migrateGuestHistoryToCloud } from '@/features/history/migration';
import { useAuthState } from '@/features/auth/AuthProvider';
import type { GuestHistoryEntry } from '@/features/history/types';
import { exportElementToPng } from '../lib/cardImage';
import { usePublicMaster } from '@/features/public-master/usePublicMaster';
import { resolveScoreConfig } from '@/features/score/lib/scoreConfigResolver';
import { createCardPayload } from '@/features/score/lib/payloadBuilders';
import { ScoreOcrAssistPanel } from '@/features/ocr/components/ScoreOcrAssistPanel';
import { applyScoreOcrCandidateToForm, canApplyScoreOcrCandidate, runScoreOcrAssist, type ScoreOcrCandidate } from '@/features/ocr/lib/scoreOcrAssist';
import { createBrowserTesseractAdapter, type OcrProgressStatus } from '@/features/ocr/lib/adapter';

const SLOT_LABELS: Record<SlotType, string> = { cartridge: 'カートリッジ', module: 'モジュール', gear: 'ギア', console: 'コンソール' };
const DEFAULT_STAT_KEYS: StatKey[] = ['atk_percent', 'crit_rate', 'crit_dmg', 'hp_flat'];

function listCardHistory(): GuestHistoryEntry[] {
  return listGuestHistory().filter((entry) => entry.kind === 'card');
}

export function CardPageContainer() {
  const [characterName, setCharacterName] = useState('');
  const [roleId, setRoleId] = useState('dps');
  const [slot, setSlot] = useState<SlotType>('cartridge');
  const [mainStatKey, setMainStatKey] = useState<StatKey>(DEFAULT_STAT_KEYS[0]);
  const [mainStatValue, setMainStatValue] = useState('');
  const [subStats, setSubStats] = useState(Array.from({ length: 3 }, () => ({ key: DEFAULT_STAT_KEYS[0], value: '' })));
  const [comment, setComment] = useState('');
  const [saveState, setSaveState] = useState<'idle'|'saving'|'success'|'error'>('idle');
  const [history, setHistory] = useState<GuestHistoryEntry[]>(() => listCardHistory());
  const [historySaveStatus, setHistorySaveStatus] = useState<'idle'|'success'>('idle');
  const [cloudHistory, setCloudHistory] = useState<CloudHistoryEntry[]>([]);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [cloudSaveStatus, setCloudSaveStatus] = useState<'idle'|'saving'|'success'|'error'>('idle');
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [migrationMessage, setMigrationMessage] = useState<string | null>(null);

  const [ocrStatus, setOcrStatus] = useState<'idle' | 'processing' | 'success' | 'error' | 'needs_review'>('idle');
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrRawText, setOcrRawText] = useState<string>('');
  const [ocrDraft, setOcrDraft] = useState<ScoreOcrCandidate | null>(null);
  const [ocrProgressStatus, setOcrProgressStatus] = useState<'idle' | OcrProgressStatus>('idle');
  const [ocrProcessingElapsedMs, setOcrProcessingElapsedMs] = useState<number>(0);
  const [ocrReviewAcknowledged, setOcrReviewAcknowledged] = useState<boolean>(false);
  const ocrProcessingStartedAtRef = useRef<number | null>(null);
  const auth = useAuthState();
  const cloudEnabled = canUseCloudStorage(auth.user);
  const hasGuestHistoryForMigration = listMigrationGuestHistory().length > 0;
  const previewRef = useRef<HTMLDivElement>(null);
  const { loading: masterLoading, warning: masterWarning, viewModel, data: masterData, source: masterSource } = usePublicMaster();
  const roleOptions = viewModel?.roleOptions ?? [];

  const scoreConfigState = useMemo(() => resolveScoreConfig(masterData && masterSource ? { data: masterData, source: masterSource, warning: masterWarning } : null), [masterData, masterSource, masterWarning]);
  const statKeys = useMemo(() => Object.keys(scoreConfigState.config.statRanges) as StatKey[], [scoreConfigState.config]);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;

      if (!statKeys.includes(mainStatKey)) setMainStatKey(statKeys[0]);
      setSubStats((prev) => prev.map((sub) => (statKeys.includes(sub.key) ? sub : { ...sub, key: statKeys[0] })));
    });

    return () => {
      active = false;
    };
  }, [mainStatKey, statKeys]);

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
    }, scoreConfigState.config);
  }, [errors.length, mainStatKey, mainStatValue, roleId, scoreConfigState.config, slot, subStats]);


  const statusCandidates = useMemo(() => masterData?.statuses ?? [], [masterData?.statuses]);
  const unresolvedSubCount = ocrDraft?.subStats.filter((sub) => sub.requiresManual).length ?? 0;
  const unresolvedCount = (ocrDraft?.requiresManualMain ? 1 : 0) + unresolvedSubCount;
  const reviewedCount = ocrDraft
    ? (ocrDraft.mainStatKey && ocrDraft.mainStatValue ? 1 : 0) + ocrDraft.subStats.filter((sub) => sub.key && sub.value).length
    : 0;
  const canGenerateCard = Boolean(result) && (!ocrDraft || ocrReviewAcknowledged);

  const createdAt = useMemo(() => new Date().toLocaleString('ja-JP'), []);

  useEffect(() => {
    if (ocrStatus !== 'processing') {
      ocrProcessingStartedAtRef.current = null;
      return;
    }
    if (ocrProcessingStartedAtRef.current === null) ocrProcessingStartedAtRef.current = Date.now();
    const timer = window.setInterval(() => {
      const started = ocrProcessingStartedAtRef.current;
      if (!started) return;
      setOcrProcessingElapsedMs(Date.now() - started);
    }, 250);
    return () => window.clearInterval(timer);
  }, [ocrStatus]);

  const handleSelectOcrImage = useCallback(async (file: File | null) => {
    if (!file) return;
    setOcrStatus('processing');
    setOcrProgressStatus('loading_engine');
    ocrProcessingStartedAtRef.current = Date.now();
    setOcrProcessingElapsedMs(0);
    setOcrError(null);
    setOcrReviewAcknowledged(false);
    const adapter = createBrowserTesseractAdapter((status) => setOcrProgressStatus(status));
    const ocrResult = await runScoreOcrAssist({ file, rawText: ocrRawText, statusCandidates, adapter });
    setOcrStatus(ocrResult.status);
    setOcrProgressStatus('idle');
    setOcrError(ocrResult.error);
    setOcrDraft(ocrResult.candidate);
  }, [ocrRawText, statusCandidates]);

  const handleApplyOcrDraft = useCallback(() => {
    if (!ocrDraft || !canApplyScoreOcrCandidate(ocrDraft)) return;
    const next = applyScoreOcrCandidateToForm(ocrDraft, { slot, mainStatKey, mainStatValue, subStats });
    setSlot(next.slot);
    setMainStatKey(next.mainStatKey);
    setMainStatValue(next.mainStatValue);
    setSubStats(next.subStats);
    setOcrReviewAcknowledged(false);
  }, [mainStatKey, mainStatValue, ocrDraft, slot, subStats]);

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
    const payload = createCardPayload({ roleId, slot, mainStatKey, mainStatValue, subStats }, result.buildScoreNormalized, result.rank);
    if (Number.isNaN(payload.mainStatValue)) return;
    const next = saveGuestHistory({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind: 'card',
      createdAt: new Date().toISOString(),
      payload,
    });
    setHistory(next.filter((entry) => entry.kind === 'card'));
    setHistorySaveStatus('success');
  };

  const handleSaveCloud = async () => {
    if (!result || !auth.user || !cloudEnabled) return;
    try {
      setCloudSaveStatus('saving');
      setCloudError(null);
      const payload = createCardPayload({ roleId, slot, mainStatKey, mainStatValue, subStats }, result.buildScoreNormalized, result.rank);
      await saveCloudHistory(auth.user, { kind: 'card', payload });
      setCloudHistory(await listCloudHistory(auth.user));
      setCloudSaveStatus('success');
    } catch (e) {
      setCloudSaveStatus('error');
      setCloudError(e instanceof Error ? e.message : 'クラウド保存に失敗しました。');
    }
  };



  const handleMigrateGuestHistory = async () => {
    if (!auth.user || auth.status !== 'signed_in' || !cloudEnabled) return;
    try {
      setMigrationStatus('migrating');
      setMigrationMessage(null);
      const result = await migrateGuestHistoryToCloud(auth.user);
      setHistory(listCardHistory());
      setCloudHistory(await listCloudHistory(auth.user));
      setMigrationStatus('success');
      setMigrationMessage(`移行完了: ${result.migratedCount}件保存 / ${result.skippedCount}件は重複のためスキップ`);
    } catch (e) {
      setMigrationStatus('error');
      setMigrationMessage(e instanceof Error ? e.message : '移行に失敗しました。');
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
    let active = true;

    queueMicrotask(() => {
      if (!active) return;
      if (auth.status !== 'signed_in' || !cloudEnabled || !auth.user) return;

      listCloudHistory(auth.user)
        .then((items) => { if (active) setCloudHistory(items); })
        .catch((e: Error) => { if (active) setCloudError(e.message); });
    });

    return () => {
      active = false;
    };
  }, [auth.status, auth.user, cloudEnabled]);

  return <div className="space-y-6">
    <SectionHeader title="ビルドカード生成" subtitle="入力した装備情報からスコア付きカードを作成し、PNG保存できます。" />
    <div className="grid gap-4 xl:grid-cols-2">
      <NeonPanel className="space-y-3">
        <h2 className="text-lg font-semibold">入力フォーム</h2>
        <label className="block text-sm">キャラ名<input className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={characterName} onChange={(e) => setCharacterName(e.target.value)} placeholder="任意入力" /></label>
        <label className="block text-sm">ロール<select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={roleId} onChange={(e) => setRoleId(e.target.value)}>{roleOptions.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
        <label className="block text-sm">装備タイプ<select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={slot} onChange={(e) => setSlot(e.target.value as SlotType)}>{Object.entries(SLOT_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <div className="grid gap-2 sm:grid-cols-2"><label className="block text-sm">メインステータス<select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={mainStatKey} onChange={(e) => setMainStatKey(e.target.value as StatKey)}>{statKeys.map((key) => <option key={key} value={key}>{key}</option>)}</select></label><label className="block text-sm">メイン値<input type="number" min={0} className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={mainStatValue} onChange={(e) => setMainStatValue(e.target.value)} /></label></div>
        <div className="space-y-2"><p className="text-sm font-medium">サブステータス</p>{subStats.map((sub, i) => <div className="grid gap-2 sm:grid-cols-2" key={i}><select className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-sm" value={sub.key} onChange={(e) => setSubStats((prev) => prev.map((item, idx) => idx === i ? { ...item, key: e.target.value as StatKey } : item))}>{statKeys.map((key) => <option key={key} value={key}>{key}</option>)}</select><input type="number" min={0} className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-sm" value={sub.value} onChange={(e) => setSubStats((prev) => prev.map((item, idx) => idx === i ? { ...item, value: e.target.value } : item))} placeholder="未入力可" /></div>)}</div>
        <label className="block text-sm">コメント<textarea className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="自由入力" /></label>
        <ScoreOcrAssistPanel status={ocrStatus} progressStatus={ocrProgressStatus} processingElapsedMs={ocrProcessingElapsedMs} error={ocrError} rawText={ocrRawText} candidate={ocrDraft} panelTitle="OCR入力補助（/card）" statKeyOptions={statKeys} onRawTextChange={setOcrRawText} onSelectImage={handleSelectOcrImage} onUpdateCandidate={setOcrDraft} onApplyCandidate={handleApplyOcrDraft} />
        <div className="rounded-md border border-[var(--color-border)] p-2 text-xs">
          <p className="font-medium">OCR反映確認（カード生成前）</p>
          <p className="text-[var(--color-text-secondary)]">OCRは下書き補助です。保存payload・共有URL・ランキングpayloadにはOCRメタ情報を保存しません。</p>
          {ocrDraft ? <p className={unresolvedCount > 0 ? 'text-[var(--color-danger)]' : 'text-[var(--color-accent)]'}>未確定項目: {unresolvedCount}件 / 反映項目: {reviewedCount}件</p> : <p className="text-[var(--color-text-secondary)]">OCR未使用（手動入力導線をそのまま利用できます）。</p>}
          {ocrStatus === 'error' && <p className="text-[var(--color-danger)]">OCR失敗時はこのまま手動入力へ戻れます。必要に応じて再試行してください。</p>}
          {ocrDraft && unresolvedCount > 0 && <p className="text-[var(--color-danger)]">未確定項目があるためカード生成前に手動確認してください。</p>}
          {ocrDraft && (
            <label className="mt-2 flex items-center gap-2">
              <input type="checkbox" checked={ocrReviewAcknowledged} onChange={(e) => setOcrReviewAcknowledged(e.target.checked)} />
              <span>OCR反映項目と未確定項目を確認しました（カード生成前の最終確認）</span>
            </label>
          )}
        </div>
        {masterLoading && <p className="text-xs text-[var(--color-text-secondary)]">公開マスタを読み込み中です...</p>}
        {masterWarning && <p className="text-xs text-[var(--color-text-secondary)]">{masterWarning}</p>}
        {scoreConfigState.notice && <p className="text-xs text-[var(--color-text-secondary)]">{scoreConfigState.notice}</p>}
        <p className="text-xs text-[var(--color-text-secondary)]">設定ソース: {scoreConfigState.source === 'public-master' ? '公開マスタ' : '標準設定（フォールバック）'}</p>
        {errors.length > 0 && <ul className="list-disc pl-5 text-sm text-[var(--color-danger)]">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
        <button type="button" className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent)] disabled:opacity-50" onClick={handleSave} disabled={!canGenerateCard || saveState === 'saving'}>PNGで保存</button>
        <button type="button" className="ml-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent)] disabled:opacity-50" onClick={handleSaveHistory} disabled={!result}>入力結果を履歴保存</button>
        {!canGenerateCard && ocrDraft && <p className="text-xs text-[var(--color-danger)]">カード生成前にOCR確認チェックを完了してください。</p>}
        {saveState === 'success' && <p className="text-xs text-[var(--color-accent)]">PNG保存を開始しました。</p>}
        {saveState === 'error' && <p className="text-xs text-[var(--color-danger)]">PNG保存に失敗しました。</p>}
        {historySaveStatus === 'success' && <p className="text-xs text-[var(--color-accent)]">履歴に保存しました（最大20件）。</p>}
        <button type="button" className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent)] disabled:opacity-50" onClick={handleSaveCloud} disabled={!result || !cloudEnabled || auth.status !== 'signed_in' || cloudSaveStatus === 'saving'}>クラウド保存</button>
        {auth.status !== 'signed_in' && <p className="text-xs text-[var(--color-text-secondary)]">クラウド保存するにはログインしてください。</p>}
        {!cloudEnabled && auth.status === 'signed_in' && <p className="text-xs text-[var(--color-text-secondary)]">Supabase未設定またはセッション期限切れのためクラウド保存を利用できません。</p>}
        {cloudSaveStatus === 'success' && <p className="text-xs text-[var(--color-accent)]">クラウドに保存しました。</p>}
        {cloudError && <p className="text-xs text-[var(--color-danger)]">{cloudError}</p>}
        {auth.status === 'signed_in' && cloudEnabled && hasGuestHistoryForMigration && (
          <div className="rounded-md border border-[var(--color-border)] p-2">
            <p className="text-xs text-[var(--color-text-secondary)]">ゲスト履歴（score/card）をクラウドへ一括移行できます。成功時はローカル履歴を削除します。</p>
            <button type="button" className="mt-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-xs hover:border-[var(--color-accent)] disabled:opacity-50" onClick={handleMigrateGuestHistory} disabled={migrationStatus === 'migrating'}>ゲスト履歴をクラウドへ移行</button>
          </div>
        )}
        {migrationStatus === 'migrating' && <p className="text-xs text-[var(--color-text-secondary)]">移行中です...</p>}
        {migrationStatus === 'success' && migrationMessage && <p className="text-xs text-[var(--color-accent)]">{migrationMessage}</p>}
        {migrationStatus === 'error' && migrationMessage && <p className="text-xs text-[var(--color-danger)]">移行失敗: {migrationMessage}</p>}
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
            <p>キャラ名: {characterName || '未入力'}</p><p>ロール: {roleOptions.find((r) => r.id === roleId)?.label ?? roleId}</p>
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
