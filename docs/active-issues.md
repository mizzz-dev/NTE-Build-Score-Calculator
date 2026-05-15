# Active Issues（Context Bootstrap）

最終更新: 2026-05-15（PR #132 merge後処理 / Issue #133 作成反映）

## 1. 現在Open Issue

- #133: `image_quality_low` 起因の事前撮影ガイド・再撮影導線改善（open）
- #131: `/compare` 比較ブロック理由に応じて案内文を出し分ける（完了）
- #129: `/compare` OCRの未確定項目解消フローのUX文言改善（完了）
- #127: `/compare` OCR正式展開後の監視運用定常化と残リスク改善方針整理（完了）
- #125: `/compare` OCR正式展開可否の最終判定と運用Runbook整備（完了）
- OCR関連継続Issue: 精度・UX・運用改善系（個別番号は都度追記）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #133: `image_quality_low` 起因の事前撮影ガイド・再撮影導線改善
2. 条件付き正式展開後の監視運用をRunbook + 監査ログで月次運用へ移行
3. 正式リリース前の品質・SEO・規約整備
4. 利用規約・免責・非公式ファンツール表記の再確認

## 3. 優先順位（暫定）

- P1: #133 撮影品質を上げる事前ガイド改善
- P1: #133 OCR失敗・低品質疑い時の再撮影/手動入力導線改善
- P1: payload非混入・共有URL互換・ランキング互換・比較結果正当性の継続確認
- P2: 条件付き正式展開後の運用Runbook適用と監査ログ蓄積
- P2: 正式リリース前の品質・SEO・規約整備

## 4. Blocker

- Issue #131 / PR #132 は完了済み。
- 次はIssue #127で分離された残リスクのうち、`image_quality_low` 起因の改善を進める。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/runbooks/compare-ocr-release-runbook.md` と `docs/logs/issue-127-compare-ocr-post-release-monitoring-operations.md` を確認する。
- Issue #133では、OCR実行前の撮影ガイドとOCR失敗・低品質疑い時の再撮影/手動fallback導線を改善する。
- 低信頼度候補の自動確定、OCRアルゴリズム変更、保存payload仕様変更は行わない。
- 評価画像や個人情報をRepositoryへ保存しない。
