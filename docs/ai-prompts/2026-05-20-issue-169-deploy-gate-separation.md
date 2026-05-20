# AIプロンプトログ: Issue #169 deploy前後条件分離

- 記録日: 2026-05-20 (UTC)
- 対象Issue: #169

## ユーザー依頼（要約）

- `docs/ai-protocol/PROMPT.txt` を最優先で遵守。
- `docs/runbooks/official-release-approval-and-evidence-submission-template.md` の
  公開実行前Go判定条件に含まれている deploy実行ログURL を除外。
- deploy前条件（Go承認 / 本番URL一致 / 検索公開設定 / rollback確認）へ整理。
- deploy実行ログURLを deploy後確認項目へ移動。
- 最終判定チェックを「公開実行前Go判定チェック」「公開実行後確認チェック」に分離。
- 保存可/保存不可方針は維持。
- `docs/current-status.md` `docs/active-issues.md` を更新。
- 作業ログを `docs/logs/`、AIプロンプトログを `docs/ai-prompts/` に保存。
- 実公開・本番設定変更は行わない。

## 実施方針

- 変更対象はドキュメントのみに限定。
- Issue #158 の deploy前 / deploy中 / deploy後区分と整合する記述へ修正。
- 推測補完は禁止し、未確認事項は未確認として扱う。
