'use client';

import { useMemo } from 'react';
import type { SlotType, StatKey } from '@/lib/score/types';
import type { ScoreOcrCandidate, ScoreOcrStatus } from '@/features/ocr/lib/scoreOcrAssist';

const SLOT_LABELS: Record<SlotType, string> = { cartridge: 'カートリッジ', module: 'モジュール', gear: 'ギア', console: 'コンソール' };
const SLOW_PROCESSING_THRESHOLD_MS = 4000;
const VERY_SLOW_PROCESSING_THRESHOLD_MS = 6000;

type Props = { status: ScoreOcrStatus; error: string | null; rawText: string; candidate: ScoreOcrCandidate | null; statKeyOptions: StatKey[]; onRawTextChange: (value: string) => void; onSelectImage: (file: File | null) => void; onUpdateCandidate: (next: ScoreOcrCandidate) => void; onApplyCandidate: () => void };

type PropsWithProgress = Props & { progressStatus?: 'idle' | 'loading_engine' | 'processing'; processingElapsedMs?: number };

function renderQualityLabel(matchType?: string, confidence?: number) {
  if (!matchType) return '未判定';
  return `${matchType} / 信頼度 ${(confidence ?? 0).toFixed(2)}`;
}

function buildNextActionHints(status: ScoreOcrStatus, hasCandidate: boolean) {
  if (status === 'error') {
    return [
      '同じ画像で再試行（文字が見切れていないか確認）',
      '別画像で再試行（明るい場所・ブレなし推奨）',
      '下の「OCR生テキスト」へ貼り付けて手動テキストfallbackを利用',
      '候補が作れない場合は手動入力へ切り替え',
    ];
  }
  if (status === 'needs_review' || hasCandidate) {
    return [
      '赤色の「未解決理由」がある項目を優先して補正',
      '信頼度が低い項目はゲーム内表示と照合して再選択',
      '全項目の未解決が解消されたら「フォームへ反映」を実行',
    ];
  }
  return [
    '画像を選択してOCRを開始',
    '必要ならOCR生テキストを貼り付けて補助候補を作成',
  ];
}

export function buildProcessingGuidance(status: ScoreOcrStatus, progressStatus: 'idle' | 'loading_engine' | 'processing', processingElapsedMs: number): string | null {
  if (status !== 'processing') return null;
  if (progressStatus === 'loading_engine') return 'OCRエンジン読み込み中...（初回は時間がかかる場合があります）';
  if (progressStatus !== 'processing') return null;
  if (processingElapsedMs >= VERY_SLOW_PROCESSING_THRESHOLD_MS) {
    return 'OCR処理中...（6秒以上経過）このまま待つか、手動テキストfallback・手動入力へ切り替えてください。';
  }
  if (processingElapsedMs >= SLOW_PROCESSING_THRESHOLD_MS) {
    return 'OCR処理中...（4秒以上経過）低スペック端末では時間がかかるため、必要に応じて別画像で再試行してください。';
  }
  return 'OCR処理中...（長い場合は別画像での再試行や手動テキストfallbackを検討してください）';
}

export function ScoreOcrAssistPanel({ status, progressStatus = 'idle', processingElapsedMs = 0, error, rawText, candidate, statKeyOptions, onRawTextChange, onSelectImage, onUpdateCandidate, onApplyCandidate }: PropsWithProgress) {
  const unresolvedSubCount = candidate?.subStats.filter((s) => s.requiresManual).length ?? 0;
  const unresolvedCount = (candidate?.requiresManualMain ? 1 : 0) + unresolvedSubCount;
  const canApply = candidate ? !(candidate.requiresManualMain || candidate.subStats.some((s) => s.requiresManual)) : false;
  const nextActions = buildNextActionHints(status, Boolean(candidate));
  const processingGuidance = useMemo(() => buildProcessingGuidance(status, progressStatus, processingElapsedMs), [processingElapsedMs, progressStatus, status]);
  return <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 space-y-2"><p className="text-sm font-medium">OCR入力補助（/score限定）</p><p className="text-xs text-[var(--color-text-secondary)]">画像はブラウザ内のみで処理し、サーバー保存しません。OCR結果は一時ドラフトです。</p><div className="rounded border border-[var(--color-border)] p-2 text-xs text-[var(--color-text-secondary)]"><p className="font-medium text-[var(--color-text-primary)]">読取前チェック（低スペック端末向け）</p><ul className="list-disc pl-4"><li>画像サイズ目安: 2MB以下を推奨（大きい画像は端末での処理時間が増加）</li><li>文字がぼやける・潰れる画像は、明るい画面で撮り直して再試行</li></ul></div><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => onSelectImage(e.target.files?.[0] ?? null)} className="text-xs" /><textarea className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-xs" rows={3} placeholder="OCR生テキスト行を貼り付け（失敗時fallback用）" value={rawText} onChange={(e) => onRawTextChange(e.target.value)} />{processingGuidance && <p className="text-xs text-[var(--color-text-secondary)]">{processingGuidance}</p>}{error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}<div className="rounded border border-[var(--color-border)] p-2 text-xs"><p className="font-medium">次に行うこと</p><ul className="list-disc pl-4 text-[var(--color-text-secondary)]">{nextActions.map((action) => <li key={action}>{action}</li>)}</ul></div>{candidate && <div className="text-xs space-y-1 rounded border border-[var(--color-border)] p-2"><p className={unresolvedCount > 0 ? 'text-[var(--color-danger)] font-medium' : 'text-[var(--color-accent)] font-medium'}>{unresolvedCount > 0 ? `未解決項目 ${unresolvedCount}件（メイン${candidate.requiresManualMain ? '1' : '0'}件 / サブ${unresolvedSubCount}件）` : '未解決項目はありません。フォームへ反映できます。'}</p><label className="block">装備タイプ<select className="ml-2 rounded border border-[var(--color-border)]" value={candidate.slot ?? ''} onChange={(e) => onUpdateCandidate({ ...candidate, slot: (e.target.value || undefined) as SlotType | undefined })}><option value="">未解決</option>{Object.entries(SLOT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><div className="grid grid-cols-2 gap-1"><select className="rounded border border-[var(--color-border)]" value={candidate.mainStatKey ?? ''} onChange={(e) => onUpdateCandidate({ ...candidate, mainStatKey: (e.target.value || undefined) as StatKey | undefined, requiresManualMain: false, mainStatUnresolvedReason: undefined })}><option value="">メインキー未解決</option>{statKeyOptions.map((key) => <option key={key} value={key}>{key}</option>)}</select><input className="rounded border border-[var(--color-border)] px-1" value={candidate.mainStatValue ?? ''} onChange={(e) => onUpdateCandidate({ ...candidate, mainStatValue: e.target.value, requiresManualMain: false, mainStatUnresolvedReason: undefined })} placeholder="メイン値" /></div><p className="text-[var(--color-text-secondary)]">メイン候補: {renderQualityLabel(candidate.mainStatMatchType, candidate.mainStatConfidence)}</p>{candidate.mainStatUnresolvedReason && <p className="text-[var(--color-danger)]">メイン未解決理由: {candidate.mainStatUnresolvedReason}（候補の誤読可能性があるため手動確認が必要）</p>}{candidate.subStats.map((sub, idx) => <div key={idx} className="space-y-1"><div className="grid grid-cols-2 gap-1"><select className="rounded border border-[var(--color-border)]" value={sub.key ?? ''} onChange={(e) => { const next = [...candidate.subStats]; next[idx] = { ...sub, key: (e.target.value || undefined) as StatKey | undefined, requiresManual: false, unresolvedReason: undefined }; onUpdateCandidate({ ...candidate, subStats: next }); }}><option value="">サブ{idx + 1}キー未解決</option>{statKeyOptions.map((key) => <option key={key} value={key}>{key}</option>)}</select><input className="rounded border border-[var(--color-border)] px-1" value={sub.value} placeholder={`サブ${idx + 1}値`} onChange={(e) => { const next = [...candidate.subStats]; next[idx] = { ...sub, value: e.target.value, requiresManual: false, unresolvedReason: undefined }; onUpdateCandidate({ ...candidate, subStats: next }); }} /></div><p className="text-[var(--color-text-secondary)]">候補精度: {renderQualityLabel(sub.matchType, sub.confidence)}</p>{sub.unresolvedReason && <p className="text-[var(--color-danger)]">未解決理由: {sub.unresolvedReason}（候補の誤読可能性があるため手動確認が必要）</p>}</div>)}{candidate.warnings.map((warning) => <p key={warning} className="text-[var(--color-danger)]">{warning}</p>)}<p className="text-[var(--color-text-secondary)]">{canApply ? '反映可能: 未解決項目なし。' : '反映不可: 未解決項目が残っています。すべて補正後に反映可能になります。'}</p><button type="button" className="rounded-md border border-[var(--color-border)] px-2 py-1 disabled:opacity-50" onClick={onApplyCandidate} disabled={!canApply}>フォームへ反映</button></div>}</div>;
}
