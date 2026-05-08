import { FeatureCard } from '@/components/ui/FeatureCard';
import { NeonPanel } from '@/components/ui/NeonPanel';
import { PrimaryCTA } from '@/components/ui/PrimaryCTA';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';

type EmptyStatePageProps = {
  title: string;
  subtitle: string;
  badge: string;
};

export function EmptyStatePage({ title, subtitle, badge }: EmptyStatePageProps) {
  return (
    <section className="space-y-6">
      <SectionHeader title={title} subtitle={subtitle} />
      <NeonPanel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusBadge label={badge} />
          <PrimaryCTA href="/guide" label="使い方を見る" />
        </div>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          この画面は UI デザインシステムを適用した空状態です。機能仕様確定後に、責務分離に従って入力・表示機能を実装します。
        </p>
      </NeonPanel>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FeatureCard title="可読性重視" description="日本語の情報密度を保ちつつ、ダーク背景でも視認しやすい配色で統一しています。" />
        <FeatureCard title="近未来ネオン" description="アクセントと境界線の発光を最小限に使い、操作対象を見失わない設計にしています。" />
        <FeatureCard title="レスポンシブ" description="スマホ1カラム、タブレット可変、PC広幅でも破綻しない余白・行長を採用しています。" />
      </div>
    </section>
  );
}
