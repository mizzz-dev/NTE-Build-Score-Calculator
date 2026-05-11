import { describe, expect, it } from 'vitest';
import { resolveScoreConfigForScorePage } from './scoreConfigResolver';

const base = {
  source: 'remote' as const,
  warning: null,
  data: {
    characters: [{ id: 'c1', slug: 'alice', displayName: 'Alice', sortOrder: 1 }],
    roles: [{ id: 'r1', code: 'dps', displayName: 'DPS', sortOrder: 1 }],
    statuses: [{ id: 's1', code: 'atk_percent', displayName: 'ATK%', unit: null, statKind: 'percent' as const, sortOrder: 1 }],
    scoreWeights: [{ id: 'w1', profileKey: 'default', characterSlug: null, roleCode: null, statCode: 'sub.scale', weight: '10', startsAt: null, endsAt: null, updatedAt: null }],
  },
};

describe('resolveScoreConfigForScorePage', () => {
  it('公開マスタ有効時はpublic-master', () => {
    const result = resolveScoreConfigForScorePage(base);
    expect(result.source).toBe('public-master');
    expect(result.notice).toBeNull();
  });

  it('不足時はfallbackでnotice表示', () => {
    const result = resolveScoreConfigForScorePage({ ...base, data: { ...base.data, scoreWeights: [] } });
    expect(result.source).toBe('sample-fallback');
    expect(result.notice).not.toBeNull();
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
