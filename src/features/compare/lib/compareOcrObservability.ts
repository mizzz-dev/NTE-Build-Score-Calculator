export type CompareOcrFallbackReasonCode =
  | 'ocr_engine_error'
  | 'ocr_timeout_wait_switch'
  | 'image_quality_low'
  | 'manual_input_preferred'
  | 'unknown';

export type CompareOcrPrecheckDropReasonCode =
  | 'unresolved_items_remaining'
  | 'review_acknowledgement_missing'
  | 'input_validation_error'
  | 'ocr_error_unresolved'
  | 'ab_test_recheck'
  | 'unknown';

export function classifyFallbackReason(params: { hadError: boolean; elapsedMs: number; unresolvedCount: number; switchedManually: boolean }): CompareOcrFallbackReasonCode {
  if (params.hadError) return 'ocr_engine_error';
  if (params.elapsedMs >= 6000) return 'ocr_timeout_wait_switch';
  if (params.unresolvedCount > 0) return 'image_quality_low';
  if (params.switchedManually) return 'manual_input_preferred';
  return 'unknown';
}

export function classifyPrecheckDropReason(params: { hasUnresolved: boolean; reviewMissing: boolean; hasInputErrors: boolean; hasOcrError: boolean; abRecheckTriggered: boolean }): CompareOcrPrecheckDropReasonCode {
  if (params.hasInputErrors) return 'input_validation_error';
  if (params.hasOcrError) return 'ocr_error_unresolved';
  if (params.hasUnresolved) return 'unresolved_items_remaining';
  if (params.reviewMissing) return 'review_acknowledgement_missing';
  if (params.abRecheckTriggered) return 'ab_test_recheck';
  return 'unknown';
}
