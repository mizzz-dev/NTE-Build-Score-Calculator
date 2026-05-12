import type { SlotType, StatKey } from '@/lib/score/types';
import type { OcrEquipmentDraft, OcrMappedDraft } from './types';

export const OCR_ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
export const OCR_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const OCR_LOW_CONFIDENCE_THRESHOLD = 0.8;

const SLOT_ALIASES: Record<SlotType, string[]> = {
  cartridge: ['cartridge', 'カートリッジ'],
  module: ['module', 'モジュール'],
  gear: ['gear', 'ギア'],
  console: ['console', 'コンソール'],
};

const STAT_ALIAS_TO_KEY: Record<string, StatKey> = {
  atk: 'atk_percent',
  'atk%': 'atk_percent',
  'attack': 'atk_percent',
  'attack%': 'atk_percent',
  '攻撃力': 'atk_percent',
  '攻撃力%': 'atk_percent',
  'crit rate': 'crit_rate',
  'critical rate': 'crit_rate',
  '会心率': 'crit_rate',
  'crit dmg': 'crit_dmg',
  'critical damage': 'crit_dmg',
  '会心ダメージ': 'crit_dmg',
  hp: 'hp_flat',
  '体力': 'hp_flat',
};

export function validateOcrImageFile(file: File): string | null {
  if (!OCR_ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof OCR_ACCEPTED_IMAGE_TYPES)[number])) return '画像形式が非対応です（PNG / JPEG / WebPのみ）。';
  if (file.size > OCR_MAX_FILE_SIZE_BYTES) return `ファイルサイズは${Math.floor(OCR_MAX_FILE_SIZE_BYTES / 1024 / 1024)}MB以下にしてください。`;
  return null;
}

export function inferSlotFromText(lines: string[]): SlotType | undefined {
  const normalized = lines.join(' ').toLowerCase();
  return (Object.entries(SLOT_ALIASES) as Array<[SlotType, string[]]>).find(([, aliases]) => aliases.some((a) => normalized.includes(a.toLowerCase())))?.[0];
}

function resolveStatKey(value?: string): StatKey | undefined {
  if (!value) return undefined;
  return STAT_ALIAS_TO_KEY[value.toLowerCase()];
}

function unresolved(value?: string, confidence?: number): boolean {
  if (!value) return true;
  return (confidence ?? 0) < OCR_LOW_CONFIDENCE_THRESHOLD;
}

export function buildScoreApplyCandidate(params: {
  draft: OcrEquipmentDraft;
  mapped: OcrMappedDraft;
  inferredSlot?: SlotType;
}) {
  const { draft, mapped, inferredSlot } = params;
  const mainKey = resolveStatKey(mapped.mainStat?.matchedStatus?.displayName ?? mapped.mainStat?.statName?.value);
  const mainValue = mapped.mainStat?.statValue?.value;

  const subStats = Array.from({ length: 3 }, (_, i) => {
    const item = mapped.subStats[i];
    return {
      key: resolveStatKey(item?.matchedStatus?.displayName ?? item?.statName?.value),
      value: item?.statValue?.value ?? '',
      requiresManual: unresolved(item?.statName?.value, item?.statName?.confidence) || unresolved(item?.statValue?.value, item?.statValue?.confidence) || Boolean(item?.unresolvedReason),
    };
  });

  return {
    slot: inferredSlot,
    mainStatKey: mainKey,
    mainStatValue: mainValue,
    subStats,
    requiresManualMain: unresolved(mapped.mainStat?.statName?.value, mapped.mainStat?.statName?.confidence) || unresolved(mapped.mainStat?.statValue?.value, mapped.mainStat?.statValue?.confidence) || Boolean(mapped.mainStat?.unresolvedReason),
    warnings: draft.warnings,
  };
}
