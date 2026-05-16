# Active Issues（Context Bootstrap）

最終更新: 2026-05-16（Issue #141 対応反映）

## 1. 現在Open Issue

- #141: metadata・OGP・canonical・robots の公開前最終整備（完了）
- #139: 利用規約・免責・プライバシー方針ページ整備（完了）
- #137: 正式リリース前の品質・SEO・規約表示確認（完了）
- #135: 条件付き正式展開後のOCR監視運用を月次サイクルへ移行（完了）
- #133: `image_quality_low` 起因の事前撮影ガイド・再撮影導線改善（完了）
- #131: `/compare` 比較ブロック理由に応じて案内文を出し分ける（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. sitemap実装要否の確定（必要なら別Issue化）
2. 商用利用前の権利・法務確認（要確認）
3. 正式リリース準備・リリースノート作成
4. 公開前最終チェックリスト整備

## 3. 優先順位（暫定）

- P1: secretや環境変数が公開されていないことの継続監査
- P1: sitemap整備要否の判断（公開URL確定後）
- P2: 正式リリース準備・リリースノート作成
- P2: 商用利用前の権利・法務確認

## 4. Blocker

- metadata/OGP/Twitter/canonical/robots の最小整備は完了。
- 法務判断の確定は引き続き対象外（要確認）。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #141 対応内容は `docs/logs/2026-05-16-issue-141-metadata-ogp-canonical-robots.md` を参照。
- sitemap実装は公開URL運用方針確定後に別Issueで判断する。
- 公式素材・ゲーム画像は追加しない。
- 誇大表現、公式風表現、正確性保証と誤解される表現を避ける。
- 評価画像や個人情報をRepositoryへ保存しない。
