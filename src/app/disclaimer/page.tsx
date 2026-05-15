import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '免責事項 | NTE Build Score Calculator',
  description: 'NTE Build Score Calculator の免責事項（要確認事項を含む）',
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">免責事項</h1>
      <p className="text-sm text-[var(--color-text-secondary)]">本ページは正式公開前の暫定版です。法務判断の確定は行わず、要確認事項を含みます。</p>
      <section className="space-y-2"><h2 className="text-lg font-semibold">1. 非公式ツールであること</h2><p>本ツールは非公式ファンツールであり、公式運営・権利者とは関係ありません。</p></section>
      <section className="space-y-2"><h2 className="text-lg font-semibold">2. 正確性の非保証</h2><p>計算結果・OCR結果・ランキング結果の正確性、完全性、有用性を保証しません。</p><p>OCRは入力補助であり、最終確認は利用者責任です。</p></section>
      <section className="space-y-2"><h2 className="text-lg font-semibold">3. 画像と情報の取り扱い</h2><p>画像処理はブラウザ内処理を基本とし、サーバー保存しない方針です。</p><p>個人情報・アカウント情報・機密情報を含む画像の利用は禁止します。</p></section>
      <section className="space-y-2"><h2 className="text-lg font-semibold">4. 権利・法務確認（要確認）</h2><p>公式素材・名称・ゲーム内情報・画像などの利用可否は要確認です。</p><p>商用利用前には、利用者自身で権利・法務確認を実施してください。</p></section>
      <section className="space-y-2"><h2 className="text-lg font-semibold">5. 秘密情報と公開範囲</h2><p>公開設定として扱うキーは Supabase Anon Key のみです。</p><p>Supabase Anon Key 以外の secret は公開しない方針です。</p></section>
      <section className="space-y-2"><h2 className="text-lg font-semibold">6. サポート責任の範囲</h2><p>問い合わせ・サポート範囲は限定的であり、対応結果を保証しません。</p></section>
    </main>
  );
}
