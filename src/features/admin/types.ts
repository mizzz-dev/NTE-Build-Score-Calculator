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

export type AdminContentKind = 'faqs' | 'announcements' | 'updateHistories';

export type AdminContentItem = {
  id: string;
  title: string;
  body: string;
  isPublished: boolean;
  displayOrder: number;
  publishedAt: string | null;
  updatedAt: string | null;
};

export type AdminMasterKind = 'characters' | 'roles' | 'statuses';
export type AdminStatKind = 'fixed' | 'percent';
export type AdminScoreWeightProfileKind = 'main' | 'sub' | 'set' | 'equipment';
export type AdminMasterItem = {
  id: string;
  key: string;
  displayName: string;
  sortOrder: number;
  isActive: boolean;
  unit: string | null;
  statKind: AdminStatKind | null;
};

export type AdminScoreWeightItem = {
  id: string;
  profileKey: string;
  profileKind: AdminScoreWeightProfileKind;
  characterSlug: string | null;
  roleCode: string | null;
  statCode: string;
  weight: string;
  priority: number;
  isPublic: boolean;
  startsAt: string | null;
  endsAt: string | null;
  updatedAt: string | null;
};
