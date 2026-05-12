import type { PublicMasterStatus } from '@/features/public-master/types';

export type OcrFieldConfidence = {
  value: string;
  confidence: number;
  normalizedValue?: string;
  candidates?: string[];
};

export type OcrDraftStatRow = {
  statName?: OcrFieldConfidence;
  statValue?: OcrFieldConfidence;
};

export type OcrEquipmentDraft = {
  mainStat?: OcrDraftStatRow;
  subStats: OcrDraftStatRow[];
  warnings: string[];
  sourceLocale: 'ja' | 'en' | 'ko' | 'unknown';
};

export type BrowserOcrCandidate = {
  name: string;
  runEnvironment: 'browser';
  supportsOffline: boolean;
  expectedBundleImpact: 'small' | 'medium' | 'large';
  notes: string;
};

export type OcrPocEvaluation = {
  candidate: BrowserOcrCandidate;
  status: 'adopt' | 'conditional' | 'hold' | 'reject';
  rationale: string[];
};

export type OcrMappedDraftStat = OcrDraftStatRow & {
  matchedStatus?: PublicMasterStatus;
  matchType?: 'exact' | 'normalized' | 'alias' | 'partial' | 'similar';
  confidence?: number;
  candidateStatuses?: Array<{ code: string; displayName: string; matchType: 'exact' | 'normalized' | 'alias' | 'partial' | 'similar'; confidence: number }>;
  unresolvedReason?: string;
};

export type OcrMappedDraft = {
  mainStat?: OcrMappedDraftStat;
  subStats: OcrMappedDraftStat[];
  warnings: string[];
};
