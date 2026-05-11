export type PublicMasterCharacter = { id: string; slug: string; displayName: string; sortOrder: number };
export type PublicMasterRole = { id: string; code: string; displayName: string; sortOrder: number };
export type PublicMasterStatus = { id: string; code: string; displayName: string; unit: string | null; statKind: 'fixed' | 'percent'; sortOrder: number };
export type PublicMasterScoreWeight = { id: string; profileKey: string; characterSlug: string | null; roleCode: string | null; statCode: string; weight: string; startsAt: string | null; endsAt: string | null; updatedAt: string | null };

export type PublicMasterData = {
  characters: PublicMasterCharacter[];
  roles: PublicMasterRole[];
  statuses: PublicMasterStatus[];
  scoreWeights: PublicMasterScoreWeight[];
};

export type PublicMasterLoadResult = {
  data: PublicMasterData;
  source: 'remote' | 'fallback';
  warning: string | null;
};
