import { describe, expect, it } from 'vitest';
import { sampleScoreConfig } from '@/lib/score/sampleConfig';
import { calculateCompareResult } from './compareCalculator';

const form = {
  roleId: 'dps',
  characterId: '',
  slot: 'cartridge' as const,
  mainStatKey: 'atk_percent' as const,
  mainStatValue: '40',
  subStats: [
    { key: 'crit_rate' as const, value: '7' },
    { key: 'crit_dmg' as const, value: '14' },
    { key: 'hp_flat' as const, value: '' },
  ],
};

describe('calculateCompareResult', () => {
  it('ScoreConfigを受け取って比較計算できる', () => {
    const result = calculateCompareResult(form, { ...form, mainStatValue: '45' }, sampleScoreConfig);
    expect(result).not.toBeNull();
    expect(result?.resultB.buildScoreRaw).toBeGreaterThan(result?.resultA.buildScoreRaw ?? 0);
  });

  it('fallback設定でも比較表示用の結果を返す', () => {
    const result = calculateCompareResult(form, form, sampleScoreConfig);
    expect(result).not.toBeNull();
    expect(result?.rankDiffLabel).toBe('同ランク');
  });

  it('A/Bフォーム状態(入力値)を破壊しない', () => {
    const formA = structuredClone(form);
    const formB = { ...structuredClone(form), mainStatValue: '41' };
    calculateCompareResult(formA, formB, sampleScoreConfig);
    expect(formA.mainStatValue).toBe('40');
    expect(formB.mainStatValue).toBe('41');
  });
});
