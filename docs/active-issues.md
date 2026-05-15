# Active Issues（Context Bootstrap）

最終更新: 2026-05-15（PR #140 merge後処理 / Issue #141 作成反映）

## 1. 現在Open Issue

- #141: metadata・OGP・canonical・robots の公開前最終整備（open）
- #139: 利用規約・免責・プライバシー方針ページ整備（完了）
- #137: 正式リリース前の品質・SEO・規約表示確認（完了）
- #135: 条件付き正式展開後のOCR監視運用を月次サイクルへ移行（完了）
- #133: `image_quality_low` 起因の事前撮影ガイド・再撮影導線改善（完了）
- #131: `/compare` 比較ブロック理由に応じて案内文を出し分ける（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #141: metadata/OGP/canonical/robots の公開前最終整備（P1）
2. 商用利用前の権利・法務確認（要確認）
3. 正式リリース準備・リリースノート作成
4. 公開前最終チェックリスト整備

## 3. 優先順位（暫定）

- P1: #141 metadata/OGP/canonical/robots の公開前最終整備
- P1: secretや環境変数が公開されていないことの継続監査
- P2: 正式リリース準備・リリースノート作成
- P2: 商用利用前の権利・法務確認

## 4. Blocker

- Issue #139 / PR #140 は完了済み。
- 次は公開前P1として、metadata/OGP/canonical/robots を現在の機能内容と矛盾しない形へ最終調整する。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。
- 法務判断の確定はIssue #141の対象外とし、公式素材・ゲーム画像は追加しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- 次に `docs/logs/2026-05-15-issue-137-pre-release-quality-seo-compliance-audit.md` と `docs/logs/2026-05-15-issue-139-terms-disclaimer-privacy-pages.md` を確認する。
- Issue #141では、metadata/OGP/Twitter/canonical/robotsを公開前向けに整理する。
- 公式素材・ゲーム画像は追加しない。
- 誇大表現、公式風表現、正確性保証と誤解される表現を避ける。
- 評価画像や個人情報をRepositoryへ保存しない。
