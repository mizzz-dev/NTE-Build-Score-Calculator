# Active Issues（Context Bootstrap）

最終更新: 2026-05-16（Issue #143 対応反映）

## 1. 現在Open Issue

- #143: canonicalページ別方針見直し / metadata noindex反映（対応済み・PR作成待ち）
- #141: metadata・OGP・canonical・robots の公開前最終整備（完了）
- #139: 利用規約・免責・プライバシー方針ページ整備（完了）
- #137: 正式リリース前の品質・SEO・規約表示確認（完了）
- #135: 条件付き正式展開後のOCR監視運用を月次サイクルへ移行（完了）
- #133: `image_quality_low` 起因の事前撮影ガイド・再撮影導線改善（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #143: canonicalページ別方針見直し / metadata noindex反映（P1）
2. sitemap実装要否の確定（必要なら別Issue化）
3. 商用利用前の権利・法務確認（要確認）
4. 正式リリース準備・リリースノート作成
5. 公開前最終チェックリスト整備

## 3. 優先順位（暫定）

- P1: #143 root layout canonical強制の見直し
- P1: #143 公開前index抑制フラグをmetadata robotsへ反映
- P1: secretや環境変数が公開されていないことの継続監査
- P1: sitemap整備要否の判断（公開URL確定後）
- P2: 正式リリース準備・リリースノート作成
- P2: 商用利用前の権利・法務確認

## 4. Blocker

- Issue #141 / PR #142 は完了済み。
- PR #142 のCodex Reviewでcanonicalとnoindex制御に関するP1指摘が出ている。
- 次はIssue #143で、root layoutが全ページへホームcanonicalを強制しないようにし、公開前noindexをmetadataにも反映する。
- 法務判断の確定は引き続き対象外（要確認）。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #141 対応内容は `docs/logs/2026-05-16-issue-141-metadata-ogp-canonical-robots.md` を参照。
- Issue #143では、`src/app/layout.tsx` と `src/app/robots.ts` を確認する。
- `/terms` `/privacy` `/disclaimer` がホームcanonicalとして扱われないようにする。
- 公開前index抑制フラグが有効な場合にmetadata側でも明示的なnoindex指示を返す。
- sitemap実装は公開URL運用方針確定後に別Issueで判断する。
- 公式素材・ゲーム画像は追加しない。
- 誇大表現、公式風表現、正確性保証と誤解される表現を避ける。
- 評価画像や個人情報をRepositoryへ保存しない。
