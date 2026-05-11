import { getSupabaseClientConfig } from '@/lib/supabase/config';
import type { AuthUser } from '@/features/auth/types';
import type { AdminDashboardData, AdminRole } from './types';

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
