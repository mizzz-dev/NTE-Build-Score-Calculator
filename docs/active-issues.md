# Active Issues（Context Bootstrap）

最終更新: 2026-05-17（Issue #145 実装反映）

## 1. 現在Open Issue

- #145: sitemap実装要否の確定と必要時のsitemap.ts追加（対応済み / PR作成待ち）
- #143: canonicalページ別方針見直し / metadata noindex反映（完了）
- #141: metadata・OGP・canonical・robots の公開前最終整備（完了）
- #139: 利用規約・免責・プライバシー方針ページ整備（完了）
- #137: 正式リリース前の品質・SEO・規約表示確認（完了）
- #135: 条件付き正式展開後のOCR監視運用を月次サイクルへ移行（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. 商用利用前の権利・法務確認（要確認）
2. 正式リリース準備・リリースノート作成
3. 公開前最終チェックリスト整備

## 3. 優先順位（暫定）

- P1: secretや環境変数が公開されていないことの継続監査
- P1: 商用利用前の権利・法務確認（要確認）
- P2: 正式リリース準備・リリースノート作成
- P2: 商用利用前の権利・法務確認

## 4. Blocker

- Issue #145 の実装は完了し、robots.ts の sitemap.xml 参照とsitemap本体は整合済み。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #141 対応内容は `docs/logs/2026-05-16-issue-141-metadata-ogp-canonical-robots.md` を参照。
- Issue #143 対応内容は `docs/logs/2026-05-16-issue-143-canonical-metadata-noindex-fix.md` を参照。
- Issue #145では `src/app/sitemap.ts` を追加済み。`NEXT_PUBLIC_ROBOTS_NOINDEX=true` 時は空sitemapを返す。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
