export type StatKey = string;
export type SlotType = 'cartridge' | 'module' | 'gear' | 'console';
export type Rank = 'D' | 'C' | 'C+' | 'B' | 'B+' | 'A' | 'A+' | 'S' | 'S+' | 'SS';
export type StackPolicy = 'none' | 'additive' | 'maxOnly';
export interface StatRange { min: number; max: number; valueType: 'flat' | 'percent' }
export interface MainStatRule { allowedMainStatsBySlot: Record<SlotType, StatKey[]>; matchBonus: number; mismatchBonus: number; valueWeight: number }
export interface SubStatRule { weights: Record<StatKey, number>; scale: number }
export interface SetBonusRule { ruleId: string; setId: string; requiredPieces: number; score: number; stackPolicy: StackPolicy }
export interface EquipmentEffectRule { ruleId: string; effectId: string; score: number; stackPolicy: StackPolicy }
export interface RankThreshold { rank: Rank; minScore: number }
export interface ScoreProfile { profileId: string; roleId?: string; characterId?: string; mainStat: MainStatRule; subStat: SubStatRule; slotWeights: Record<SlotType, number>; missingSlotPenalty: number; referenceMaxScore: number; setBonusRules: SetBonusRule[]; equipmentEffectRules: EquipmentEffectRule[]; rankThresholds: RankThreshold[]; configVersion: string }
export interface EquipmentInput { slot: SlotType; mainStatKey: StatKey; mainStatValue: number; subStats: Array<{ key: StatKey; value: number }>; setId?: string; effectIds?: string[] }
export interface BuildInput { characterId?: string; roleId?: string; equipmentsBySlot: Partial<Record<SlotType, EquipmentInput>>; setPieceCountBySetId?: Record<string, number> }
export interface ScoreWarning { code: 'RANGE_INVALID'|'RANGE_MISSING'|'UNKNOWN_STAT'|'UNKNOWN_SUBSTAT_WEIGHT'|'CONFIG_VERSION_MISMATCH'; message: string }
export interface ScoreConfig { defaultProfile: ScoreProfile; roleProfiles?: ScoreProfile[]; characterProfiles?: ScoreProfile[]; statRanges: Record<StatKey, StatRange>; expectedConfigVersion: string }
export interface EquipmentScoreResult { scoreRaw: number; mainScore: number; subScore: number; setBonusScore: number; equipmentEffectScore: number; warnings: ScoreWarning[] }
export interface BuildScoreResult { profile: ScoreProfile; equipmentScoresBySlot: Record<SlotType, EquipmentScoreResult>; buildScoreRaw: number; buildScoreNormalized: number; rank: Rank; warnings: ScoreWarning[] }
