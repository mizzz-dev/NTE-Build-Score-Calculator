# Issue #109 AIプロンプトログ

## ユーザー入力

docs/ai-protocol/PROMPT.txt を最優先ルールとして遵守し、Issue #109 に対応してください。

Repository:
https://github.com/mizzz-dev/NTE-Build-Score-Calculator

Target Issue:
https://github.com/mizzz-dev/NTE-Build-Score-Calculator/issues/109

目的:
Issue #107 / PR #108 で /card OCR入力補助の最小実装が追加されたため、限定導入後のKPI計測と、保存payload・共有URL・ランキングpayload互換の運用確認を実施してください。本Issueでは追加実装を最小限に抑え、/card OCR導入後の実測・回帰確認・監視条件の妥当性確認をRepositoryへ記録することが目的です。

（前提・対応内容・禁止事項・完了条件・出力要件はIssue本文指定を適用）

## AI実行方針（要約）
- `docs/ai-protocol/PROMPT.txt` と `AGENTS.md` を最優先で遵守する。
- `/card` OCR導入後のKPI計測ログを匿名・集計値で作成する。
- 保存payload・共有URL・ランキングpayload互換、`/compare`副作用なし、低信頼度自動確定禁止、手動fallback維持を回帰観点として記録する。
- 限定導入判定（継続可否）と、`/compare` OCR要件詳細化へ進める条件を整理する。
- `docs/current-status.md` `docs/active-issues.md` `docs/logs` `docs/ai-prompts` を更新し、実装変更は最小化する。
