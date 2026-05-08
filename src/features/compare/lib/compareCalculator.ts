import { calculateBuildScore } from '@/lib/score';
import { sampleScoreConfig } from '@/lib/score/sampleConfig';
import type { BuildScoreResult, Rank, SlotType, StatKey } from '@/lib/score/types';

export type CompareBuildForm = {
  roleId: string;
  characterId: string;
  slot: SlotType;
  mainStatKey: StatKey;
  mainStatValue: string;
  subStats: Array<{ key: StatKey; value: string }>;
};

export type CompareBreakdown = {
  main: number;
  sub: number;
  set: number;
  effect: number;
};

export type CompareResult = {
  resultA: BuildScoreResult;
  resultB: BuildScoreResult;
  breakdownA: CompareBreakdown;
  breakdownB: CompareBreakdown;
  scoreDiff: number;
  rankDiffLabel: string;
  breakdownDiff: CompareBreakdown;
};

const RANK_ORDER: Rank[] = ['D', 'C', 'C+', 'B', 'B+', 'A', 'A+', 'S', 'S+', 'SS'];

export function validateCompareForm(form: CompareBuildForm): string[] {
  const errors: string[] = [];
  if (form.mainStatValue.trim().length === 0) errors.push('メインステータス値は必須です。');
  if (Number(form.mainStatValue) < 0) errors.push('メインステータス値は0以上で入力してください。');
  form.subStats.forEach((sub, index) => {
    if (sub.value.trim().length === 0) return;
    if (Number(sub.value) < 0) errors.push(`サブステータス${index + 1}は0以上で入力してください。`);
  });
  return errors;
}

export function calculateCompareResult(formA: CompareBuildForm, formB: CompareBuildForm): CompareResult | null {
  const resultA = toBuildScore(formA);
  const resultB = toBuildScore(formB);
  if (!resultA || !resultB) return null;

  const breakdownA = getBreakdown(resultA, formA.slot);
  const breakdownB = getBreakdown(resultB, formB.slot);

  return {
    resultA,
    resultB,
    breakdownA,
    breakdownB,
    scoreDiff: resultB.buildScoreNormalized - resultA.buildScoreNormalized,
    rankDiffLabel: toRankDiffLabel(resultA.rank, resultB.rank),
    breakdownDiff: {
      main: breakdownB.main - breakdownA.main,
      sub: breakdownB.sub - breakdownA.sub,
      set: breakdownB.set - breakdownA.set,
      effect: breakdownB.effect - breakdownA.effect,
    },
  };
}

function toBuildScore(form: CompareBuildForm): BuildScoreResult | null {
  const mainValue = Number(form.mainStatValue);
  if (Number.isNaN(mainValue)) return null;

  const parsedSubStats = form.subStats
    .filter((sub) => sub.value.trim().length > 0)
    .map((sub) => ({ key: sub.key, value: Number(sub.value) }))
    .filter((sub) => !Number.isNaN(sub.value));

  return calculateBuildScore(
    {
      roleId: form.roleId,
      characterId: form.characterId || undefined,
      equipmentsBySlot: {
        [form.slot]: {
          slot: form.slot,
          mainStatKey: form.mainStatKey,
          mainStatValue: mainValue,
          subStats: parsedSubStats,
        },
      },
    },
    sampleScoreConfig,
  );
}

function getBreakdown(result: BuildScoreResult, slot: SlotType): CompareBreakdown {
  const score = result.equipmentScoresBySlot[slot];
  return { main: score.mainScore, sub: score.subScore, set: score.setBonusScore, effect: score.equipmentEffectScore };
}

function toRankDiffLabel(rankA: Rank, rankB: Rank): string {
  const diff = RANK_ORDER.indexOf(rankB) - RANK_ORDER.indexOf(rankA);
  if (diff === 0) return '同ランク';
  return diff > 0 ? `+${diff} 段階` : `${diff} 段階`;
}
