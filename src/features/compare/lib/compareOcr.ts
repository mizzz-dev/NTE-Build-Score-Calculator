import type { CompareBuildForm } from './compareCalculator';
import { applyScoreOcrCandidateToForm, canApplyScoreOcrCandidate, type ScoreOcrCandidate } from '@/features/ocr/lib/scoreOcrAssist';

export type CompareSide = 'A' | 'B';

export type CompareOcrSideState = {
  status: 'idle' | 'processing' | 'success' | 'error' | 'needs_review';
  candidate: ScoreOcrCandidate | null;
  reviewAcknowledged: boolean;
  error: string | null;
};

export function createInitialCompareOcrSideState(): CompareOcrSideState {
  return { status: 'idle', candidate: null, reviewAcknowledged: false, error: null };
}

export function unresolvedCount(candidate: ScoreOcrCandidate | null): number {
  if (!candidate) return 0;
  return (candidate.requiresManualMain ? 1 : 0) + candidate.subStats.filter((sub) => sub.requiresManual).length;
}

export function canRunCompareWithOcrGuard(params: { formAErrors: string[]; formBErrors: string[]; sideA: CompareOcrSideState; sideB: CompareOcrSideState }): { canCompare: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (params.formAErrors.length > 0) reasons.push('比較元Aの入力エラーを解消してください。');
  if (params.formBErrors.length > 0) reasons.push('比較先Bの入力エラーを解消してください。');

  const sides: Array<{ label: string; state: CompareOcrSideState }> = [
    { label: 'A', state: params.sideA },
    { label: 'B', state: params.sideB },
  ];

  sides.forEach(({ label, state }) => {
    if (!state.candidate) return;
    const unresolved = unresolvedCount(state.candidate);
    if (!state.reviewAcknowledged) reasons.push(`比較${label}はOCR下書き確認が未完了です。`);
    if (state.status === 'error') reasons.push(`比較${label}でOCR失敗状態が残っています。手動入力へ戻るか再試行してください。`);
    if (unresolved > 0) reasons.push(`比較${label}に未確定OCR項目が${unresolved}件あります。`);
  });

  return { canCompare: reasons.length === 0, reasons };
}

export function applyCompareOcrDraftToForm(candidate: ScoreOcrCandidate | null, current: CompareBuildForm): CompareBuildForm {
  if (!candidate || !canApplyScoreOcrCandidate(candidate)) return current;
  const applied = applyScoreOcrCandidateToForm(candidate, current);
  return { ...current, ...applied };
}
