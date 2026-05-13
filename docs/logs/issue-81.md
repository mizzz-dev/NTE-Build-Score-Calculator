# Issue #81 作業ログ

## 1. 対象
- Issue: #81 /score OCR品質評価運用定義
- スコープ: docs整備のみ（OCRアルゴリズム・UI・DB変更なし）

## 2. 実施内容
- `docs/reports/ocr-quality-evaluation.md` を新規作成し、目的/非目的、評価対象、KPI、サンプル画像カテゴリ、評価手順、受け入れ基準（暫定）、失敗分類、`/card` `/compare` 展開判定基準を定義。
- `docs/current-status.md` を更新し、次フェーズを「評価運用の定着」に具体化。
- `docs/active-issues.md` を更新し、#81 を現在Issueに反映。
- `docs/risks/risks.md` に「OCR品質評価運用不足リスク」を追記。
- 再利用用入力として `docs/ai-prompts/issue-81-ocr-quality-evaluation-operations.md` を追加。

## 3. 判断メモ
- 個人情報保護・画像非保存方針を評価手順内に明記し、既存OCR要件との整合を維持。
- 受け入れ基準は「暫定」とし、母数安定後に固定する前提を残した。
- `/card` `/compare` への展開は、連続サイクル達成を条件とするゲート基準で定義。

## 4. 残課題
- KPI実測に基づく閾値の正式化（要確認）。
- 週次レポート雛形の標準化（要確認）。
