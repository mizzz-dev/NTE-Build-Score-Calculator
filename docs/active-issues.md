# Active Issues（Context Bootstrap）

最終更新: 2026-05-15（Issue #135 月次監査運用ドキュメント整備）

## 1. 現在Open Issue

- #135: 条件付き正式展開後のOCR監視運用を月次サイクルへ移行（対応完了・レビュー待ち）
- #133: `image_quality_low` 起因の事前撮影ガイド・再撮影導線改善（完了）
- #131: `/compare` 比較ブロック理由に応じて案内文を出し分ける（完了）
- #129: `/compare` OCRの未確定項目解消フローのUX文言改善（完了）
- #127: `/compare` OCR正式展開後の監視運用定常化と残リスク改善方針整理（完了）
- #125: `/compare` OCR正式展開可否の最終判定と運用Runbook整備（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. 正式リリース前の品質・SEO・規約整備
2. 利用規約・免責・非公式ファンツール表記の再確認
3. 商用利用前の権利・法務確認
4. #135 レビュー反映と月次初回運用ログ作成

## 3. 優先順位（暫定）

- P1: 月次監査ログテンプレート運用開始（Issue #135 成果物の定着）
- P1: payload非混入・共有URL互換・ランキング互換・比較結果正当性の継続確認
- P2: 正式リリース前の品質・SEO・規約整備
- P2: 利用規約・免責・非公式ファンツール表記の再確認

## 4. Blocker

- Issue #133 / PR #134 は完了済み。
- 次は条件付き正式展開後の監視運用を、Runbookと監査ログに基づく月次サイクルへ移行する。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。
- 監視ログは匿名・集計値のみを扱い、画像や個人情報を保存しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/runbooks/compare-ocr-release-runbook.md` と `docs/logs/issue-127-compare-ocr-post-release-monitoring-operations.md` を確認する。
- Issue #135では、月次監査ログテンプレート、月次運用手順、しきい値超過時対応、改善Issue起票基準を整備する。
- 低信頼度候補の自動確定、OCRアルゴリズム変更、保存payload仕様変更は行わない。
- 評価画像や個人情報をRepositoryへ保存しない。
