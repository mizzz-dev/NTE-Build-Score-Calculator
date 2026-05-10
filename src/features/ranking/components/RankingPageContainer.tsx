'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { useAuthState } from '@/features/auth/AuthProvider';
import { deleteRankingEntry, isRankingAvailable, listRankingEntries } from '../api';
import type { RankingEntry, RankingSort } from '../types';

export function RankingPageContainer() {
  const auth = useAuthState();
  const [sort, setSort] = useState<RankingSort>('score_desc');
  const [resultKind, setResultKind] = useState<string>('all');
  const [role, setRole] = useState<string>('all');
  const [equipmentType, setEquipmentType] = useState<string>('all');
  const [scoreRank, setScoreRank] = useState<string>('all');
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const rankingAvailable = isRankingAvailable();

  const load = useCallback(async () => {
    if (!rankingAvailable) {
      setEntries([]);
      return;
    }
    try {
      setError(null);
      const items = await listRankingEntries(sort, {
        resultKind: resultKind === 'all' ? undefined : (resultKind as 'score' | 'card'),
        role: role === 'all' ? undefined : role,
        equipmentType: equipmentType === 'all' ? undefined : equipmentType,
        scoreRank: scoreRank === 'all' ? undefined : scoreRank,
      });
      setEntries(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ランキング取得に失敗しました。');
    }
  }, [equipmentType, rankingAvailable, resultKind, role, scoreRank, sort]);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;
      void load();
    });

    return () => {
      active = false;
    };
  }, [load]);

  const options = useMemo(() => ({
    roles: Array.from(new Set(entries.map((entry) => entry.role))),
    equipmentTypes: Array.from(new Set(entries.map((entry) => entry.equipmentType))),
    scoreRanks: Array.from(new Set(entries.map((entry) => entry.scoreRank))),
  }), [entries]);

  const handleDelete = useCallback(async (id: string) => {
    if (!auth.user) return;
    try {
      await deleteRankingEntry(auth.user, id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : '削除に失敗しました。');
    }
  }, [auth.user, load]);

  return (
    <div className="space-y-6">
      <SectionHeader title="ランキング" subtitle="公開されたスコア結果を閲覧できます。" />
      {!rankingAvailable && (
        <NeonPanel>
          <p className="text-sm text-[var(--color-text-secondary)]">Supabase未設定のためランキング機能は現在利用できません。</p>
        </NeonPanel>
      )}
      {rankingAvailable && (
        <>
          <NeonPanel className="space-y-3">
            <div className="grid gap-3 md:grid-cols-5">
              <label className="text-sm">並び順
                <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={sort} onChange={(e) => setSort(e.target.value as RankingSort)}>
                  <option value="score_desc">スコア順</option>
                  <option value="created_desc">作成日時順</option>
                </select>
              </label>
              <label className="text-sm">結果種別
                <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={resultKind} onChange={(e) => setResultKind(e.target.value)}>
                  <option value="all">すべて</option><option value="score">score</option><option value="card">card</option>
                </select>
              </label>
              <label className="text-sm">ロール
                <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="all">すべて</option>{options.roles.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm">装備タイプ
                <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)}>
                  <option value="all">すべて</option>{options.equipmentTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm">ランク
                <select className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2" value={scoreRank} onChange={(e) => setScoreRank(e.target.value)}>
                  <option value="all">すべて</option>{options.scoreRanks.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
            {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
          </NeonPanel>

          <div className="space-y-3">
            {entries.length === 0 && <NeonPanel><p className="text-sm">公開中のランキング投稿はまだありません。</p></NeonPanel>}
            {entries.map((entry) => {
              const mine = auth.user?.id === entry.userId;
              return (
                <NeonPanel key={entry.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{entry.isAnonymous ? '匿名ユーザー' : entry.displayName}</p>
                    <p className="text-sm">{entry.scoreTotal.toFixed(2)} / {entry.scoreRank}</p>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">{entry.resultKind} | {entry.role} | {entry.equipmentType} | {new Date(entry.createdAt).toLocaleString('ja-JP')}</p>
                  {mine && <button type="button" onClick={() => void handleDelete(entry.id)} className="rounded-md border border-[var(--color-danger)] px-3 py-1 text-xs text-[var(--color-danger)]">自分の投稿を削除</button>}
                </NeonPanel>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
