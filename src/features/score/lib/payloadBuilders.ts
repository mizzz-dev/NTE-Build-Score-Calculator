import type { SlotType, StatKey } from '@/lib/score/types';

export type ScoreInputState = {
  roleId: string;
  characterId: string;
  slot: SlotType;
  mainStatKey: StatKey;
  mainStatValue: string;
  subStats: Array<{ key: StatKey; value: string }>;
};

export function parseSubStats(subStats: Array<{ key: StatKey; value: string }>): Array<{ key: StatKey; value: number }> {
  return subStats
    .filter((sub) => sub.value.trim().length > 0)
    .map((sub) => ({ key: sub.key, value: Number(sub.value) }))
    .filter((sub) => !Number.isNaN(sub.value));
}

export function createScorePayload(input: ScoreInputState, score: number, rank: string) {
  return {
    roleId: input.roleId,
    characterId: input.characterId || undefined,
    slot: input.slot,
    mainStatKey: input.mainStatKey,
    mainStatValue: Number(input.mainStatValue),
    subStats: parseSubStats(input.subStats),
    score,
    rank,
  };
}

export function createCardPayload(input: Omit<ScoreInputState, 'characterId'>, score: number, rank: string) {
  return {
    roleId: input.roleId,
    slot: input.slot,
    mainStatKey: input.mainStatKey,
    mainStatValue: Number(input.mainStatValue),
    subStats: parseSubStats(input.subStats),
    score,
    rank,
  };
}

export function createRankingPayloadSnapshot(input: ScoreInputState, score: number, rank: string) {
  return {
    roleId: input.roleId,
    slot: input.slot,
    score,
    rank,
    mainStatKey: input.mainStatKey,
    mainStatValue: Number(input.mainStatValue),
    subStats: parseSubStats(input.subStats),
  };
}
