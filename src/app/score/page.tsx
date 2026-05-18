import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { ScorePageContainer } from '@/features/score/components/ScorePageContainer';

export const metadata: Metadata = {
  title: 'スコア計算 | NTE Build Score Calculator',
  description: 'NTEビルドのスコア計算を行う非公式ファンツールのメイン画面です。',
  alternates: {
    canonical: '/score',
  },
};

function ScorePageFallback() {
  return (
    <NeonPanel className="space-y-3">
      <p className="text-sm text-[var(--color-text-secondary)]">スコア計算画面を読み込んでいます。</p>
    </NeonPanel>
  );
}

export default function ScorePage() {
  return (
    <Suspense fallback={<ScorePageFallback />}>
      <ScorePageContainer />
    </Suspense>
  );
}
