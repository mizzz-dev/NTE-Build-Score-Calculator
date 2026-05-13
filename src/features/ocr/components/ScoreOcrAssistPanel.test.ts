import { describe, expect, it } from 'vitest';
import { buildProcessingGuidance } from './ScoreOcrAssistPanel';

describe('ScoreOcrAssistPanel processing guidance', () => {
  it('4秒未満は通常ガイダンスを返す', () => {
    const message = buildProcessingGuidance('processing', 'processing', 2000);
    expect(message).toContain('OCR処理中');
    expect(message).toContain('fallback');
  });

  it('4秒以上は低スペック端末向け再試行ガイダンスを返す', () => {
    const message = buildProcessingGuidance('processing', 'processing', 4500);
    expect(message).toContain('4秒以上経過');
    expect(message).toContain('低スペック端末');
  });

  it('6秒以上は手動切替判断ガイダンスを返す', () => {
    const message = buildProcessingGuidance('processing', 'processing', 6100);
    expect(message).toContain('6秒以上経過');
    expect(message).toContain('手動入力');
  });
});
