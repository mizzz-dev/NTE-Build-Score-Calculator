# AIプロンプトログ（Issue #127）

- 日付: 2026-05-15
- 対象Issue: #127
- 目的: `/compare` OCR 正式展開後の監視運用定常化、残リスク（`unresolved_items_remaining` / `image_quality_low`）の改善方針整理

## 入力プロンプト要約

- `docs/ai-protocol/PROMPT.txt` を最優先遵守
- `docs/current-status.md`, `docs/active-issues.md`, `docs/runbooks/compare-ocr-release-runbook.md`, `docs/logs/compare-ocr-release-decision.md` を参照
- OCRアルゴリズム、DB/auth/infra/deployment、保存payload仕様、ランキング仕様を変更しない
- 監査ログ項目、しきい値超過時の改善Issueテンプレ方針、互換性継続確認観点、残リスク改善方針を整理
- 必要実装は次Issueへ分離し、本Issueではドキュメント整備のみ

## 出力方針

1. 監視運用定常化の成果物を `docs/logs/` に作成
2. `docs/current-status.md` と `docs/active-issues.md` を更新
3. ADR要否を明記（不要時も理由を記録）
4. テストコマンド結果または実行不能理由を記録

