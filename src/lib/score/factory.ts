import type { PublicMasterData, PublicMasterScoreWeight } from '@/features/public-master/types';
import { sampleScoreConfig } from './sampleConfig';
import type { ScoreConfig, ScoreProfile, StatKey, SlotType } from './types';

const SLOT_TYPES: SlotType[] = ['cartridge', 'module', 'gear', 'console'];

export type ScoreConfigFactoryWarningCode =
  | 'FALLBACK_ROLES_MISSING'
  | 'FALLBACK_STATUSES_MISSING'
  | 'FALLBACK_SCORE_WEIGHTS_MISSING'
  | 'FALLBACK_INVALID_WEIGHT';

export type ScoreConfigFactoryWarning = { code: ScoreConfigFactoryWarningCode; message: string };
export type ScoreConfigFactoryResult = { config: ScoreConfig; warnings: ScoreConfigFactoryWarning[]; usedFallback: boolean };

function cloneSampleConfig(): ScoreConfig {
  return JSON.parse(JSON.stringify(sampleScoreConfig)) as ScoreConfig;
}

function parseWeight(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

function applyStatWeight(base: ScoreProfile, statCode: string, weight: number): void {
  if (statCode.startsWith('main.slot.')) {
    const [, , slotName] = statCode.split('.');
    if (slotName && SLOT_TYPES.includes(slotName as SlotType)) {
      base.mainStat.allowedMainStatsBySlot[slotName as SlotType] = [base.mainStat.allowedMainStatsBySlot[slotName as SlotType]?.[0] ?? statCode];
    }
    return;
  }
  if (statCode === 'main.matchBonus') {
    base.mainStat.matchBonus = weight;
    return;
  }
  if (statCode === 'main.mismatchBonus') {
    base.mainStat.mismatchBonus = weight;
    return;
  }
  if (statCode === 'main.valueWeight') {
    base.mainStat.valueWeight = weight;
    return;
  }
  if (statCode === 'sub.scale') {
    base.subStat.scale = weight;
    return;
  }
  if (statCode.startsWith('set.')) {
    const setId = statCode.replace('set.', '');
    base.setBonusRules.push({ ruleId: `set-${setId}`, setId, requiredPieces: 1, score: weight, stackPolicy: 'none' });
    return;
  }
  if (statCode.startsWith('effect.')) {
    const effectId = statCode.replace('effect.', '');
    base.equipmentEffectRules.push({ ruleId: `effect-${effectId}`, effectId, score: weight, stackPolicy: 'none' });
    return;
  }

  base.subStat.weights[statCode as StatKey] = weight;
}

function applyProfileWeights(base: ScoreProfile, weights: PublicMasterScoreWeight[]): void {
  for (const weightRow of weights) {
    const parsedWeight = parseWeight(weightRow.weight);
    if (parsedWeight == null) continue;
    applyStatWeight(base, weightRow.statCode, parsedWeight);
  }
}

export function createScoreConfigFromPublicMaster(data: PublicMasterData): ScoreConfigFactoryResult {
  const warnings: ScoreConfigFactoryWarning[] = [];

  if (data.roles.length === 0) {
    return { config: cloneSampleConfig(), warnings: [{ code: 'FALLBACK_ROLES_MISSING', message: 'ロール不足のため sampleScoreConfig にフォールバックしました。' }], usedFallback: true };
  }
  if (data.statuses.length === 0) {
    return { config: cloneSampleConfig(), warnings: [{ code: 'FALLBACK_STATUSES_MISSING', message: 'ステータス不足のため sampleScoreConfig にフォールバックしました。' }], usedFallback: true };
  }
  if (data.scoreWeights.length === 0) {
    return { config: cloneSampleConfig(), warnings: [{ code: 'FALLBACK_SCORE_WEIGHTS_MISSING', message: 'スコア重み不足のため sampleScoreConfig にフォールバックしました。' }], usedFallback: true };
  }

  const invalidWeight = data.scoreWeights.some((row) => parseWeight(row.weight) == null);
  if (invalidWeight) {
    return { config: cloneSampleConfig(), warnings: [{ code: 'FALLBACK_INVALID_WEIGHT', message: '不正な重み値のため sampleScoreConfig にフォールバックしました。' }], usedFallback: true };
  }

  const config = cloneSampleConfig();
  const defaultProfile = JSON.parse(JSON.stringify(sampleScoreConfig.defaultProfile)) as ScoreProfile;
  defaultProfile.profileId = 'public-default';
  defaultProfile.roleId = undefined;
  defaultProfile.characterId = undefined;
  defaultProfile.setBonusRules = [];
  defaultProfile.equipmentEffectRules = [];

  const globalRows = data.scoreWeights.filter((row) => !row.roleCode && !row.characterSlug);
  applyProfileWeights(defaultProfile, globalRows);

  const roleProfiles = data.roles.map((role) => {
    const profile = JSON.parse(JSON.stringify(defaultProfile)) as ScoreProfile;
    profile.profileId = `public-role-${role.code}`;
    profile.roleId = role.code;
    profile.characterId = undefined;
    applyProfileWeights(profile, data.scoreWeights.filter((row) => row.roleCode === role.code && !row.characterSlug));
    return profile;
  });

  const characterProfiles = data.characters
    .filter((character) => character.slug !== 'default')
    .map((character) => {
      const profile = JSON.parse(JSON.stringify(defaultProfile)) as ScoreProfile;
      profile.profileId = `public-character-${character.slug}`;
      profile.characterId = character.slug;
      profile.roleId = undefined;
      applyProfileWeights(profile, data.scoreWeights.filter((row) => row.characterSlug === character.slug));
      return profile;
    });

  config.defaultProfile = defaultProfile;
  config.roleProfiles = roleProfiles;
  config.characterProfiles = characterProfiles;

  return { config, warnings, usedFallback: false };
}
