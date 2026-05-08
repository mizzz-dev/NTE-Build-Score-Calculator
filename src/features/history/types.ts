import type { SlotType, StatKey } from '@/lib/score/types';

export const GUEST_HISTORY_LIMIT = 20;

type HistoryKind = 'score' | 'card';

interface HistoryBase {
  id: string;
  kind: HistoryKind;
  createdAt: string;
}

interface EquipmentInputSnapshot {
  roleId: string;
  slot: SlotType;
  mainStatKey: StatKey;
  mainStatValue: number;
  subStats: Array<{ key: StatKey; value: number }>;
}

export interface ScoreHistoryEntry extends HistoryBase {
  kind: 'score';
  payload: EquipmentInputSnapshot & {
    characterId?: string;
    score: number;
    rank: string;
  };
}

export interface CardHistoryEntry extends HistoryBase {
  kind: 'card';
  payload: EquipmentInputSnapshot & {
    score: number;
    rank: string;
  };
}

export type GuestHistoryEntry = ScoreHistoryEntry | CardHistoryEntry;
