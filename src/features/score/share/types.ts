import type { SlotType, StatKey } from '@/lib/score/types';

export interface ScoreShareState {
  roleId: string;
  characterId: string;
  slot: SlotType;
  mainStatKey: StatKey;
  mainStatValue: string;
  subStats: Array<{ key: StatKey; value: string }>;
}
