export type RankingResultKind = 'score' | 'card';

export type RankingEntry = {
  id: string;
  userId: string;
  displayName: string;
  isAnonymous: boolean;
  resultKind: RankingResultKind;
  role: string;
  equipmentType: string;
  scoreTotal: number;
  scoreRank: string;
  payloadSnapshot: Record<string, unknown>;
  createdAt: string;
};

export type RankingSort = 'score_desc' | 'created_desc';

export type RankingFilters = {
  resultKind?: RankingResultKind;
  role?: string;
  equipmentType?: string;
  scoreRank?: string;
};

export type CreateRankingPayload = {
  displayName: string;
  isAnonymous: boolean;
  resultKind: RankingResultKind;
  role: string;
  equipmentType: string;
  scoreTotal: number;
  scoreRank: string;
  payloadSnapshot: Record<string, unknown>;
};
