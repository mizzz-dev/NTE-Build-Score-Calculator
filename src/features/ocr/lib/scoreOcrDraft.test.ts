import { describe, expect, it } from 'vitest';
import { buildScoreApplyCandidate, inferSlotFromText, OCR_MAX_FILE_SIZE_BYTES, validateOcrImageFile } from './scoreOcrDraft';

describe('scoreOcrDraft', () => {
  it('画像バリデーションを判定できる', () => {
    const valid = new File(['x'], 'a.png', { type: 'image/png' });
    expect(validateOcrImageFile(valid)).toBeNull();

    const invalidType = new File(['x'], 'a.gif', { type: 'image/gif' });
    expect(validateOcrImageFile(invalidType)).toContain('非対応');

    const large = new File([new Uint8Array(OCR_MAX_FILE_SIZE_BYTES + 1)], 'a.png', { type: 'image/png' });
    expect(validateOcrImageFile(large)).toContain('MB');
  });

  it('スロット推定と反映候補を生成できる', () => {
    expect(inferSlotFromText(['装備: モジュール'])).toBe('module');
    const candidate = buildScoreApplyCandidate({
      inferredSlot: 'module',
      draft: { subStats: [], warnings: [], sourceLocale: 'unknown' },
      mapped: {
        warnings: [],
        mainStat: { statName: { value: '攻撃力%', confidence: 0.95 }, statValue: { value: '12.3%', confidence: 0.95 } },
        subStats: [{ statName: { value: '会心率', confidence: 0.95 }, statValue: { value: '8.2%', confidence: 0.95 } }],
      },
    });
    expect(candidate.mainStatKey).toBe('atk_percent');
    expect(candidate.subStats[0].key).toBe('crit_rate');
  });
});
