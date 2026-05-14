import { classifyFallbackReason, classifyPrecheckDropReason } from './compareOcrObservability';

describe('compareOcrObservability', () => {
  it('fallback要因を優先順位付きで分類する', () => {
    expect(classifyFallbackReason({ hadError: true, elapsedMs: 1000, unresolvedCount: 0, switchedManually: false })).toBe('ocr_engine_error');
    expect(classifyFallbackReason({ hadError: false, elapsedMs: 6500, unresolvedCount: 0, switchedManually: false })).toBe('ocr_timeout_wait_switch');
    expect(classifyFallbackReason({ hadError: false, elapsedMs: 3000, unresolvedCount: 2, switchedManually: false })).toBe('image_quality_low');
    expect(classifyFallbackReason({ hadError: false, elapsedMs: 3000, unresolvedCount: 0, switchedManually: true })).toBe('manual_input_preferred');
  });

  it('比較前確認離脱要因を分類する', () => {
    expect(classifyPrecheckDropReason({ hasInputErrors: true, hasOcrError: false, hasUnresolved: false, reviewMissing: false, abRecheckTriggered: false })).toBe('input_validation_error');
    expect(classifyPrecheckDropReason({ hasInputErrors: false, hasOcrError: true, hasUnresolved: true, reviewMissing: true, abRecheckTriggered: false })).toBe('ocr_error_unresolved');
    expect(classifyPrecheckDropReason({ hasInputErrors: false, hasOcrError: false, hasUnresolved: true, reviewMissing: true, abRecheckTriggered: false })).toBe('unresolved_items_remaining');
    expect(classifyPrecheckDropReason({ hasInputErrors: false, hasOcrError: false, hasUnresolved: false, reviewMissing: true, abRecheckTriggered: false })).toBe('review_acknowledgement_missing');
  });
});
