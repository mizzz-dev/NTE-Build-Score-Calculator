# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-15（Issue #133 対応反映）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。

## 3. 直近完了タスク（Issue #131 / PR #132）

Issue #131 / PR #132 で `/compare` の比較ブロック理由に応じた案内文出し分けを完了しました。

実施内容:
- `canRunCompareWithOcrGuard` の返却値を拡張し、ブロック理由を `input` / `ocr` に分類。
- `reasonDetails` と `hasOcrBlockingReason` を追加。
- 入力エラーのみの場合はOCR未確定向けガイドを表示しないよう制御。
- OCR由来のブロック理由がある場合のみ、未確定残件数と確認順ガイドを表示。
- A/B未確定件数表示、未確定0件まで比較実行をブロックするガード、低信頼度候補を自動確定しない方針を維持。
- OCRアルゴリズム、OCR信頼度計算、保存payload仕様、共有URL仕様、ランキング仕様は未変更。

## 4. 直近完了タスク（Issue #133）

Issue #133 で `image_quality_low` 起因の事前撮影ガイドと再撮影導線改善を完了しました。

実施内容:
- OCR実行前チェックに、明るさ・傾き/ブレ回避・ステータス欠け防止・個人情報写り込み防止を追加。
- OCR失敗時に「再撮影で再試行」または「手動入力継続」を選べる案内へ更新。
- `/score` `/card` `/compare` のOCR導線へ最小差分で反映（共通パネル文言中心）。
- OCRアルゴリズム、OCR信頼度計算、保存payload/共有URL/ランキング仕様は未変更。

## 5. 進行中 / 次フェーズ

- 完了: Issue #133（`image_quality_low` 起因の事前撮影ガイド・再撮影導線改善）
- 次候補:
  1. 条件付き正式展開後の監視運用をRunbook + 監査ログで月次運用へ移行
  2. 正式リリース前の品質・SEO・規約整備
  3. 利用規約・免責・非公式ファンツール表記の再確認

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
- `docs/active-issues.md`
