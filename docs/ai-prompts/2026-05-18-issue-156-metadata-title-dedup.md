# AIプロンプトログ: Issue #156 metadata title重複解消

- 日付: 2026-05-18
- 対象Issue: #156

## ユーザー指示（要約）
- `docs/ai-protocol/PROMPT.txt` を最優先で遵守。
- PR #155 レビュー指摘（`/score` `/card` `/compare` のmetadata title重複リスク）を解消。
- root layoutの `title.template` を維持。
- `/score`: `スコア計算`、`/card`: `カード管理`、`/compare`: `比較` に調整。
- canonicalは維持。
- `docs/current-status.md` と `docs/active-issues.md` を更新。
- 作業ログとAIプロンプトログを保存。

## 実行方針
- 変更範囲をmetadata titleとドキュメント更新に限定。
- SEO整合（title template + page title）のみを修正し、他機能には非干渉。
- 禁止事項（deploy/環境変数/法務確定/OCRやDB仕様変更）を厳守。
