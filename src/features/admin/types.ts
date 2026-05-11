export const ADMIN_ROLES = ['admin', 'editor', 'viewer'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export type AdminAccessState =
  | { kind: 'disabled' }
  | { kind: 'signed_out' }
  | { kind: 'forbidden' }
  | { kind: 'authorized'; role: AdminRole };

export type AdminDashboardData = {
  characters: number;
  roles: number;
  statuses: number;
  scoreWeights: number;
  faqs: number;
  announcements: number;
  updateHistories: number;
  auditLogs: number | null;
};
