import { describe, expect, it } from 'vitest';
import { buildOcrDraftFromLines, evaluateBrowserOcrCandidates, mapDraftToPublicStatuses } from './poc';
import type { PublicMasterStatus } from '@/features/public-master/types';

const statuses: PublicMasterStatus[] = [
  { id: '1', code: 'crit_rate', displayName: '会心率', unit: '%', statKind: 'percent', sortOrder: 1 },
  { id: '2', code: 'attack', displayName: '攻撃力', unit: null, statKind: 'fixed', sortOrder: 2 },
];

describe('OCR PoC utilities', () => {
  it('ステータス行からdraftを生成できる', () => {
    const draft = buildOcrDraftFromLines(['会心率 12.4%', '攻撃力 120']);
    expect(draft.mainStat?.statName?.value).toBe('会心率');
    expect(draft.subStats[0]?.statValue?.value).toBe('120');
  });

  it('公開マスタへマッピングし、未一致項目は手動補正扱いにする', () => {
    const draft = buildOcrDraftFromLines(['会心率 12.4%', '未知ステ 10']);
    const mapped = mapDraftToPublicStatuses(draft, statuses);
    expect(mapped.mainStat?.matchedStatus?.code).toBe('crit_rate');
    expect(mapped.subStats[0]).toHaveProperty('unresolvedReason');
  });

  it('候補比較で条件付き採用と保留を返す', () => {
    const result = evaluateBrowserOcrCandidates();
    expect(result.find((item) => item.candidate.name === 'Tesseract.js')?.status).toBe('conditional');
    expect(result.find((item) => item.candidate.name === 'OCRAD.js')?.status).toBe('hold');
  });
});
