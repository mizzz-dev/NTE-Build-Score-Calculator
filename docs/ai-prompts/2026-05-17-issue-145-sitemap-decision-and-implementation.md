# AIプロンプトログ: Issue #145 sitemap実装要否の確定と実装

- 日付: 2026-05-17
- 対象Issue: #145

## 入力プロンプト要約

- `docs/ai-protocol/PROMPT.txt` を最優先で遵守。
- `docs/current-status.md` `docs/active-issues.md` と過去ログ（Issue #141/#143）を確認。
- `robots.ts` と公開対象ページの整合を確認し、sitemap実装要否を確定。
- 必要時は `MetadataRoute.Sitemap` で `src/app/sitemap.ts` を最小実装。
- `NEXT_PUBLIC_SITE_URL` とfallback URL方針を既存metadata/robotsと整合。
- `NEXT_PUBLIC_ROBOTS_NOINDEX=true` 時の扱いを明記。
- 法務判断を確定しない、公式素材・ゲーム画像を追加しない。
- OCR/DB/auth/infra/deployment/payload/ranking仕様は変更しない。

## AI実行メモ

- 公開対象ページを棚卸しし、`/admin` を除外して sitemap 対象を定義。
- `robots.ts` の sitemap参照と矛盾しないよう `src/app/sitemap.ts` を追加。
- noindex時は空sitemapを返す方針で公開前運用と整合。
- ステータス文書と作業ログを更新。
