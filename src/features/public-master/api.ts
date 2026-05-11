import { getSupabaseClientConfig } from '@/lib/supabase/config';
import { sampleScoreConfig } from '@/lib/score/sampleConfig';
import type { StatKey } from '@/lib/score/types';
import type { PublicMasterCharacter, PublicMasterData, PublicMasterLoadResult, PublicMasterRole, PublicMasterScoreWeight, PublicMasterStatus } from './types';

type CharacterRow = { id: string; slug?: string; display_name?: string; sort_order?: number };
type RoleRow = { id: string; code?: string; display_name?: string; sort_order?: number };
type StatusRow = { id: string; code?: string; display_name?: string; unit?: string | null; stat_kind?: 'fixed' | 'percent'; sort_order?: number };
type ScoreWeightRow = { id: string; profile_key?: string; character_slug?: string | null; role_code?: string | null; stat_code?: string; weight?: number | string; starts_at?: string | null; ends_at?: string | null; updated_at?: string | null };

const FALLBACK_ROLES: PublicMasterRole[] = [
  { id: 'fallback-role-dps', code: 'dps', displayName: 'DPS', sortOrder: 0 },
  { id: 'fallback-role-support', code: 'support', displayName: 'サポート', sortOrder: 1 },
];
const FALLBACK_CHARACTERS: PublicMasterCharacter[] = [
  { id: 'fallback-character-default', slug: 'default', displayName: '共通', sortOrder: 0 },
  { id: 'fallback-character-alice', slug: 'alice', displayName: 'Alice（要確認）', sortOrder: 1 },
  { id: 'fallback-character-bob', slug: 'bob', displayName: 'Bob（要確認）', sortOrder: 2 },
];
const FALLBACK_STATUSES: PublicMasterStatus[] = (Object.keys(sampleScoreConfig.statRanges) as StatKey[]).map((key, index) => ({
  id: `fallback-status-${key}`,
  code: key,
  displayName: key,
  unit: null,
  statKind: 'fixed',
  sortOrder: index,
}));

function buildFallbackData(): PublicMasterData {
  return { characters: FALLBACK_CHARACTERS, roles: FALLBACK_ROLES, statuses: FALLBACK_STATUSES, scoreWeights: [] };
}

async function fetchPublicRows<T>(path: string): Promise<T[]> {
  const config = getSupabaseClientConfig();
  if (!config) throw new Error('Supabase未設定');
  const response = await fetch(`${config.url}/rest/v1/${path}`, { headers: { apikey: config.anonKey }, cache: 'no-store' });
  if (!response.ok) throw new Error('公開マスタの取得に失敗しました');
  return (await response.json()) as T[];
}

export async function fetchPublicMasterData(): Promise<PublicMasterLoadResult> {
  const fallback = buildFallbackData();
  if (!getSupabaseClientConfig()) return { data: fallback, source: 'fallback', warning: 'Supabase未設定のため既存データを表示しています。' };

  try {
    const [characters, roles, statuses, scoreWeights] = await Promise.all([
      fetchPublicRows<CharacterRow>('public_characters?select=id,slug,display_name,sort_order&order=sort_order.asc,updated_at.desc'),
      fetchPublicRows<RoleRow>('public_roles?select=id,code,display_name,sort_order&order=sort_order.asc,updated_at.desc'),
      fetchPublicRows<StatusRow>('public_stats?select=id,code,display_name,unit,stat_kind,sort_order&order=sort_order.asc,updated_at.desc'),
      fetchPublicRows<ScoreWeightRow>('public_score_weights?select=id,profile_key,character_slug,role_code,stat_code,weight,starts_at,ends_at,updated_at&order=updated_at.desc'),
    ]);

    const mapped: PublicMasterData = {
      characters: characters.map((row) => ({ id: row.id, slug: row.slug ?? '', displayName: row.display_name ?? '', sortOrder: row.sort_order ?? 0 })).filter((row) => row.slug.length > 0),
      roles: roles.map((row) => ({ id: row.id, code: row.code ?? '', displayName: row.display_name ?? '', sortOrder: row.sort_order ?? 0 })).filter((row) => row.code.length > 0),
      statuses: statuses.map((row) => ({ id: row.id, code: row.code ?? '', displayName: row.display_name ?? '', unit: row.unit ?? null, statKind: row.stat_kind ?? 'fixed', sortOrder: row.sort_order ?? 0 })).filter((row) => row.code.length > 0),
      scoreWeights: scoreWeights.map((row) => ({ id: row.id, profileKey: row.profile_key ?? '', characterSlug: row.character_slug ?? null, roleCode: row.role_code ?? null, statCode: row.stat_code ?? '', weight: String(row.weight ?? '0'), startsAt: row.starts_at ?? null, endsAt: row.ends_at ?? null, updatedAt: row.updated_at ?? null })),
    };

    if (mapped.characters.length === 0 || mapped.roles.length === 0 || mapped.statuses.length === 0) {
      return { data: fallback, source: 'fallback', warning: '公開マスタが空のため既存データを表示しています。' };
    }
    return { data: mapped, source: 'remote', warning: null };
  } catch {
    return { data: fallback, source: 'fallback', warning: '公開マスタの取得に失敗したため既存データを表示しています。' };
  }
}
