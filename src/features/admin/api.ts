import { getSupabaseClientConfig } from '@/lib/supabase/config';
import type { AuthUser } from '@/features/auth/types';
import type { AdminContentItem, AdminContentKind, AdminDashboardData, AdminMasterItem, AdminMasterKind, AdminRole, AdminScoreWeightItem, AdminScoreWeightProfileKind, AdminStatKind } from './types';

const ADMIN_TABLES = {
  characters: 'admin_characters',
  roles: 'admin_roles_master',
  statuses: 'admin_stats',
  scoreWeights: 'admin_score_weights',
  faqs: 'admin_faqs',
  announcements: 'admin_announcements',
  updateHistories: 'admin_update_histories',
  auditLogs: 'admin_audit_logs',
} as const;
const CONTENT_TABLES: Record<AdminContentKind, string> = { faqs: ADMIN_TABLES.faqs, announcements: ADMIN_TABLES.announcements, updateHistories: ADMIN_TABLES.updateHistories };
const MASTER_TABLES: Record<AdminMasterKind, string> = { characters: ADMIN_TABLES.characters, roles: ADMIN_TABLES.roles, statuses: ADMIN_TABLES.statuses };

type ContentRow = { id: string; title?: string; body?: string; is_published?: boolean; is_public?: boolean; display_order?: number; sort_order?: number; published_at?: string | null; updated_at?: string | null; question?: string; answer?: string; version_label?: string; summary?: string; };
type MasterRow = { id: string; slug?: string; code?: string; display_name?: string; sort_order?: number; is_active?: boolean; unit?: string | null; stat_kind?: AdminStatKind | null; };
type ScoreWeightRow = { id: string; profile_key?: string; character_slug?: string | null; role_code?: string | null; stat_code?: string; weight?: number | string; starts_at?: string | null; ends_at?: string | null; updated_at?: string | null; is_public?: boolean; };

const SCORE_WEIGHT_PROFILE_PREFIX: Record<AdminScoreWeightProfileKind, string> = {
  main: 'main',
  sub: 'sub',
  set: 'set',
  equipment: 'equipment',
};

async function fetchAdminRole(user: AuthUser): Promise<AdminRole | null> { const config = getSupabaseClientConfig(); if (!config || !user.accessToken) return null; const response = await fetch(`${config.url}/rest/v1/user_roles?select=role&user_id=eq.${encodeURIComponent(user.id)}&revoked_at=is.null&limit=1`, { headers: { apikey: config.anonKey, Authorization: `Bearer ${user.accessToken}` }, cache: 'no-store' }); if (!response.ok) return null; const rows = (await response.json()) as Array<{ role?: string }>; const role = rows[0]?.role; return role === 'admin' || role === 'editor' || role === 'viewer' ? role : null; }
async function fetchCount(table: string, user: AuthUser): Promise<number> { const config = getSupabaseClientConfig(); if (!config || !user.accessToken) return 0; const response = await fetch(`${config.url}/rest/v1/${table}?select=id`, { headers: { apikey: config.anonKey, Authorization: `Bearer ${user.accessToken}`, Prefer: 'count=exact' }, cache: 'no-store' }); if (!response.ok) return 0; const total = response.headers.get('content-range')?.split('/')[1]; return total ? Number(total) || 0 : 0; }

function mapContentRow(row: ContentRow, kind: AdminContentKind): AdminContentItem {
  if (kind === 'faqs') return { id: row.id, title: row.question ?? '', body: row.answer ?? '', isPublished: Boolean(row.is_public), displayOrder: row.sort_order ?? 0, publishedAt: row.published_at ?? null, updatedAt: row.updated_at ?? null };
  if (kind === 'updateHistories') return { id: row.id, title: row.version_label ?? '', body: row.summary ?? '', isPublished: Boolean(row.is_public), displayOrder: row.sort_order ?? 0, publishedAt: row.published_at ?? null, updatedAt: row.updated_at ?? null };
  return { id: row.id, title: row.title ?? '', body: row.body ?? '', isPublished: Boolean(row.is_public ?? row.is_published), displayOrder: row.sort_order ?? row.display_order ?? 0, publishedAt: row.published_at ?? null, updatedAt: row.updated_at ?? null };
}
function mapMasterRow(kind: AdminMasterKind, row: MasterRow): AdminMasterItem { return { id: row.id, key: kind === 'characters' ? row.slug ?? '' : row.code ?? '', displayName: row.display_name ?? '', sortOrder: row.sort_order ?? 0, isActive: Boolean(row.is_active), unit: kind === 'statuses' ? row.unit ?? null : null, statKind: kind === 'statuses' ? row.stat_kind ?? 'fixed' : null }; }
function mapProfileKey(rawProfileKey: string | undefined): { profileKind: AdminScoreWeightProfileKind; priority: number } {
  const value = rawProfileKey ?? '';
  const [prefix, priorityRaw] = value.split(':');
  const profileKind = (Object.values(SCORE_WEIGHT_PROFILE_PREFIX).includes(prefix as AdminScoreWeightProfileKind) ? prefix : 'main') as AdminScoreWeightProfileKind;
  const priority = Number(priorityRaw ?? '0');
  return { profileKind, priority: Number.isInteger(priority) ? priority : 0 };
}
function buildProfileKey(profileKind: AdminScoreWeightProfileKind, priority: number): string {
  return `${SCORE_WEIGHT_PROFILE_PREFIX[profileKind]}:${priority}`;
}
function authHeaders(user: AuthUser): HeadersInit { const config = getSupabaseClientConfig(); if (!config || !user.accessToken) return {}; return { apikey: config.anonKey, Authorization: `Bearer ${user.accessToken}`, 'Content-Type': 'application/json' }; }

export async function fetchAdminAccessAndDashboard(user: AuthUser): Promise<{ role: AdminRole | null; data: AdminDashboardData | null }> { const role = await fetchAdminRole(user); if (!role) return { role: null, data: null }; const [characters, roles, statuses, scoreWeights, faqs, announcements, updateHistories, auditLogs] = await Promise.all([fetchCount(ADMIN_TABLES.characters, user), fetchCount(ADMIN_TABLES.roles, user), fetchCount(ADMIN_TABLES.statuses, user), fetchCount(ADMIN_TABLES.scoreWeights, user), fetchCount(ADMIN_TABLES.faqs, user), fetchCount(ADMIN_TABLES.announcements, user), fetchCount(ADMIN_TABLES.updateHistories, user), role === 'admin' ? fetchCount(ADMIN_TABLES.auditLogs, user) : Promise.resolve(null)]); return { role, data: { characters, roles, statuses, scoreWeights, faqs, announcements, updateHistories, auditLogs } }; }

export async function fetchAdminContentList(user: AuthUser, kind: AdminContentKind): Promise<AdminContentItem[]> { const config = getSupabaseClientConfig(); if (!config || !user.accessToken) return []; const response = await fetch(`${config.url}/rest/v1/${CONTENT_TABLES[kind]}?select=*`, { headers: authHeaders(user), cache: 'no-store' }); if (!response.ok) throw new Error('一覧の取得に失敗しました'); const rows = (await response.json()) as ContentRow[]; return rows.map((row) => mapContentRow(row, kind)); }
export async function createAdminContent(user: AuthUser, kind: AdminContentKind, payload: Omit<AdminContentItem, 'id' | 'updatedAt'>): Promise<void> { const config = getSupabaseClientConfig(); if (!config || !user.accessToken) throw new Error('Supabase設定がありません'); const body = kind === 'faqs' ? { question: payload.title, answer: payload.body, sort_order: payload.displayOrder, is_public: payload.isPublished, published_at: payload.publishedAt } : kind === 'updateHistories' ? { version_label: payload.title, summary: payload.body, details: {}, is_public: payload.isPublished, published_at: payload.publishedAt } : { title: payload.title, body: payload.body, is_public: payload.isPublished, published_at: payload.publishedAt }; const response = await fetch(`${config.url}/rest/v1/${CONTENT_TABLES[kind]}`, { method: 'POST', headers: authHeaders(user), body: JSON.stringify(body) }); if (!response.ok) throw new Error('新規作成に失敗しました'); }
export async function updateAdminContent(user: AuthUser, kind: AdminContentKind, payload: Omit<AdminContentItem, 'updatedAt'>): Promise<void> { const config = getSupabaseClientConfig(); if (!config || !user.accessToken) throw new Error('Supabase設定がありません'); const body = kind === 'faqs' ? { question: payload.title, answer: payload.body, sort_order: payload.displayOrder, is_public: payload.isPublished, published_at: payload.publishedAt } : kind === 'updateHistories' ? { version_label: payload.title, summary: payload.body, is_public: payload.isPublished, published_at: payload.publishedAt } : { title: payload.title, body: payload.body, is_public: payload.isPublished, published_at: payload.publishedAt }; const response = await fetch(`${config.url}/rest/v1/${CONTENT_TABLES[kind]}?id=eq.${encodeURIComponent(payload.id)}`, { method: 'PATCH', headers: authHeaders(user), body: JSON.stringify(body) }); if (!response.ok) throw new Error('更新に失敗しました'); }
export async function deleteAdminContent(user: AuthUser, kind: AdminContentKind, id: string): Promise<void> { const config = getSupabaseClientConfig(); if (!config || !user.accessToken) throw new Error('Supabase設定がありません'); const response = await fetch(`${config.url}/rest/v1/${CONTENT_TABLES[kind]}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', headers: authHeaders(user) }); if (!response.ok) throw new Error('削除に失敗しました'); }

export async function fetchAdminMasterList(user: AuthUser, kind: AdminMasterKind): Promise<AdminMasterItem[]> { const config = getSupabaseClientConfig(); if (!config || !user.accessToken) return []; const response = await fetch(`${config.url}/rest/v1/${MASTER_TABLES[kind]}?select=*&order=sort_order.asc,updated_at.desc`, { headers: authHeaders(user), cache: 'no-store' }); if (!response.ok) throw new Error('一覧の取得に失敗しました'); const rows = (await response.json()) as MasterRow[]; return rows.map((row) => mapMasterRow(kind, row)); }
export async function createAdminMasterItem(user: AuthUser, kind: AdminMasterKind, payload: Omit<AdminMasterItem, 'id'>): Promise<void> { const config = getSupabaseClientConfig(); if (!config || !user.accessToken) throw new Error('Supabase設定がありません'); const body = kind === 'characters' ? { slug: payload.key, display_name: payload.displayName, sort_order: payload.sortOrder, is_active: payload.isActive } : kind === 'roles' ? { code: payload.key, display_name: payload.displayName, sort_order: payload.sortOrder, is_active: payload.isActive } : { code: payload.key, display_name: payload.displayName, sort_order: payload.sortOrder, is_active: payload.isActive, unit: payload.unit, stat_kind: payload.statKind ?? 'fixed' }; const response = await fetch(`${config.url}/rest/v1/${MASTER_TABLES[kind]}`, { method: 'POST', headers: authHeaders(user), body: JSON.stringify(body) }); if (!response.ok) throw new Error('作成に失敗しました'); }
export async function updateAdminMasterItem(user: AuthUser, kind: AdminMasterKind, payload: AdminMasterItem): Promise<void> { const config = getSupabaseClientConfig(); if (!config || !user.accessToken) throw new Error('Supabase設定がありません'); const body = { display_name: payload.displayName, sort_order: payload.sortOrder, is_active: payload.isActive, ...(kind === 'statuses' ? { unit: payload.unit, stat_kind: payload.statKind ?? 'fixed' } : {}) }; const response = await fetch(`${config.url}/rest/v1/${MASTER_TABLES[kind]}?id=eq.${encodeURIComponent(payload.id)}`, { method: 'PATCH', headers: authHeaders(user), body: JSON.stringify(body) }); if (!response.ok) throw new Error('更新に失敗しました'); }
export async function deleteAdminMasterItem(user: AuthUser, kind: AdminMasterKind, id: string): Promise<void> { const config = getSupabaseClientConfig(); if (!config || !user.accessToken) throw new Error('Supabase設定がありません'); const response = await fetch(`${config.url}/rest/v1/${MASTER_TABLES[kind]}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', headers: authHeaders(user) }); if (!response.ok) throw new Error('削除に失敗しました'); }

export async function fetchAdminScoreWeightList(user: AuthUser): Promise<AdminScoreWeightItem[]> {
  const config = getSupabaseClientConfig(); if (!config || !user.accessToken) return [];
  const response = await fetch(`${config.url}/rest/v1/${ADMIN_TABLES.scoreWeights}?select=*&order=updated_at.desc`, { headers: authHeaders(user), cache: 'no-store' });
  if (!response.ok) throw new Error('一覧の取得に失敗しました');
  const rows = (await response.json()) as ScoreWeightRow[];
  return rows.map((row) => {
    const mapped = mapProfileKey(row.profile_key);
    return { id: row.id, profileKey: row.profile_key ?? '', profileKind: mapped.profileKind, priority: mapped.priority, characterSlug: row.character_slug ?? null, roleCode: row.role_code ?? null, statCode: row.stat_code ?? '', weight: String(row.weight ?? '0'), isPublic: Boolean(row.is_public), startsAt: row.starts_at ?? null, endsAt: row.ends_at ?? null, updatedAt: row.updated_at ?? null };
  });
}
export async function createAdminScoreWeight(user: AuthUser, payload: Omit<AdminScoreWeightItem, 'id' | 'profileKey' | 'updatedAt'>): Promise<void> {
  const config = getSupabaseClientConfig(); if (!config || !user.accessToken) throw new Error('Supabase設定がありません');
  const body = { profile_key: buildProfileKey(payload.profileKind, payload.priority), character_slug: payload.characterSlug, role_code: payload.roleCode, stat_code: payload.statCode, weight: payload.weight, is_public: payload.isPublic, starts_at: payload.startsAt, ends_at: payload.endsAt };
  const response = await fetch(`${config.url}/rest/v1/${ADMIN_TABLES.scoreWeights}`, { method: 'POST', headers: authHeaders(user), body: JSON.stringify(body) });
  if (!response.ok) throw new Error('作成に失敗しました');
}
export async function updateAdminScoreWeight(user: AuthUser, payload: Omit<AdminScoreWeightItem, 'profileKey' | 'updatedAt'>): Promise<void> {
  const config = getSupabaseClientConfig(); if (!config || !user.accessToken) throw new Error('Supabase設定がありません');
  const body = { profile_key: buildProfileKey(payload.profileKind, payload.priority), character_slug: payload.characterSlug, role_code: payload.roleCode, stat_code: payload.statCode, weight: payload.weight, is_public: payload.isPublic, starts_at: payload.startsAt, ends_at: payload.endsAt };
  const response = await fetch(`${config.url}/rest/v1/${ADMIN_TABLES.scoreWeights}?id=eq.${encodeURIComponent(payload.id)}`, { method: 'PATCH', headers: authHeaders(user), body: JSON.stringify(body) });
  if (!response.ok) throw new Error('更新に失敗しました');
}
export async function deleteAdminScoreWeight(user: AuthUser, id: string): Promise<void> {
  const config = getSupabaseClientConfig(); if (!config || !user.accessToken) throw new Error('Supabase設定がありません');
  const response = await fetch(`${config.url}/rest/v1/${ADMIN_TABLES.scoreWeights}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', headers: authHeaders(user) });
  if (!response.ok) throw new Error('削除に失敗しました');
}
