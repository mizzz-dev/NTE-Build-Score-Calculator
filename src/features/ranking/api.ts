import type { AuthUser } from '@/features/auth/types';
import { getSupabaseClientConfig } from '@/lib/supabase/config';
import type { CreateRankingPayload, RankingEntry, RankingFilters, RankingResultKind, RankingSort } from './types';

const TABLE = 'ranking_public_entries';

type RankingRow = {
  id: string;
  user_id: string;
  display_name: string;
  is_anonymous: boolean;
  result_kind: RankingResultKind;
  role: string;
  equipment_type: string;
  score_total: number;
  score_rank: string;
  payload_snapshot: Record<string, unknown>;
  created_at: string;
};

function buildHeaders(config: { anonKey: string }, accessToken?: string): HeadersInit {
  return {
    apikey: config.anonKey,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    'Content-Type': 'application/json',
  };
}

export function isRankingAvailable(): boolean {
  return getSupabaseClientConfig() !== null;
}

function toEntry(row: RankingRow): RankingEntry {
  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    isAnonymous: row.is_anonymous,
    resultKind: row.result_kind,
    role: row.role,
    equipmentType: row.equipment_type,
    scoreTotal: row.score_total,
    scoreRank: row.score_rank,
    payloadSnapshot: row.payload_snapshot,
    createdAt: row.created_at,
  };
}

export async function listRankingEntries(sort: RankingSort, filters: RankingFilters): Promise<RankingEntry[]> {
  const config = getSupabaseClientConfig();
  if (!config) return [];

  const params = new URLSearchParams();
  params.set('select', 'id,user_id,display_name,is_anonymous,result_kind,role,equipment_type,score_total,score_rank,payload_snapshot,created_at');
  if (sort === 'score_desc') {
    params.append('order', 'score_total.desc');
    params.append('order', 'created_at.desc');
  } else {
    params.append('order', 'created_at.desc');
  }
  if (filters.resultKind) params.set('result_kind', `eq.${filters.resultKind}`);
  if (filters.role) params.set('role', `eq.${filters.role}`);
  if (filters.equipmentType) params.set('equipment_type', `eq.${filters.equipmentType}`);
  if (filters.scoreRank) params.set('score_rank', `eq.${filters.scoreRank}`);

  const res = await fetch(`${config.url}/rest/v1/${TABLE}?${params.toString()}`, {
    headers: buildHeaders(config),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('ランキング一覧の取得に失敗しました。');

  const rows = (await res.json()) as RankingRow[];
  return rows.map(toEntry);
}

export async function createRankingEntry(user: AuthUser, payload: CreateRankingPayload): Promise<void> {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) throw new Error('ランキング投稿は利用できません。');

  const res = await fetch(`${config.url}/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: { ...buildHeaders(config, user.accessToken), Prefer: 'return=minimal' },
    body: JSON.stringify([{ user_id: user.id, display_name: payload.displayName, is_anonymous: payload.isAnonymous, result_kind: payload.resultKind, role: payload.role, equipment_type: payload.equipmentType, score_total: payload.scoreTotal, score_rank: payload.scoreRank, payload_snapshot: payload.payloadSnapshot }]),
  });
  if (!res.ok) throw new Error('ランキング投稿に失敗しました。');
}

export async function deleteRankingEntry(user: AuthUser, id: string): Promise<void> {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) throw new Error('ランキング削除は利用できません。');

  const res = await fetch(`${config.url}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...buildHeaders(config, user.accessToken), Prefer: 'return=minimal' },
  });
  if (!res.ok) throw new Error('ランキング投稿の削除に失敗しました。');
}
