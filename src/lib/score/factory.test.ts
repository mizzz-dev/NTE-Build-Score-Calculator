import { describe, expect, it } from 'vitest';
import type { PublicMasterData } from '@/features/public-master/types';
import { createScoreConfigFromPublicMaster } from './factory';

const baseData: PublicMasterData = {
  roles: [{ id: 'r1', code: 'dps', displayName: 'DPS', sortOrder: 0 }],
  characters: [{ id: 'c0', slug: 'default', displayName: '共通', sortOrder: 0 }, { id: 'c1', slug: 'alice', displayName: 'Alice', sortOrder: 1 }],
  statuses: [{ id: 's1', code: 'crit_rate', displayName: '会心率', unit: '%', statKind: 'percent', sortOrder: 0 }],
  scoreWeights: [{ id: 'w1', profileKey: 'global-sub', characterSlug: null, roleCode: null, statCode: 'crit_rate', weight: '1.9', startsAt: null, endsAt: null, updatedAt: null }],
};

describe('ScoreConfigFactory', () => {
  it('公開マスタから ScoreConfig を生成できる', () => {
    const result = createScoreConfigFromPublicMaster(baseData);
    expect(result.usedFallback).toBe(false);
    expect(result.config.defaultProfile.subStat.weights.crit_rate).toBe(1.9);
    expect(result.config.roleProfiles?.[0]?.roleId).toBe('dps');
    expect(result.config.characterProfiles?.[0]?.characterId).toBe('alice');
  });

  it('ロール不足でfallbackする', () => {
    const result = createScoreConfigFromPublicMaster({ ...baseData, roles: [] });
    expect(result.usedFallback).toBe(true);
    expect(result.warnings[0]?.code).toBe('FALLBACK_ROLES_MISSING');
  });

  it('ステータス不足でfallbackする', () => {
    const result = createScoreConfigFromPublicMaster({ ...baseData, statuses: [] });
    expect(result.usedFallback).toBe(true);
    expect(result.warnings[0]?.code).toBe('FALLBACK_STATUSES_MISSING');
  });

  it('スコア重み不足でfallbackする', () => {
    const result = createScoreConfigFromPublicMaster({ ...baseData, scoreWeights: [] });
    expect(result.usedFallback).toBe(true);
    expect(result.warnings[0]?.code).toBe('FALLBACK_SCORE_WEIGHTS_MISSING');
  });

  it('不正重みでfallbackする', () => {
    const result = createScoreConfigFromPublicMaster({ ...baseData, scoreWeights: [{ ...baseData.scoreWeights[0], weight: 'bad' }] });
    expect(result.usedFallback).toBe(true);
    expect(result.warnings[0]?.code).toBe('FALLBACK_INVALID_WEIGHT');
  });

  it('重みprofile mapperが各カテゴリを反映する', () => {
    const result = createScoreConfigFromPublicMaster({
      ...baseData,
      scoreWeights: [
        { id: 'w-main-match', profileKey: 'main', characterSlug: null, roleCode: null, statCode: 'main.matchBonus', weight: '12', startsAt: null, endsAt: null, updatedAt: null },
        { id: 'w-main-value', profileKey: 'main', characterSlug: null, roleCode: null, statCode: 'main.valueWeight', weight: '45', startsAt: null, endsAt: null, updatedAt: null },
        { id: 'w-sub', profileKey: 'sub', characterSlug: null, roleCode: null, statCode: 'crit_rate', weight: '2.2', startsAt: null, endsAt: null, updatedAt: null },
        { id: 'w-set', profileKey: 'set', characterSlug: null, roleCode: null, statCode: 'set.striker', weight: '9', startsAt: null, endsAt: null, updatedAt: null },
        { id: 'w-effect', profileKey: 'equipment', characterSlug: null, roleCode: null, statCode: 'effect.atk-up', weight: '6', startsAt: null, endsAt: null, updatedAt: null },
        { id: 'w-role', profileKey: 'role', characterSlug: null, roleCode: 'dps', statCode: 'crit_rate', weight: '3.3', startsAt: null, endsAt: null, updatedAt: null },
        { id: 'w-character', profileKey: 'character', characterSlug: 'alice', roleCode: null, statCode: 'crit_rate', weight: '4.4', startsAt: null, endsAt: null, updatedAt: null },
      ],
    });

    expect(result.config.defaultProfile.mainStat.matchBonus).toBe(12);
    expect(result.config.defaultProfile.mainStat.valueWeight).toBe(45);
    expect(result.config.defaultProfile.subStat.weights.crit_rate).toBe(2.2);
    expect(result.config.defaultProfile.setBonusRules.some((rule) => rule.setId === 'striker' && rule.score === 9)).toBe(true);
    expect(result.config.defaultProfile.equipmentEffectRules.some((rule) => rule.effectId === 'atk-up' && rule.score === 6)).toBe(true);
    expect(result.config.roleProfiles?.find((profile) => profile.roleId === 'dps')?.subStat.weights.crit_rate).toBe(3.3);
    expect(result.config.characterProfiles?.find((profile) => profile.characterId === 'alice')?.subStat.weights.crit_rate).toBe(4.4);
  });
});
