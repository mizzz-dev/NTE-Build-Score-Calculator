# AI Prompt Log - Issue #143 canonical / metadata noindex 修正

- 日付: 2026-05-16
- 対象Issue: #143
- 背景: PR #142 / Issue #141 のCodex ReviewでのP1指摘対応

## 入力要件（要約）

- `docs/ai-protocol/PROMPT.txt` を最優先遵守
- `docs/current-status.md` / `docs/active-issues.md` / Issue #141ログの確認
- root layoutのcanonical強制を止める
- `NEXT_PUBLIC_ROBOTS_NOINDEX=true` 時に metadata 側も noindex 化
- `/terms` `/privacy` `/disclaimer` がホームcanonical扱いにならないこと
- robots.ts とmetadata robotsの矛盾を防ぐ
- 公式素材・ゲーム画像を追加しない
- 法務判断を確定しない

## 実施方針（AI判断）

1. `layout.tsx` からルートcanonical固定を削除し、環境変数連動の metadata robots を追加。
2. 規約系3ページへ個別canonicalを明示。
3. robots.ts は既存方針を維持し、metadata側のみ不足分を補完。
4. status/active issues/ログ/AIプロンプトログを更新。
5. lint/test/build を実行し結果を記録。
