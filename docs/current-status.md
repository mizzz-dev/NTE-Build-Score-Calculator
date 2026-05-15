# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-15（Issue #131 実装反映）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。

## 3. 直近完了タスク（Issue #129 / PR #130）

Issue #129 / PR #130 で `/compare` OCRの未確定項目解消フローのUX文言改善を実施済みです。

実施内容:
- 比較前確認ガードの文言を更新し、未確定残件数（合計/A/B）とA/B対象を明示。
- 比較前ブロックパネルへ確認順ガイド（A解消 → B解消 → 確認済みチェック）を追加。
- 未確定0件まで比較実行をブロックする既存ガードを維持。
- 低信頼度候補を自動確定しない方針を維持。
- 保存payload・共有URL・ランキングpayloadへのOCRメタ非混入方針を維持。

## 4. 現在の次作業（Issue #131）

Issue #131 で `/compare` の比較ブロック理由に応じた案内文出し分けを実施し、入力エラー系とOCR確認系の分類を導入済みです。

目的:
- 入力エラーのみで比較がブロックされる場合は、OCR未確定向けガイドを表示しない。
- OCR下書き確認未完了、未確定OCR項目残存、OCR失敗状態などOCR由来の理由がある場合のみ、未確定残件数と確認順ガイドを表示する。
- 未確定0件まで比較実行をブロックする既存ガードを維持する。
- 低信頼度候補を自動確定しない方針を維持する。
- OCRメタ非混入方針を維持する。

## 5. 進行中 / 次フェーズ

- 完了: Issue #131（`/compare` 比較ブロック理由に応じた案内文出し分け）
- 次候補:
  1. `image_quality_low` 起因の事前撮影ガイド・再撮影導線改善
  2. 条件付き正式展開後の監視運用をRunbook + 監査ログで月次運用へ移行
  3. 正式リリース前の品質・SEO・規約整備

## 6. 注意すべき変更禁止領域

本フェーズでは以下を変更しない。

- OCRアルゴリズム
- OCR信頼度計算
- DB migration
- auth / infra / deployment 設定
- 保存payload仕様
- 共有URL仕様
- ランキング仕様
- 画像保存方式
- 外部OCR API連携
- 低信頼度候補の自動確定

## 7. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/reviews/issue-113-compare-ocr-requirements-and-observability.md`
- `docs/runbooks/compare-ocr-release-runbook.md`
- `docs/logs/issue-127-compare-ocr-post-release-monitoring-operations.md`
- `docs/logs/2026-05-15-issue-129-compare-ocr-unresolved-ux-copy.md`
- `docs/active-issues.md`
