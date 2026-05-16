# AI Prompt Log - Issue #141 metadata/OGP/canonical/robots

- 日付: 2026-05-16
- 対象Issue: #141
- 目的: metadata/OGP/canonical/robots を公開前に最小整備し、非公式ファンツール表記と機能説明の整合性を確保する

## 入力要件（要約）

- `docs/ai-protocol/PROMPT.txt` を最優先遵守
- `docs/current-status.md` / `docs/active-issues.md` / #137監査ログを確認
- `src/app/layout.tsx` と robots/canonical/sitemap/manifest相当を確認
- 法務判断は確定しない（要確認）
- 公式素材・ゲーム画像を使わない
- OCR/DB/auth/infra/deployment/payload/ランキング仕様は変更しない

## 実施方針（AI判断）

1. `layout.tsx` metadataを現行機能説明へ更新し、非公式表記を明記。
2. OGP/Twitterは画像なし最小構成（権利リスク回避）。
3. canonicalは `metadataBase` + `alternates.canonical` で最小対応。
4. robotsは環境変数で index/noindex を切替できる実装を追加。
5. sitemapは実装を別Issue候補にし、今回は方針明記に留める。
6. status/issue文書と作業ログを更新する。
