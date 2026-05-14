# AI Prompt Log: Issue #105 `/card` OCR入力補助 要件詳細化・監視設計

- 日付: 2026-05-13
- 対象Issue: #105

## ユーザー依頼（要約）

- `docs/ai-protocol/PROMPT.txt` を最優先遵守。
- `/card` OCR入力補助の実装前要件を詳細化（実装はしない）。
- 責務境界、流用/分離責務、項目別反映ルール、payload非混入方針、確認/fallback導線、KPI、回帰観点、ロールバック条件、次Issue最小スコープを整理。
- `docs/current-status.md` と `docs/active-issues.md` を更新。
- 成果物を `docs/reviews` or `docs/logs`、作業ログを `docs/logs`、AIプロンプトログを `docs/ai-prompts` に保存。

## 出力方針

- 日本語で統一。
- 非公式ファンツール前提を維持。
- 仕様未確定事項は「要確認」として明記。
- 実装禁止領域には触れない。
