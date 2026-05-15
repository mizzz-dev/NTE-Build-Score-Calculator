# AIプロンプトログ: Issue #135 `/compare` OCR 月次監査運用移行

- 作成日: 2026-05-15
- 対象Issue: #135
- モデル: Codex

## 1. ユーザー依頼（要約）

- `docs/ai-protocol/PROMPT.txt` を最優先で遵守する。
- 条件付き正式展開後のOCR監視運用を、Runbookと監査ログに基づく月次サイクルへ移行する。
- 実装変更は行わず、運用手順・監査ログテンプレート・月次確認観点をRepositoryへ記録する。
- `docs/current-status.md` `docs/active-issues.md` を更新する。
- 作業ログとAIプロンプトログを保存する。

## 2. AI実行方針

1. 既存資料（Issue #127 / #129 / #131 / #133 関連ログ、既存Runbook）を確認する。
2. 月次監査用のRunbookを新規作成し、警戒/rollback/改善Issue基準を明文化する。
3. 月次監査ログテンプレートを新規作成し、必須項目を固定化する。
4. current-status / active-issues / 作業ログ / 本AIログを更新する。
5. 変更がdocsのみであるため、lint/test/buildは未実行理由を記録する。

## 3. 非変更宣言

以下は変更しない方針を維持した。

- OCRアルゴリズム
- OCR信頼度計算
- DB migration
- auth / infra / deployment
- 保存payload仕様
- 共有URL仕様
- ランキング仕様
- 画像保存
- 外部OCR API連携

## 4. 出力物

- `docs/runbooks/compare-ocr-monthly-audit-runbook.md`
- `docs/logs/compare-ocr-monthly-audit-template.md`
- `docs/current-status.md` 更新
- `docs/active-issues.md` 更新
- `docs/logs/2026-05-15-issue-135-compare-ocr-monthly-audit-operations.md`
- `docs/ai-prompts/2026-05-15-issue-135-compare-ocr-monthly-audit-operations.md`（本ファイル）
