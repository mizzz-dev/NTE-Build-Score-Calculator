import type { PublicMasterStatus } from '@/features/public-master/types';
import type { BrowserOcrCandidate, OcrDraftStatRow, OcrEquipmentDraft, OcrMappedDraft, OcrMappedDraftStat, OcrPocEvaluation } from './types';

type MatchType = 'exact' | 'normalized' | 'alias' | 'partial' | 'similar';

type MatchCandidate = {
  status: PublicMasterStatus;
  matchType: MatchType;
  confidence: number;
};

const STATUS_ALIASES: Record<string, string[]> = {
  atk_percent: ['atk', 'atk%', 'attack', 'attack%', '攻撃力', '攻撃力%', '공격력', '공격력%'],
  hp_flat: ['hp', '体力', '생명력'],
  def_percent: ['def', 'defense', 'defence', '防御力', '방어력'],
  crit_rate: ['critical rate', 'crit rate', 'crit.rate', 'cri rate', '会心率', '会心', '치명타 확률'],
  crit_dmg: ['critical damage', 'critical dmg', 'crit dmg', 'crit.dmg', '会心ダメージ', '会心ダメ', '치명타 피해'],
};

function normalizeText(input: string): string {
  return input
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[％]/g, '%')
    .replace(/[．]/g, '.')
    .replace(/[・·]/g, ' ')
    .replace(/[|｜]/g, 'l')
    .replace(/夕/g, 'ダ')
    .replace(/[!！]/g, '1')
    .replace(/[。､，,;；:：()\[\]{}「」『』<>＜＞]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*%/g, '%');
}

function buildComparableText(input: string): string {
  return normalizeText(input)
    .replace(/rate|ratio|率/g, '%')
    .replace(/damage|dmg|ダメージ|ダメ/g, 'dmg')
    .replace(/critical|crit|会心|치명타/g, 'crit')
    .replace(/attack|atk|攻撃力|공격력/g, 'atk')
    .replace(/defense|defence|def|防御力|방어력/g, 'def')
    .replace(/hp|体力|생명력/g, 'hp')
    .replace(/[^a-z0-9%가-힣ぁ-んァ-ヶ一-龠]/g, '');
}

function similarity(a: string, b: string): number {
  if (a.length === 0 || b.length === 0) return 0;
  const max = Math.max(a.length, b.length);
  let same = 0;
  const min = Math.min(a.length, b.length);
  for (let i = 0; i < min; i += 1) {
    if (a[i] === b[i]) same += 1;
  }
  return same / max;
}

function parseStatLine(line: string): OcrDraftStatRow | null {
  const normalizedLine = normalizeText(line);
  const rawNormalizedLine = line.normalize('NFKC').trim();
  const matched = normalizedLine.match(/^(.+?)\s*([+-]?\d+(?:\.\d+)?%?)$/);
  const rawMatched = rawNormalizedLine.match(/^(.+?)\s*([+-]?\d+(?:\.\d+)?%?)$/);
  if (!matched || !rawMatched) return null;
  const [, statNameRaw, statValueRaw] = rawMatched;

  const confidenceBase = /%|\./.test(statValueRaw) ? 0.92 : 0.9;
  return {
    statName: { value: statNameRaw, confidence: 0.86, normalizedValue: buildComparableText(statNameRaw) },
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

function getStatusAliases(status: PublicMasterStatus): string[] {
  const aliases = STATUS_ALIASES[status.code] ?? [];
  return [status.displayName, ...aliases];
}

function rankMatch(statName: string, statuses: PublicMasterStatus[]): MatchCandidate[] {
  const raw = statName.trim();
  const normalized = normalizeText(statName);
  const comparable = buildComparableText(statName);

  const all = statuses.flatMap((status) => {
    const aliases = getStatusAliases(status);
    return aliases.map((alias) => {
      const aliasNormalized = normalizeText(alias);
      const aliasComparable = buildComparableText(alias);

      if (raw === alias) return { status, matchType: 'exact' as const, confidence: 1 };
      if (normalized === aliasNormalized) return { status, matchType: 'normalized' as const, confidence: 0.96 };
      if (comparable === aliasComparable) return { status, matchType: 'alias' as const, confidence: 0.92 };
      if (comparable.includes(aliasComparable) || aliasComparable.includes(comparable)) {
        return { status, matchType: 'partial' as const, confidence: 0.75 };
      }

      const score = similarity(comparable, aliasComparable);
      if (score >= 0.68) return { status, matchType: 'similar' as const, confidence: Number((score * 0.85).toFixed(2)) };
      return null;
    });
  }).filter((item): item is MatchCandidate => item !== null);

  const deduped = Array.from(
    all.reduce((map, item) => {
      const existing = map.get(item.status.code);
      if (!existing || existing.confidence < item.confidence) map.set(item.status.code, item);
      return map;
    }, new Map<string, MatchCandidate>()).values(),
  );

  return deduped.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}

function mapRow(row: OcrDraftStatRow | undefined, statuses: PublicMasterStatus[]): OcrMappedDraftStat | undefined {
  if (!row || !row.statName) return undefined;
  const ranked = rankMatch(row.statName.value, statuses);
  const best = ranked[0];

  if (!best) {
    return {
      ...row,
      candidateStatuses: [],
      unresolvedReason: '公開マスタへマッピングできないため手動補正が必要です。',
    };
  }

  const hasOcrSuspicion = /夕メージ/.test(row.statName.value);
  const isAmbiguous = ranked.length > 1 && (ranked[0].confidence - ranked[1].confidence) < 0.12;
  const unresolvedReason = (best.confidence < 0.85 || hasOcrSuspicion || isAmbiguous)
    ? '候補の信頼度または曖昧性により手動補正が必要です。'
    : undefined;
  return {
    ...row,
    matchedStatus: best.status,
    matchType: best.matchType,
    confidence: best.confidence,
    candidateStatuses: ranked.map((item) => ({ code: item.status.code, displayName: item.status.displayName, matchType: item.matchType, confidence: item.confidence })),
    unresolvedReason,
  };
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
