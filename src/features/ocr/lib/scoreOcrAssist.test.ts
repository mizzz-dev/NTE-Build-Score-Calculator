import { describe, expect, it } from 'vitest';
import type { PublicMasterStatus } from '@/features/public-master/types';
import { applyScoreOcrCandidateToForm, canApplyScoreOcrCandidate, runScoreOcrAssist } from './scoreOcrAssist';

function createStatus(code: string, displayName: string): PublicMasterStatus {
  return {
    id: `status-${code}`,
    code,
    displayName,
    unit: null,
    statKind: 'percent',
    sortOrder: 0,
  };
}

describe('scoreOcrAssist', () => {
  it('stub OCR失敗時は手動テキストfallbackで候補生成する', async () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    const result = await runScoreOcrAssist({
      file,
      rawText: 'モジュール\n攻撃力% 12.3%\n会心率 8.2%',
      statusCandidates: [
        createStatus('atk_percent', '攻撃力%'),
        createStatus('crit_rate', '会心率'),
      ],
      adapter: { name: 'failing', run: async () => { throw new Error('failed'); } },
    });
    expect(result.status).toBe('needs_review');
    expect(result.candidate?.slot).toBe('module');
    expect(result.error).toContain('貼り付けテキスト');
  });

  it('未補正項目がある候補は自動反映不可', async () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    const result = await runScoreOcrAssist({
      file,
      rawText: '攻撃力% 12.3%\n?? 8.2%',
      statusCandidates: [createStatus('atk_percent', '攻撃力%')],
      adapter: { name: 'failing', run: async () => { throw new Error('failed'); } },
    });
    expect(canApplyScoreOcrCandidate(result.candidate)).toBe(false);
  });


  it('OCR失敗かつfallback不可時は次アクション付きエラーを返す', async () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    const result = await runScoreOcrAssist({
      file,
      rawText: '',
      statusCandidates: [createStatus('atk_percent', '攻撃力%')],
      adapter: { name: 'failing', run: async () => { throw new Error('timeout'); } },
    });
    expect(result.status).toBe('error');
    expect(result.error).toContain('画像を変えて再試行');
    expect(result.error).toContain('手動入力');
  });
  it('補正済み候補はフォームへ反映できる', () => {
    const next = applyScoreOcrCandidateToForm({
      slot: 'gear',
      mainStatKey: 'atk_percent',
      mainStatValue: '10%',
      subStats: [
        { key: 'crit_rate', value: '8.0%', requiresManual: false },
        { key: 'crit_dmg', value: '16%', requiresManual: false },
        { key: 'hp_flat', value: '123', requiresManual: false },
      ],
      requiresManualMain: false,
      warnings: [],
    }, {
      slot: 'cartridge',
      mainStatKey: 'hp_flat',
      mainStatValue: '1',
      subStats: [{ key: 'hp_flat', value: '' }, { key: 'hp_flat', value: '' }, { key: 'hp_flat', value: '' }],
    });
    expect(next.slot).toBe('gear');
    expect(next.mainStatValue).toBe('10');
    expect(next.subStats[0].key).toBe('crit_rate');
  });
});
