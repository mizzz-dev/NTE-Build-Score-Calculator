import { sampleScoreConfig } from '@/lib/score/sampleConfig';
import type { SlotType, StatKey } from '@/lib/score/types';
import type { ScoreShareState } from './types';

const ALLOWED_SLOTS: SlotType[] = ['cartridge', 'module', 'gear', 'console'];
const ALLOWED_STAT_KEYS = new Set(Object.keys(sampleScoreConfig.statRanges));
const DEFAULT_STAT_KEY = Object.keys(sampleScoreConfig.statRanges)[0] as StatKey;
export const SHARE_SUB_STAT_COUNT = 3;

type ShareQueryReader = Pick<URLSearchParams, 'get' | 'toString'>;

function safeStatKey(value: string): StatKey {
  return ALLOWED_STAT_KEYS.has(value) ? (value as StatKey) : DEFAULT_STAT_KEY;
}

function normalizeNumberString(value: string): string {
  if (value.trim().length === 0) return '';
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return '';
  return String(parsed);
}

export function toShareQuery(state: ScoreShareState): URLSearchParams {
  const params = new URLSearchParams();
  params.set('role', state.roleId);
  if (state.characterId) params.set('ch', state.characterId);
  params.set('slot', state.slot);
  params.set('mk', state.mainStatKey);
  params.set('mv', normalizeNumberString(state.mainStatValue));

  state.subStats.slice(0, SHARE_SUB_STAT_COUNT).forEach((sub, index) => {
    params.set(`s${index + 1}k`, sub.key);
    params.set(`s${index + 1}v`, normalizeNumberString(sub.value));
  });

  return params;
}

export function fromShareQuery(
  query: ShareQueryReader,
  fallback: ScoreShareState,
): ScoreShareState {
  const roleId = query.get('role') || fallback.roleId;
  const characterId = query.get('ch') || '';

  const slotRaw = query.get('slot');
  const slot = slotRaw && ALLOWED_SLOTS.includes(slotRaw as SlotType) ? (slotRaw as SlotType) : fallback.slot;

  const next: ScoreShareState = {
    roleId,
    characterId,
    slot,
    mainStatKey: safeStatKey(query.get('mk') || fallback.mainStatKey),
    mainStatValue: normalizeNumberString(query.get('mv') || fallback.mainStatValue),
    subStats: Array.from({ length: SHARE_SUB_STAT_COUNT }, (_, index) => ({
      key: safeStatKey(query.get(`s${index + 1}k`) || fallback.subStats[index]?.key || DEFAULT_STAT_KEY),
      value: normalizeNumberString(query.get(`s${index + 1}v`) || fallback.subStats[index]?.value || ''),
    })),
  };

  return next;
}
