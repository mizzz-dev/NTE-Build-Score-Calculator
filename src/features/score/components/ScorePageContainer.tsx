'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { calculateBuildScore } from '@/lib/score';
import type { SlotType, StatKey } from '@/lib/score/types';
import { deleteGuestHistory, listGuestHistory, saveGuestHistory } from '@/features/history/storage';
import { canUseCloudStorage, deleteCloudHistory, listCloudHistory, saveCloudHistory, type CloudHistoryEntry } from '@/features/history/cloudStorage';
import { listMigrationGuestHistory, migrateGuestHistoryToCloud } from '@/features/history/migration';
import { useAuthState } from '@/features/auth/AuthProvider';
import { createRankingEntry, isRankingAvailable } from '@/features/ranking/api';
import { usePublicMaster } from '@/features/public-master/usePublicMaster';
import { resolveScoreConfig } from '@/features/score/lib/scoreConfigResolver';
import type { GuestHistoryEntry } from '@/features/history/types';
import { fromShareQuery, SHARE_SUB_STAT_COUNT, toShareQuery } from '../share/mapper';
import type { ScoreShareState } from '../share/types';

const SLOT_LABELS: Record<SlotType, string> = {
  cartridge: 'カートリッジ',
  module: 'モジュール',
  gear: 'ギア',
  console: 'コンソール',
};

const STAT_KEYS: StatKey[] = ['atk_percent', 'crit_rate', 'crit_dmg', 'hp_flat'];
const DEFAULT_SHARE_STATE: ScoreShareState = {
  roleId: 'dps',
  characterId: '',
  slot: 'cartridge',
  mainStatKey: STAT_KEYS[0],
  mainStatValue: '',
  subStats: Array.from({ length: SHARE_SUB_STAT_COUNT }, () => ({ key: STAT_KEYS[0], value: '' })),
};

function listScoreHistory(): GuestHistoryEntry[] {
  return listGuestHistory().filter((entry) => entry.kind === 'score');
}

export function ScorePageContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [roleId, setRoleId] = useState<string>(() => fromShareQuery(searchParams, DEFAULT_SHARE_STATE).roleId);
  const [characterId, setCharacterId] = useState<string>(() => fromShareQuery(searchParams, DEFAULT_SHARE_STATE).characterId);
  const [slot, setSlot] = useState<SlotType>(() => fromShareQuery(searchParams, DEFAULT_SHARE_STATE).slot);
  const [mainStatKey, setMainStatKey] = useState<StatKey>(() => fromShareQuery(searchParams, DEFAULT_SHARE_STATE).mainStatKey);
  const [mainStatValue, setMainStatValue] = useState<string>(() => fromShareQuery(searchParams, DEFAULT_SHARE_STATE).mainStatValue);
  const [subStats, setSubStats] = useState<Array<{ key: StatKey; value: string }>>(() => fromShareQuery(searchParams, DEFAULT_SHARE_STATE).subStats);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [history, setHistory] = useState<GuestHistoryEntry[]>(() => listScoreHistory());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');
  const [cloudHistory, setCloudHistory] = useState<CloudHistoryEntry[]>([]);
  const [cloudStatus, setCloudStatus] = useState<'idle'|'saving'|'success'|'error'>('idle');
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [migrationMessage, setMigrationMessage] = useState<string | null>(null);
  const [rankingDisplayName, setRankingDisplayName] = useState<string>('');
  const [rankingAnonymous, setRankingAnonymous] = useState<boolean>(true);
  const [rankingStatus, setRankingStatus] = useState<'idle'|'posting'|'success'|'error'>('idle');
  const [rankingError, setRankingError] = useState<string | null>(null);
  const auth = useAuthState();
  const cloudEnabled = canUseCloudStorage(auth.user);
  const hasGuestHistoryForMigration = listMigrationGuestHistory().length > 0;
  const rankingAvailable = isRankingAvailable();

  const { loading: masterLoading, warning: masterWarning, viewModel, data, source } = usePublicMaster();
  const roleOptions = viewModel.roleOptions;
  const characterOptions = viewModel.characterOptions;

  const scoreConfigState = useMemo(() => resolveScoreConfig(data ? { data, source: source ?? 'fallback', warning: masterWarning } : null), [data, masterWarning, source]);

  const shareState = useMemo<ScoreShareState>(() => ({ roleId, characterId, slot, mainStatKey, mainStatValue, subStats }), [roleId, characterId, slot, mainStatKey, mainStatValue, subStats]);

  useEffect(() => {
    const nextQuery = toShareQuery(shareState).toString();
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) return;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [pathname, router, searchParams, shareState]);

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
      scoreConfigState.config,
    );
  }, [characterId, errors.length, mainStatKey, mainStatValue, roleId, scoreConfigState.config, slot, subStats]);

  const handleSaveHistory = useCallback(() => {
    if (!result) return;
    const mainValue = Number(mainStatValue);
    if (Number.isNaN(mainValue)) return;
    const parsedSubStats = subStats
      .filter((sub) => sub.value.trim().length > 0)
      .map((sub) => ({ key: sub.key, value: Number(sub.value) }))
      .filter((sub) => !Number.isNaN(sub.value));

    const next = saveGuestHistory({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind: 'score',
      createdAt: new Date().toISOString(),
      payload: {
        roleId,
        characterId: characterId || undefined,
        slot,
        mainStatKey,
        mainStatValue: mainValue,
        subStats: parsedSubStats,
        score: result.buildScoreNormalized,
        rank: result.rank,
      },
    });
    setHistory(next.filter((entry) => entry.kind === 'score'));
    setSaveStatus('success');
  }, [characterId, mainStatKey, mainStatValue, result, roleId, slot, subStats]);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;
      if (auth.status !== 'signed_in' || !cloudEnabled || !auth.user) {
        setCloudHistory([]);
        return;
      }

      listCloudHistory(auth.user)
        .then((items) => { if (active) setCloudHistory(items); })
        .catch((e: Error) => { if (active) setCloudError(e.message); });
    });

    return () => { active = false; };
  }, [auth.status, auth.user, cloudEnabled]);

  const handleSaveCloud = useCallback(async () => {
    if (!result || !auth.user || !cloudEnabled) return;
    try {
      setCloudStatus('saving');
      setCloudError(null);
      const mainValue = Number(mainStatValue);
      const parsedSubStats = subStats.filter((sub) => sub.value.trim().length > 0).map((sub) => ({ key: sub.key, value: Number(sub.value) })).filter((sub) => !Number.isNaN(sub.value));
      await saveCloudHistory(auth.user, {
        kind: 'score',
        payload: { roleId, characterId: characterId || undefined, slot, mainStatKey, mainStatValue: mainValue, subStats: parsedSubStats, score: result.buildScoreNormalized, rank: result.rank },
      });
      const items = await listCloudHistory(auth.user);
      setCloudHistory(items);
      setCloudStatus('success');
    } catch (e) {
      setCloudStatus('error');
      setCloudError(e instanceof Error ? e.message : 'クラウド保存に失敗しました。');
    }
  }, [auth.user, characterId, cloudEnabled, mainStatKey, mainStatValue, result, roleId, slot, subStats]);

  const handleDeleteCloud = useCallback(async (id: string) => {
    if (!auth.user || !cloudEnabled) return;
    try {
      await deleteCloudHistory(auth.user, id);
      setCloudHistory((prev) => prev.filter((entry) => entry.id !== id));
    } catch (e) {
      setCloudError(e instanceof Error ? e.message : '削除に失敗しました。');
    }
  }, [auth.user, cloudEnabled]);

  const handleMigrateGuestHistory = useCallback(async () => {
    if (!auth.user || auth.status !== 'signed_in' || !cloudEnabled) return;
    try {
      setMigrationStatus('migrating');
      setMigrationMessage(null);
      const result = await migrateGuestHistoryToCloud(auth.user);
      const nextGuestHistory = listScoreHistory();
      setHistory(nextGuestHistory);
      const items = await listCloudHistory(auth.user);
      setCloudHistory(items);
      setMigrationStatus('success');
      setMigrationMessage(`移行完了: ${result.migratedCount}件保存 / ${result.skippedCount}件は重複のためスキップ`);
    } catch (e) {
      setMigrationStatus('error');
      setMigrationMessage(e instanceof Error ? e.message : '移行に失敗しました。');
    }
  }, [auth.status, auth.user, cloudEnabled]);
  const handleDeleteHistory = useCallback((id: string) => {
    const next = deleteGuestHistory(id);
    setHistory(next.filter((entry) => entry.kind === 'score'));
  }, []);

  const handlePostRanking = useCallback(async () => {
    if (!result || !auth.user || auth.status !== 'signed_in' || !rankingAvailable) return;
    if (!rankingAnonymous && rankingDisplayName.trim().length === 0) {
      setRankingError('表示名を入力するか、匿名表示を選択してください。');
      setRankingStatus('error');
      return;
    }
    try {
      setRankingStatus('posting');
      setRankingError(null);
      await createRankingEntry(auth.user, {
        displayName: rankingAnonymous ? '匿名ユーザー' : rankingDisplayName.trim(),
        isAnonymous: rankingAnonymous,
        resultKind: 'score',
        role: roleId,
        equipmentType: slot,
        scoreTotal: result.buildScoreNormalized,
        scoreRank: result.rank,
        payloadSnapshot: {
          roleId,
          slot,
          score: result.buildScoreNormalized,
          rank: result.rank,
          mainStatKey,
          mainStatValue: Number(mainStatValue),
          subStats: subStats.filter((sub) => sub.value.trim().length > 0).map((sub) => ({ key: sub.key, value: Number(sub.value) })).filter((sub) => !Number.isNaN(sub.value)),
        },
      });
      setRankingStatus('success');
    } catch (e) {
      setRankingStatus('error');
      setRankingError(e instanceof Error ? e.message : 'ランキング投稿に失敗しました。');
    }
  }, [auth.status, auth.user, mainStatKey, mainStatValue, rankingAnonymous, rankingAvailable, rankingDisplayName, result, roleId, slot, subStats]);

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
              {roleOptions.map((role) => (
                <option key={role.id} value={role.id}>{role.label}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            キャラクター
            <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={characterId} onChange={(e) => setCharacterId(e.target.value)}>
              {characterOptions.map((ch) => (
                <option key={ch.id || 'default'} value={ch.id}>{ch.label}</option>
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
              <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={mainStatKey} onChange={(e) => setMainStatKey(e.target.value as StatKey)}>
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
                <select className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-sm" value={sub.key} onChange={(e) => setSubStats((prev) => prev.map((item, i) => i === index ? { ...item, key: e.target.value as StatKey } : item))}>
                  {STAT_KEYS.map((key) => <option key={key} value={key}>{key}</option>)}
                </select>
                <input className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-sm" type="number" min={0} placeholder="未入力可" value={sub.value} onChange={(e) => setSubStats((prev) => prev.map((item, i) => i === index ? { ...item, value: e.target.value } : item))} />
              </div>
            ))}
          </div>

          {masterLoading && <p className="text-xs text-[var(--color-text-secondary)]">公開マスタを読み込み中です...</p>}
          {masterWarning && <p className="text-xs text-[var(--color-text-secondary)]">{masterWarning}</p>}
          {scoreConfigState.notice && <p className="text-xs text-[var(--color-text-secondary)]">{scoreConfigState.notice}</p>}
          <p className="text-xs text-[var(--color-text-secondary)]">計算設定: {scoreConfigState.source === 'public-master' ? '公開マスタ反映中' : '標準設定(fallback)'}</p>
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
            <button type="button" className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent)] disabled:opacity-50" onClick={handleSaveHistory} disabled={!result}>
              この結果を履歴保存
            </button>
            {saveStatus === 'success' && <p className="mt-1 text-xs text-[var(--color-accent)]">履歴に保存しました（最大20件）。</p>}
            <div className="mt-2 space-y-1">
              <button type="button" className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent)] disabled:opacity-50" onClick={handleSaveCloud} disabled={!result || !cloudEnabled || auth.status !== 'signed_in' || cloudStatus === 'saving'}>
                この結果をクラウド保存
              </button>
              {auth.status !== 'signed_in' && <p className="text-xs text-[var(--color-text-secondary)]">クラウド保存するにはログインしてください。</p>}
              {!cloudEnabled && auth.status === 'signed_in' && <p className="text-xs text-[var(--color-text-secondary)]">Supabase未設定またはセッション期限切れのためクラウド保存を利用できません。</p>}
              {cloudStatus === 'success' && <p className="text-xs text-[var(--color-accent)]">クラウドに保存しました。</p>}
              {cloudError && <p className="text-xs text-[var(--color-danger)]">{cloudError}</p>}
              <div className="rounded-md border border-[var(--color-border)] p-2 space-y-2">
                <p className="text-xs text-[var(--color-text-secondary)]">ランキング投稿（公開用スナップショットのみ）</p>
                {!rankingAvailable && <p className="text-xs text-[var(--color-text-secondary)]">Supabase未設定のためランキング投稿は利用できません。</p>}
                {rankingAvailable && (
                  <>
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" checked={rankingAnonymous} onChange={(e) => setRankingAnonymous(e.target.checked)} />
                      匿名で表示する
                    </label>
                    {!rankingAnonymous && (
                      <input className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-xs" placeholder="表示名（40文字以内）" value={rankingDisplayName} onChange={(e) => setRankingDisplayName(e.target.value)} />
                    )}
                    <button type="button" className="rounded-md border border-[var(--color-border)] px-3 py-2 text-xs hover:border-[var(--color-accent)] disabled:opacity-50" onClick={handlePostRanking} disabled={!result || auth.status !== 'signed_in' || rankingStatus === 'posting'}>
                      この結果をランキング投稿
                    </button>
                    {auth.status !== 'signed_in' && <p className="text-xs text-[var(--color-text-secondary)]">ランキング投稿にはログインが必要です。</p>}
                    {rankingStatus === 'success' && <p className="text-xs text-[var(--color-accent)]">ランキングに投稿しました。/ranking で確認できます。</p>}
                    {rankingError && <p className="text-xs text-[var(--color-danger)]">{rankingError}</p>}
                  </>
                )}
              </div>
              {auth.status === 'signed_in' && cloudEnabled && hasGuestHistoryForMigration && (
                <div className="rounded-md border border-[var(--color-border)] p-2">
                  <p className="text-xs text-[var(--color-text-secondary)]">ゲスト履歴（score/card）をクラウドへ一括移行できます。成功時はローカル履歴を削除します。</p>
                  <button type="button" className="mt-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-xs hover:border-[var(--color-accent)] disabled:opacity-50" onClick={handleMigrateGuestHistory} disabled={migrationStatus === 'migrating'}>
                    ゲスト履歴をクラウドへ移行
                  </button>
                </div>
              )}
              {migrationStatus === 'migrating' && <p className="text-xs text-[var(--color-text-secondary)]">移行中です...</p>}
              {migrationStatus === 'success' && migrationMessage && <p className="text-xs text-[var(--color-accent)]">{migrationMessage}</p>}
              {migrationStatus === 'error' && migrationMessage && <p className="text-xs text-[var(--color-danger)]">移行失敗: {migrationMessage}</p>}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">警告</p>
            {result && (result.warnings.length > 0 || scoreConfigState.warnings.length > 0) ? (
              <ul className="list-disc space-y-1 pl-5 text-xs text-[var(--color-danger)]">
                {scoreConfigState.warnings.map((warning, index) => <li key={`factory-${warning.code}-${index}`}>{warning.code}: {warning.message}</li>)}
                {result.warnings.map((warning, index) => <li key={`${warning.code}-${index}`}>{warning.code}: {warning.message}</li>)}
              </ul>
            ) : (
              <p className="text-xs text-[var(--color-text-secondary)]">警告はありません。</p>
            )}
          </div>
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
            {history.length === 0 ? (
              <p className="text-xs text-[var(--color-text-secondary)]">履歴はありません。</p>
            ) : (
              <ul className="space-y-2">
                {history.map((entry) => (
                  <li key={entry.id} className="rounded-md border border-[var(--color-border)] p-2 text-xs">
                    <p>{new Date(entry.createdAt).toLocaleString('ja-JP')} / {SLOT_LABELS[entry.payload.slot]} / {entry.payload.mainStatKey}:{entry.payload.mainStatValue}</p>
                    <p>スコア: {entry.payload.score.toFixed(2)} / ランク: {entry.payload.rank}</p>
                    <button type="button" className="mt-1 underline" onClick={() => handleDeleteHistory(entry.id)}>削除</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </NeonPanel>
      </div>
    </div>
  );
}
