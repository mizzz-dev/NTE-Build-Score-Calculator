import type { Metadata } from 'next';
import { CardPageContainer } from '@/features/card/components/CardPageContainer';

export const metadata: Metadata = {
  title: 'カード管理',
  description: 'NTEビルドのカード情報を入力・確認する非公式ファンツールの画面です。',
  alternates: {
    canonical: '/card',
  },
};

export default function CardPage() {
  return <CardPageContainer />;
}
