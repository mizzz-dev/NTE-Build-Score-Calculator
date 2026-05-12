import { describe, expect, it } from 'vitest';
import { createCardPayload, createRankingPayloadSnapshot, createScorePayload } from './payloadBuilders';

describe('payloadBuilders', () => {
  const base = {
    roleId: 'dps',
    characterId: 'alice',
    slot: 'cartridge' as const,
    mainStatKey: 'atk_percent' as const,
    mainStatValue: '42.5',
    subStats: [
      { key: 'crit_rate' as const, value: '8.4' },
      { key: 'crit_dmg' as const, value: '' },
      { key: 'hp_flat' as const, value: 'bad' },
    ],
  };

  it('score履歴payloadは既存形式を維持し、不要情報を含まない', () => {
    const payload = createScorePayload(base, 88.1, 'A+');
    expect(payload).toEqual({
      roleId: 'dps',
      characterId: 'alice',
      slot: 'cartridge',
      mainStatKey: 'atk_percent',
      mainStatValue: 42.5,
      subStats: [{ key: 'crit_rate', value: 8.4 }],
      score: 88.1,
      rank: 'A+',
    });
    expect(JSON.stringify(payload)).not.toContain('token');
    expect(JSON.stringify(payload)).not.toContain('secret');
    expect(JSON.stringify(payload)).not.toContain('email');
  });

  it('card履歴payloadは既存形式を維持する', () => {
    const payload = createCardPayload({ roleId: base.roleId, slot: base.slot, mainStatKey: base.mainStatKey, mainStatValue: base.mainStatValue, subStats: base.subStats }, 77.7, 'A');
    expect(payload).not.toHaveProperty('characterId');
    expect(payload.subStats).toHaveLength(1);
  });

  it('ランキング投稿snapshotは巨大ScoreConfigを含まない', () => {
    const payload = createRankingPayloadSnapshot(base, 88.1, 'A+');
    const keys = Object.keys(payload);
    expect(keys).toEqual(['roleId', 'slot', 'score', 'rank', 'mainStatKey', 'mainStatValue', 'subStats']);
    expect(JSON.stringify(payload)).not.toContain('weightsByRole');
    expect(JSON.stringify(payload)).not.toContain('statRanges');
  });
});
