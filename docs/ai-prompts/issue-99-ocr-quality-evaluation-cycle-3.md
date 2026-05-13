# Issue #99 AIプロンプトログ

- 日付: 2026-05-13
- 対象Issue: #99
- 目的: PR #98 で追加した低スペック端末向け待機UX・画像サイズ/画質事前ガイド・手動fallback判断の効果を、第3サイクル実測（匿名・集計値）で確認する。

## 入力プロンプト（要約）
- `docs/ai-protocol/PROMPT.txt` を最優先ルールとして遵守。
- 参照: `docs/logs/ocr-quality-evaluation-cycle-2.md` `docs/current-status.md` `docs/active-issues.md` `docs/reports/ocr-quality-evaluation.md`。
- 対応: 第3サイクル運用ログ新規作成、差分整理、低スペック端末p95改善明示、4秒/6秒案内分岐と手動fallback導線効果確認、画像事前ガイド効果確認。
- 更新: `docs/current-status.md` `docs/active-issues.md`（必要に応じて`docs/risks/risks.md`）。
- 追加: `docs/ai-prompts/` にIssue用プロンプト保存、`docs/logs/` に作業ログ保存。

## 出力方針
- 日本語で統一。
- OCRアルゴリズム/UI/インフラ等の禁止変更は実施しない。
- KPIは匿名・集計値のみ記録し、画像そのものは保存しない。
