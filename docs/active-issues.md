# Active Issues（Context Bootstrap）

最終更新: 2026-05-15（PR #138 merge後処理 / Issue #139 作成反映）

## 1. 現在Open Issue

- #139: 利用規約・免責・プライバシー方針ページ整備（open）
- #137: 正式リリース前の品質・SEO・規約表示確認（完了）
- #135: 条件付き正式展開後のOCR監視運用を月次サイクルへ移行（完了）
- #133: `image_quality_low` 起因の事前撮影ガイド・再撮影導線改善（完了）
- #131: `/compare` 比較ブロック理由に応じて案内文を出し分ける（完了）
- #129: `/compare` OCRの未確定項目解消フローのUX文言改善（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #139: 利用規約・免責・プライバシー方針ページ整備（P0）
2. metadata/OGP/canonical/robots の公開前最終整備（P1）
3. 商用利用前の権利・法務確認（要確認）
4. 正式リリース準備・リリースノート作成

## 3. 優先順位（暫定）

- P0: #139 利用規約・免責・プライバシー方針ページ整備
- P1: metadata/OGP/canonical/robots の公開前最終整備
- P1: secretや環境変数が公開されていないことの継続監査
- P2: 正式リリース準備・リリースノート作成
- P2: 商用利用前の権利・法務確認

## 4. Blocker

- Issue #137 / PR #138 は完了済み。
- 次は正式公開前P0として、利用規約・免責・プライバシー方針ページを整備する。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。
- 法務判断の確定はIssue #139の対象外とし、要確認事項を整理する。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- 次に `docs/logs/2026-05-15-issue-137-pre-release-quality-seo-compliance-audit.md` を確認する。
- Issue #139では、利用規約・免責・プライバシー方針ページを追加し、必要最小限の導線を整える。
- 非公式ファンツール表記、画像非保存、OCR補助、ユーザー最終確認責任、正確性非保証を明記する。
- 公式素材・名称・ゲーム内情報・画像などの利用可否は要確認として扱う。
- 評価画像や個人情報をRepositoryへ保存しない。
