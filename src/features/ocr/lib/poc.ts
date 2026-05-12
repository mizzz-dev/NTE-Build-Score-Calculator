import type { PublicMasterStatus } from '@/features/public-master/types';
import type { BrowserOcrCandidate, OcrDraftStatRow, OcrEquipmentDraft, OcrMappedDraft, OcrMappedDraftStat, OcrPocEvaluation } from './types';

const STATUS_ALIASES: Record<string, string[]> = {
  attack: ['attack', 'atk', '攻撃力', '공격력'],
  hp: ['hp', '体力', '생명력'],
  defense: ['defense', 'def', '防御力', '방어력'],
  crit_rate: ['critical rate', 'crit rate', 'crit.rate', '会心率', '치명타 확률'],
  crit_damage: ['critical damage', 'crit dmg', 'crit.dmg', '会心ダメージ', '치명타 피해'],
};

function normalizeText(input: string): string {
  return input.trim().toLowerCase().replace(/[％]/g, '%').replace(/[．]/g, '.').replace(/\s+/g, ' ');
}

function parseStatLine(line: string): OcrDraftStatRow | null {
  const normalizedLine = normalizeText(line);
  const matched = normalizedLine.match(/^(.+?)\s*([+-]?\d+(?:\.\d+)?%?)$/);
  if (!matched) return null;
  const [, statNameRaw, statValueRaw] = matched;

  const confidenceBase = /%|\./.test(statValueRaw) ? 0.92 : 0.9;
  return {
    statName: { value: statNameRaw, confidence: 0.86, normalizedValue: normalizeText(statNameRaw) },
    statValue: { value: statValueRaw, confidence: confidenceBase, normalizedValue: statValueRaw },
  };
}

export function buildOcrDraftFromLines(lines: string[]): OcrEquipmentDraft {
  const parsedRows = lines.map(parseStatLine).filter((row): row is OcrDraftStatRow => row !== null);
  const warnings: string[] = [];
  if (parsedRows.length === 0) warnings.push('OCRテキストからステータス行を抽出できませんでした。');

  return {
    mainStat: parsedRows[0],
    subStats: parsedRows.slice(1, 5),
    warnings,
    sourceLocale: 'unknown',
  };
}

function mapStatNameToMaster(statName: string, statuses: PublicMasterStatus[]): PublicMasterStatus | undefined {
  const normalized = normalizeText(statName);
  return statuses.find((status) => {
    const aliases = STATUS_ALIASES[status.code] ?? [];
    return aliases.some((alias) => normalizeText(alias) === normalized) || normalizeText(status.displayName) === normalized;
  });
}

function mapRow(row: OcrDraftStatRow | undefined, statuses: PublicMasterStatus[]): OcrMappedDraftStat | undefined {
  if (!row || !row.statName) return undefined;
  const matchedStatus = mapStatNameToMaster(row.statName.value, statuses);
  if (!matchedStatus) return { ...row, unresolvedReason: '公開マスタへマッピングできないため手動補正が必要です。' };
  return { ...row, matchedStatus };
}

export function mapDraftToPublicStatuses(draft: OcrEquipmentDraft, statuses: PublicMasterStatus[]): OcrMappedDraft {
  return {
    mainStat: mapRow(draft.mainStat, statuses),
    subStats: draft.subStats.map((row) => mapRow(row, statuses) ?? row),
    warnings: draft.warnings,
  };
}

export function evaluateBrowserOcrCandidates(): OcrPocEvaluation[] {
  const candidates: BrowserOcrCandidate[] = [
    { name: 'Tesseract.js', runEnvironment: 'browser', supportsOffline: true, expectedBundleImpact: 'large', notes: '精度調整の自由度があるが初期ロードが重い。' },
    { name: 'OCRAD.js', runEnvironment: 'browser', supportsOffline: true, expectedBundleImpact: 'small', notes: 'バンドル影響は軽めだが多言語と記号認識が弱い。' },
  ];

  return candidates.map((candidate) => {
    if (candidate.name === 'Tesseract.js') {
      return {
        candidate,
        status: 'conditional',
        rationale: ['クライアント完結でサーバー非保存方針と整合する。', '端末性能差と初期バンドル増加の懸念があり、遅延読込を前提にする。', '低信頼度項目は手動補正必須にする。'],
      };
    }

    return {
      candidate,
      status: 'hold',
      rationale: ['軽量だが `%` と小数点を含む認識精度が要確認。', '日本語ステータス名のマッピング誤差が大きくなる懸念。'],
    };
  });
}
