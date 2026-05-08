import type { AuthUser } from '@/features/auth/types';
import { getSupabaseClientConfig } from '@/lib/supabase/config';
import type { GuestHistoryEntry } from './types';

export type CloudHistoryEntry = {
  id: string;
  kind: 'score' | 'card';
  createdAt: string;
  payload: GuestHistoryEntry['payload'];
};

type CloudHistoryRow = {
  id: string;
  result_kind: 'score' | 'card';
  payload: GuestHistoryEntry['payload'];
  created_at: string;
};

const TABLE = 'user_saved_results';

function buildHeaders(config: { anonKey: string }, user: AuthUser): HeadersInit {
  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${user.accessToken ?? ''}`,
    'Content-Type': 'application/json',
  };
}

export function canUseCloudStorage(user: AuthUser | null): boolean {
  return Boolean(getSupabaseClientConfig() && user?.accessToken);
}

export async function listCloudHistory(user: AuthUser): Promise<CloudHistoryEntry[]> {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) return [];

  const url = `${config.url}/rest/v1/${TABLE}?select=id,result_kind,payload,created_at&order=created_at.desc`;
  const res = await fetch(url, { headers: buildHeaders(config, user), cache: 'no-store' });
  if (!res.ok) throw new Error('保存データの取得に失敗しました。');

  const rows = (await res.json()) as CloudHistoryRow[];
  return rows.map((row) => ({
    id: row.id,
    kind: row.result_kind,
    payload: row.payload,
    createdAt: row.created_at,
  }));
}

export async function saveCloudHistory(user: AuthUser, entry: Omit<CloudHistoryEntry, 'id' | 'createdAt'>): Promise<void> {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) throw new Error('クラウド保存は利用できません。');

  const res = await fetch(`${config.url}/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: { ...buildHeaders(config, user), Prefer: 'return=minimal' },
    body: JSON.stringify([
      {
        user_id: user.id,
        result_kind: entry.kind,
        payload: entry.payload,
        score_total: entry.payload.score,
        score_rank: entry.payload.rank,
      },
    ]),
  });
  if (!res.ok) throw new Error('クラウド保存に失敗しました。');
}

export async function deleteCloudHistory(user: AuthUser, id: string): Promise<void> {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) throw new Error('クラウド保存は利用できません。');

  const res = await fetch(`${config.url}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { ...buildHeaders(config, user), Prefer: 'return=minimal' },
  });
  if (!res.ok) throw new Error('クラウド保存データの削除に失敗しました。');
}
