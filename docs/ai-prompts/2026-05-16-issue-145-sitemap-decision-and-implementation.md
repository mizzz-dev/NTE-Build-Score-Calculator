# AI Prompt Log - Issue #145 sitemap実装要否確定と実装

- 日付: 2026-05-16
- 対象Issue: #145

## 1. ユーザー依頼（要約）

- `docs/ai-protocol/PROMPT.txt` を最優先で遵守。
- Issue #141 / #143 の実装を踏まえ、公開URL運用方針に合わせて sitemap実装要否を確定。
- 必要な場合は `src/app/sitemap.ts` を追加し、`robots.ts` の参照と矛盾しない状態にする。
- `NEXT_PUBLIC_SITE_URL` のfallback方針を既存metadata/robotsと揃える。
- `NEXT_PUBLIC_ROBOTS_NOINDEX=true` 時の扱いを明記。
- `docs/current-status.md` / `docs/active-issues.md` 更新、作業ログ・AIプロンプトログ保存。

## 2. 実行方針

1. 既存ルールと関連ログ（Issue #141 / #143）を確認。
2. 現在の公開対象ページを棚卸し。
3. sitemap実装要否を判断。
4. 必要最小限の `src/app/sitemap.ts` を実装。
5. 関連ドキュメントを更新。
6. `pnpm lint` / `pnpm test` / `pnpm build` を実行し結果を記録。

## 3. 注意事項

- 法務判断は確定しない（要確認継続）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は変更しない。
