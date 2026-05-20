# AIプロンプトログ: Issue #171 人間最終Go承認と本番公開条件証跡の提出

- 記録日: 2026-05-20 (UTC)
- 対象Issue: #171

## ユーザー依頼（要約）

- `docs/ai-protocol/PROMPT.txt` を最優先ルールとして遵守。
- 修正済みテンプレート（Issue #169 / PR #170反映）に沿って、以下をRepositoryへ保存。
  1. 人間最終Go承認
  2. 本番公開URL一致証跡
  3. 検索公開設定証跡
  4. rollback参照コミット / rollback方針
- 4条件充足なら公開実行前Go判定をGo、不足ならNo-Go継続で不足項目と再開条件を記録。
- deploy実行ログURLは公開実行後確認項目とし、公開実行前Go判定条件に含めない。
- `docs/current-status.md` と `docs/active-issues.md` を更新。
- 作業ログを `docs/logs/`、AIプロンプトログを `docs/ai-prompts/` に保存。
- 実公開・本番設定変更は行わない。

## 実施方針

- 変更対象をドキュメントに限定し、推測補完を禁止。
- 既存正本（Issue #158 レポート、Issue #169 ログ、提出テンプレート）との整合を維持。
- 判定に必要な証跡不足時は No-Go継続として不足項目と再開条件を明示。
