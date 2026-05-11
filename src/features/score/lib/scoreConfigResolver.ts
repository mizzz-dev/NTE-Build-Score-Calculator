import { createScoreConfigFromPublicMaster, type ScoreConfigFactoryWarning } from '@/lib/score/factory';
import { sampleScoreConfig } from '@/lib/score/sampleConfig';
import type { ScoreConfig } from '@/lib/score/types';
import type { PublicMasterLoadResult } from '@/features/public-master/types';

export type ScoreConfigResolution = {
  config: ScoreConfig;
  source: 'public-master' | 'sample-fallback';
  warnings: ScoreConfigFactoryWarning[];
  notice: string | null;
};

export function resolveScoreConfig(master: PublicMasterLoadResult | null): ScoreConfigResolution {
  if (!master) {
    return { config: sampleScoreConfig, source: 'sample-fallback', warnings: [], notice: null };
  }

  const factoryResult = createScoreConfigFromPublicMaster(master.data);
  if (factoryResult.usedFallback) {
    return {
      config: factoryResult.config,
      source: 'sample-fallback',
      warnings: factoryResult.warnings,
      notice: '一部マスタ情報を確認できなかったため、標準設定で計算しています。',
    };
  }

  return {
    config: factoryResult.config,
    source: 'public-master',
    warnings: [],
    notice: null,
  };
}
