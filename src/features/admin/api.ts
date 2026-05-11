import { getSupabaseClientConfig } from '@/lib/supabase/config';
import type { AuthUser } from '@/features/auth/types';
import type { AdminContentItem, AdminContentKind, AdminDashboardData, AdminRole } from './types';

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

const CONTENT_TABLES: Record<AdminContentKind, string> = {
  faqs: ADMIN_TABLES.faqs,
  announcements: ADMIN_TABLES.announcements,
  updateHistories: ADMIN_TABLES.updateHistories,
};

type ContentRow = {
  id: string;
  title?: string;
  body?: string;
  is_published?: boolean;
  display_order?: number;
  published_at?: string | null;
  updated_at?: string | null;
};

async function fetchAdminRole(user: AuthUser): Promise<AdminRole | null> {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) return null;

  const response = await fetch(`${config.url}/rest/v1/user_roles?select=role&user_id=eq.${encodeURIComponent(user.id)}&revoked_at=is.null&limit=1`, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${user.accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;

  const rows = (await response.json()) as Array<{ role?: string }>;
  const role = rows[0]?.role;
  if (role === 'admin' || role === 'editor' || role === 'viewer') return role;

  return null;
}

async function fetchCount(table: string, user: AuthUser): Promise<number> {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) return 0;

  const response = await fetch(`${config.url}/rest/v1/${table}?select=id`, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${user.accessToken}`,
      Prefer: 'count=exact',
    },
    cache: 'no-store',
  });

  if (!response.ok) return 0;

  const countHeader = response.headers.get('content-range');
  const total = countHeader?.split('/')[1];
  return total ? Number(total) || 0 : 0;
}

function mapContentRow(row: ContentRow): AdminContentItem {
  return {
    id: row.id,
    title: row.title ?? '',
    body: row.body ?? '',
    isPublished: Boolean(row.is_published),
    displayOrder: Number.isFinite(row.display_order) ? (row.display_order as number) : 0,
    publishedAt: row.published_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

function authHeaders(user: AuthUser, includePrefer?: string): HeadersInit {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) return {};

  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${user.accessToken}`,
    'Content-Type': 'application/json',
    ...(includePrefer ? { Prefer: includePrefer } : {}),
  };
}

export async function fetchAdminAccessAndDashboard(user: AuthUser): Promise<{ role: AdminRole | null; data: AdminDashboardData | null }> {
  const role = await fetchAdminRole(user);
  if (!role) return { role: null, data: null };

  const [characters, roles, statuses, scoreWeights, faqs, announcements, updateHistories, auditLogs] = await Promise.all([
    fetchCount(ADMIN_TABLES.characters, user),
    fetchCount(ADMIN_TABLES.roles, user),
    fetchCount(ADMIN_TABLES.statuses, user),
    fetchCount(ADMIN_TABLES.scoreWeights, user),
    fetchCount(ADMIN_TABLES.faqs, user),
    fetchCount(ADMIN_TABLES.announcements, user),
    fetchCount(ADMIN_TABLES.updateHistories, user),
    role === 'admin' ? fetchCount(ADMIN_TABLES.auditLogs, user) : Promise.resolve(null),
  ]);

  return {
    role,
    data: { characters, roles, statuses, scoreWeights, faqs, announcements, updateHistories, auditLogs },
  };
}

export async function fetchAdminContentList(user: AuthUser, kind: AdminContentKind): Promise<AdminContentItem[]> {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) return [];

  const table = CONTENT_TABLES[kind];
  const query = `select=id,title,body,is_published,display_order,published_at,updated_at&order=display_order.asc.nullslast,updated_at.desc.nullslast`;
  const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, {
    headers: authHeaders(user),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error('一覧の取得に失敗しました');

  const rows = (await response.json()) as ContentRow[];
  return rows.map(mapContentRow);
}

export async function createAdminContent(user: AuthUser, kind: AdminContentKind, payload: Omit<AdminContentItem, 'id' | 'updatedAt'>): Promise<void> {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) throw new Error('Supabase設定がありません');

  const table = CONTENT_TABLES[kind];
  const response = await fetch(`${config.url}/rest/v1/${table}`, {
    method: 'POST',
    headers: authHeaders(user),
    body: JSON.stringify({
      title: payload.title,
      body: payload.body,
      is_published: payload.isPublished,
      display_order: payload.displayOrder,
      published_at: payload.publishedAt,
    }),
  });

  if (!response.ok) throw new Error('新規作成に失敗しました');
}

export async function updateAdminContent(user: AuthUser, kind: AdminContentKind, payload: Omit<AdminContentItem, 'updatedAt'>): Promise<void> {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) throw new Error('Supabase設定がありません');

  const table = CONTENT_TABLES[kind];
  const response = await fetch(`${config.url}/rest/v1/${table}?id=eq.${encodeURIComponent(payload.id)}`, {
    method: 'PATCH',
    headers: authHeaders(user),
    body: JSON.stringify({
      title: payload.title,
      body: payload.body,
      is_published: payload.isPublished,
      display_order: payload.displayOrder,
      published_at: payload.publishedAt,
    }),
  });

  if (!response.ok) throw new Error('更新に失敗しました');
}

export async function deleteAdminContent(user: AuthUser, kind: AdminContentKind, id: string): Promise<void> {
  const config = getSupabaseClientConfig();
  if (!config || !user.accessToken) throw new Error('Supabase設定がありません');

  const table = CONTENT_TABLES[kind];
  const response = await fetch(`${config.url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(user),
  });

  if (!response.ok) throw new Error('削除に失敗しました');
}
