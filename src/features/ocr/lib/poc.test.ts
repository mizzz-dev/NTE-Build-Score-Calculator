import { describe, expect, it } from 'vitest';
import { buildOcrDraftFromLines, evaluateBrowserOcrCandidates, mapDraftToPublicStatuses } from './poc';
import type { PublicMasterStatus } from '@/features/public-master/types';

const statuses: PublicMasterStatus[] = [
  { id: '1', code: 'crit_rate', displayName: '会心率', unit: '%', statKind: 'percent', sortOrder: 1 },
  { id: '2', code: 'atk_percent', displayName: '攻撃力%', unit: '%', statKind: 'percent', sortOrder: 2 },
  { id: '3', code: 'crit_dmg', displayName: '会心ダメージ', unit: '%', statKind: 'percent', sortOrder: 3 },
];

describe('OCR PoC utilities', () => {
  it('ステータス行からdraftを生成できる', () => {
    const draft = buildOcrDraftFromLines(['会心率 12.4%', '攻撃力 120']);
    expect(draft.mainStat?.statName?.value).toBe('会心率');
    expect(draft.subStats[0]?.statValue?.value).toBe('120');
  });

  it('公開マスタへマッピングし、正規化・alias一致を解決できる', () => {
    const draft = buildOcrDraftFromLines(['CRIT RATE 12.4％', 'Atk 10.2%']);
    const mapped = mapDraftToPublicStatuses(draft, statuses);
    expect(mapped.mainStat?.matchedStatus?.code).toBe('crit_rate');
    expect(mapped.mainStat?.matchType).toBe('normalized');
    expect(mapped.subStats[0]?.matchedStatus?.code).toBe('atk_percent');
    expect(mapped.subStats[0]?.candidateStatuses?.length).toBeGreaterThan(0);
  });

  it('低信頼度候補は未解決理由を付与する', () => {
    const draft = buildOcrDraftFromLines(['会心ダメージ 20%']);
    const mapped = mapDraftToPublicStatuses(draft, statuses);
    expect(mapped.mainStat?.matchedStatus?.code).toBe('crit_dmg');
    expect(mapped.mainStat?.unresolvedReason).toBeUndefined();
  });

  it('候補比較で条件付き採用と保留を返す', () => {
    const result = evaluateBrowserOcrCandidates();
    expect(result.find((item) => item.candidate.name === 'Tesseract.js')?.status).toBe('conditional');
    expect(result.find((item) => item.candidate.name === 'OCRAD.js')?.status).toBe('hold');
  });
});
