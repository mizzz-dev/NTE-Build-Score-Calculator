# Issue #139 作業ログ（利用規約・免責・プライバシー方針ページ整備）

- 作成日: 2026-05-15
- 対象Issue: #139

## 実施内容
- `docs/ai-protocol/PROMPT.txt`、`docs/current-status.md`、`docs/active-issues.md`、Issue #137監査ログを確認。
- `src/app/terms/page.tsx` に利用規約ページを追加。
- `src/app/disclaimer/page.tsx` に免責事項ページを追加。
- `src/app/privacy/page.tsx` にプライバシー方針ページを追加。
- `src/components/layout/AppFooter.tsx` に規約系3ページへの導線を追加。
- `docs/current-status.md` と `docs/active-issues.md` をIssue #139進行状況に合わせて更新。
- 作業ログとAIプロンプトログを追加。

## 仕様反映メモ
- 非公式ファンツールであることを各ページで明記。
- OCRは入力補助であり、最終確認はユーザー責任であることを明記。
- 計算結果/OCR結果/ランキング結果の正確性非保証を明記。
- 画像はブラウザ内処理を基本とし、サーバー保存しない方針を明記。
- 個人情報・アカウント情報・機密情報を含む画像のアップロード注意を明記。
- 公式素材・名称・ゲーム内情報・画像などの利用可否は要確認と明記。
- 商用利用前の権利・法務確認が必要である旨を明記。
- Supabase Anon Key以外のsecretを公開しない方針を明記。
- 問い合わせ/サポート範囲が限定的であることを明記。

## 非変更（禁止事項遵守）
- OCRアルゴリズム、OCR信頼度計算
- DB / auth / infra / deployment
- 保存payload仕様 / ランキング仕様
- 外部OCR API連携

## テスト
- `pnpm lint`
- `pnpm test`
- `pnpm build`

## 残課題
- 法務判断の確定（引き続き要確認）
- metadata/OGP/canonical/robots の公開前最終整備（P1）

## Rollback
1. `git revert <本Issue対応コミット>` を実行。
2. 追加した3ページとフッター導線、関連ドキュメント更新を差し戻す。
