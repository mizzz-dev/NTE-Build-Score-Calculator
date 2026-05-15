import { describe, expect, it } from 'vitest';
import { applyCompareOcrDraftToForm, canRunCompareWithOcrGuard, createInitialCompareOcrSideState } from './compareOcr';
import type { ScoreOcrCandidate } from '@/features/ocr/lib/scoreOcrAssist';

const form = { roleId: 'dps', characterId: '', slot: 'cartridge' as const, mainStatKey: 'atk_percent' as const, mainStatValue: '10', subStats: [{ key: 'crit_rate' as const, value: '1' }, { key: 'crit_dmg' as const, value: '2' }, { key: 'hp_flat' as const, value: '' }] };

const candidate: ScoreOcrCandidate = { slot: 'module', mainStatKey: 'crit_rate', mainStatValue: '22.2', requiresManualMain: false, mainStatConfidence: 0.9, subStats: [{ key: 'crit_rate', value: '5.5', requiresManual: false, confidence: 0.9 }, { key: 'crit_dmg', value: '10.0', requiresManual: false, confidence: 0.9 }, { key: 'hp_flat', value: '100', requiresManual: false, confidence: 0.9 }], warnings: [] };

describe('compareOcr guard', () => {
  it('A/Bどちらか未確認や未確定がある場合は比較をブロックする', () => {
    const sideA = { ...createInitialCompareOcrSideState(), candidate, status: 'success' as const, reviewAcknowledged: false };
    const sideB = { ...createInitialCompareOcrSideState(), candidate: { ...candidate, requiresManualMain: true }, status: 'needs_review' as const, reviewAcknowledged: true };
    const result = canRunCompareWithOcrGuard({ formAErrors: [], formBErrors: [], sideA, sideB });
    expect(result.canCompare).toBe(false);
    expect(result.reasons.join(' ')).toContain('比較AのOCR下書き確認が未完了です');
    expect(result.reasons.join(' ')).toContain('比較Bに未確定OCR項目が1件残っています');
  });



  it('入力エラーのみのブロック時はOCRガイド表示条件を満たさない', () => {
    const result = canRunCompareWithOcrGuard({
      formAErrors: ['A error'],
      formBErrors: ['B error'],
      sideA: createInitialCompareOcrSideState(),
      sideB: createInitialCompareOcrSideState(),
    });
    expect(result.canCompare).toBe(false);
    expect(result.hasOcrBlockingReason).toBe(false);
    expect(result.reasonDetails.every((reason) => reason.category === 'input')).toBe(true);
  });

  it('OCR由来のブロック理由がある場合はOCRガイド表示条件を満たす', () => {
    const sideA = { ...createInitialCompareOcrSideState(), candidate: { ...candidate, requiresManualMain: true }, status: 'needs_review' as const, reviewAcknowledged: false };
    const result = canRunCompareWithOcrGuard({ formAErrors: ['A error'], formBErrors: [], sideA, sideB: createInitialCompareOcrSideState() });
    expect(result.canCompare).toBe(false);
    expect(result.hasOcrBlockingReason).toBe(true);
    expect(result.reasonDetails.some((reason) => reason.category === 'ocr')).toBe(true);
  });

  it('OCR下書きを反映しても片系統のみ更新される', () => {
    const formA = structuredClone(form);
    const formB = { ...structuredClone(form), mainStatValue: '99' };
    const nextA = applyCompareOcrDraftToForm(candidate, formA);
    expect(nextA.mainStatValue).toBe('22.2');
    expect(formB.mainStatValue).toBe('99');
  });
});
