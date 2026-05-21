# AIプロンプトログ: Issue #177

- 日付 (UTC): 2026-05-21
- 対象Issue: #177

## ユーザープロンプト要約

- `docs/ai-protocol/PROMPT.txt` を最優先で遵守。
- Issue #175 / PR #176 の成果を前提に、公開実行Issueを安全に起票するための記録項目を整理。
- 人間承認フロー開始条件、deploy前後確認項目の分離、役割分担、rollback判定欄を定義。
- `docs/current-status.md` と `docs/active-issues.md` の状態同期を実施。
- 作業ログとAIプロンプトログを保存。
- 本番deploy・本番設定変更・機微情報保存は実施禁止。

## AI実施方針

1. 既存Runbook・レポートとの整合を維持する。
2. 新規テンプレートは公開実行Issue起票用途に限定する。
3. 推測記入を禁止し、未確認は未確認として記録する方針を維持する。
4. Open Issue表記と次作業表記の矛盾を解消する。
