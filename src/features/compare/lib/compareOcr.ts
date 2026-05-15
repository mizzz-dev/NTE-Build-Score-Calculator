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

export type CompareBlockReasonCategory = 'input' | 'ocr';

export type CompareBlockReason = {
  message: string;
  category: CompareBlockReasonCategory;
};

export function canRunCompareWithOcrGuard(params: { formAErrors: string[]; formBErrors: string[]; sideA: CompareOcrSideState; sideB: CompareOcrSideState }): { canCompare: boolean; reasons: string[]; reasonDetails: CompareBlockReason[]; hasOcrBlockingReason: boolean } {
  const reasonDetails: CompareBlockReason[] = [];
  if (params.formAErrors.length > 0) reasonDetails.push({ category: 'input', message: '比較元Aの入力エラーを解消してください。' });
  if (params.formBErrors.length > 0) reasonDetails.push({ category: 'input', message: '比較先Bの入力エラーを解消してください。' });

  const sides: Array<{ label: string; state: CompareOcrSideState }> = [
    { label: 'A', state: params.sideA },
    { label: 'B', state: params.sideB },
  ];

  sides.forEach(({ label, state }) => {
    if (!state.candidate) return;
    const unresolved = unresolvedCount(state.candidate);
    if (!state.reviewAcknowledged) reasonDetails.push({ category: 'ocr', message: `比較${label}のOCR下書き確認が未完了です（比較${label} → 未確定解消 → 確認済みチェックの順で進めてください）。` });
    if (state.status === 'error') reasonDetails.push({ category: 'ocr', message: `比較${label}でOCR失敗状態が残っています。手動入力へ戻るか再試行してください。` });
    if (unresolved > 0) reasonDetails.push({ category: 'ocr', message: `比較${label}に未確定OCR項目が${unresolved}件残っています（比較${label}の候補を先に補正してください）。` });
  });

  const reasons = reasonDetails.map((reason) => reason.message);
  const hasOcrBlockingReason = reasonDetails.some((reason) => reason.category === 'ocr');

  return { canCompare: reasons.length === 0, reasons, reasonDetails, hasOcrBlockingReason };
}

export function applyCompareOcrDraftToForm(candidate: ScoreOcrCandidate | null, current: CompareBuildForm): CompareBuildForm {
  if (!candidate || !canApplyScoreOcrCandidate(candidate)) return current;
  const applied = applyScoreOcrCandidateToForm(candidate, current);
  return { ...current, ...applied };
}
