import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約 | NTE Build Score Calculator',
  description: 'NTE Build Score Calculator の利用規約（要確認事項を含む）',
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">利用規約</h1>
      <p className="text-sm text-[var(--color-text-secondary)]">本ページは正式公開前の暫定版です。法務判断の確定は行わず、要確認事項を含みます。</p>
      <section className="space-y-2"><h2 className="text-lg font-semibold">1. 本サービスの位置づけ</h2><p>本ツールは非公式ファンツールであり、公式運営・権利者とは関係ありません。</p><p>公式素材・名称・ゲーム内情報・画像などの利用可否は要確認です。</p></section>
      <section className="space-y-2"><h2 className="text-lg font-semibold">2. 利用者の責任</h2><p>OCRは入力補助機能です。最終確認・最終決定は利用者自身の責任で行ってください。</p><p>計算結果・OCR結果・ランキング結果の正確性は保証しません。</p></section>
      <section className="space-y-2"><h2 className="text-lg font-semibold">3. 画像アップロード時の注意</h2><p>個人情報・アカウント情報・機密情報を含む画像はアップロードしないでください。</p><p>画像処理はブラウザ内処理を基本とし、サーバー保存しない方針です。</p></section>
      <section className="space-y-2"><h2 className="text-lg font-semibold">4. 権利・商用利用</h2><p>商用利用前には、利用者自身で権利・法務確認を実施してください。</p><p>公式素材・名称・ゲーム内情報・画像などの利用可否判断は要確認です。</p></section>
      <section className="space-y-2"><h2 className="text-lg font-semibold">5. 秘密情報の取り扱い方針</h2><p>公開設定として扱うキーは Supabase Anon Key のみとします。</p><p>Supabase Anon Key 以外の secret は公開しない方針です。</p></section>
      <section className="space-y-2"><h2 className="text-lg font-semibold">6. サポート範囲</h2><p>問い合わせ・サポート範囲は限定的であり、対応時期・回答を保証しません。</p></section>
    </main>
  );
}
