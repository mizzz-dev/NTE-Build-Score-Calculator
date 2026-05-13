import type { PublicMasterStatus } from '@/features/public-master/types';
import type { SlotType, StatKey } from '@/lib/score/types';
import { browserStubOcrAdapter, buildLinesFromManualRawText, type OcrRunAdapter } from './adapter';
import { buildOcrDraftFromLines, mapDraftToPublicStatuses } from './poc';
import { buildScoreApplyCandidate, inferSlotFromText, validateOcrImageFile } from './scoreOcrDraft';

export type ScoreOcrStatus = 'idle' | 'processing' | 'success' | 'error' | 'needs_review';
export type ScoreOcrCandidate = ReturnType<typeof buildScoreApplyCandidate>;

export function buildScoreOcrCandidateFromLines(lines: string[], statusCandidates: PublicMasterStatus[]): ScoreOcrCandidate {
  const draft = buildOcrDraftFromLines(lines);
  const mapped = mapDraftToPublicStatuses(draft, statusCandidates);
  return buildScoreApplyCandidate({ draft, mapped, inferredSlot: inferSlotFromText(lines) });
}

export function canApplyScoreOcrCandidate(candidate: ScoreOcrCandidate | null): boolean {
  if (!candidate) return false;
  return !candidate.requiresManualMain && !candidate.subStats.some((s) => s.requiresManual);
}

export async function runScoreOcrAssist(input: { file: File; rawText: string; statusCandidates: PublicMasterStatus[]; adapter?: OcrRunAdapter }) {
  const validation = validateOcrImageFile(input.file);
  if (validation) return { status: 'error' as const, error: validation, candidate: null };
  const adapter = input.adapter ?? browserStubOcrAdapter;
  try {
    const result = await adapter.run(input.file);
    const candidate = buildScoreOcrCandidateFromLines(result.lines, input.statusCandidates);
    return { status: canApplyScoreOcrCandidate(candidate) ? ('success' as const) : ('needs_review' as const), error: null, candidate };
  } catch (error) {
    const manualLines = buildLinesFromManualRawText(input.rawText);
    if (manualLines.length === 0) {
      return { status: 'error' as const, error: `OCR読み取りに失敗しました。${error instanceof Error ? `（${error.message}）` : ''} 画像を変えて再試行するか、OCR生テキスト貼り付け・手動入力へ切り替えてください。`, candidate: null };
    }
    const candidate = buildScoreOcrCandidateFromLines(manualLines, input.statusCandidates);
    return { status: 'needs_review' as const, error: '画像OCRは失敗したため、貼り付けテキストからドラフトを生成しました。未解決項目を補正してからフォームへ反映してください。', candidate };
  }
}

export function applyScoreOcrCandidateToForm(candidate: ScoreOcrCandidate, current: { slot: SlotType; mainStatKey: StatKey; mainStatValue: string; subStats: Array<{ key: StatKey; value: string }> }) {
  if (!canApplyScoreOcrCandidate(candidate)) return current;
  return {
    slot: candidate.slot ?? current.slot,
    mainStatKey: candidate.mainStatKey ?? current.mainStatKey,
    mainStatValue: (candidate.mainStatValue ?? current.mainStatValue).replace('%', ''),
    subStats: current.subStats.map((item, index) => ({ key: candidate.subStats[index]?.key ?? item.key, value: (candidate.subStats[index]?.value ?? '').replace('%', '') })),
  };
}
