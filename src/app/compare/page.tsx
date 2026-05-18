import type { Metadata } from 'next';
import { ComparePageContainer } from '@/features/compare/components/ComparePageContainer';

export const metadata: Metadata = {
  title: '比較',
  description: 'NTEビルド候補を比較する非公式ファンツールの画面です。',
  alternates: {
    canonical: '/compare',
  },
};

export default function ComparePage() {
  return <ComparePageContainer />;
}
