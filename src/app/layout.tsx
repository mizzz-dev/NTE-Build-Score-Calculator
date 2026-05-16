import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nte-build-score-calculator.vercel.app';
const isNoIndex = process.env.NEXT_PUBLIC_ROBOTS_NOINDEX === 'true';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NTE Build Score Calculator | 非公式ファンツール',
    template: '%s | NTE Build Score Calculator',
  },
  description:
    'Neverness to Everness（NTE）のビルドスコア計算を支援する非公式ファンツールです。OCRは入力補助であり、最終確認は利用者が行ってください。',
  robots: isNoIndex
    ? {
        index: false,
        follow: false,
      }
    : {
        index: true,
        follow: true,
      },
  openGraph: {
    title: 'NTE Build Score Calculator | 非公式ファンツール',
    description:
      'Neverness to Everness（NTE）のビルドスコア計算を支援する非公式ファンツールです。OCRは入力補助であり、最終確認は利用者が行ってください。',
    type: 'website',
    siteName: 'NTE Build Score Calculator',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'NTE Build Score Calculator | 非公式ファンツール',
    description:
      'NTEのビルドスコア計算を支援する非公式ファンツール。OCRは入力補助で、最終確認は利用者が行ってください。',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
