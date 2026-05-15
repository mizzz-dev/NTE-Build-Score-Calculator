# Issue #135 作業ログ（/compare OCR 条件付き正式展開後の月次監査運用移行）

- 作成日: 2026-05-15
- 対象Issue: #135
- 関連Issue/PR: #127, #129, #131, #133
- 参照: `docs/runbooks/compare-ocr-release-runbook.md`, `docs/logs/issue-127-compare-ocr-post-release-monitoring-operations.md`

## 1. 実施概要

条件付き正式展開後の `/compare` OCR 監視運用を、Runbookと監査ログに基づく月次サイクルへ移行するため、ドキュメントを整備した。
本Issueでは実装変更を行わず、運用手順、監査ログテンプレート、しきい値超過時対応、改善Issue起票基準を明文化した。

## 2. 実施内容

1. 月次監査Runbookを新規作成。
   - 月初の実施タイミング
   - 警戒しきい値超過時対応
   - rollbackしきい値超過時対応
   - 改善Issue起票基準（P0/P1/P2）
   - payload互換確認タイミング
2. 月次監査ログテンプレートを新規作成。
   - 対象期間、計測対象画面、fallback率、手動補正率、比較前確認離脱率、A/B取り違え誤反映率
   - 未確認OCR値混入有無
   - 保存payload/共有URL/ランキングpayload互換確認
   - しきい値判定、改善Issue、rollback要否、次月アクション
3. `docs/current-status.md` と `docs/active-issues.md` をIssue #135反映内容へ更新。
4. 作業ログとAIプロンプトログを追記し、監査可能性を確保。

## 3. 非変更確認（禁止領域）

- OCRアルゴリズム: 変更なし
- OCR信頼度計算: 変更なし
- DB migration: 追加なし
- auth / infra / deployment: 変更なし
- 保存payload仕様 / 共有URL仕様 / ランキング仕様: 変更なし
- 画像保存: 追加なし
- 外部OCR API連携: 追加なし
- UI大幅変更: なし

## 4. 技術判断

- 既存の正式展開Runbook（Issue #125）を「障害/即時対応の正本」とし、Issue #135では「月次運用統制」を別Runbookとして分離した。
- これにより、即時対応手順と定常監査手順の責務を分離し、運用者が参照しやすい構造を優先した。
- 監査ログは匿名・集計値前提をテンプレート上部に明記し、画像・個人情報・アカウント情報を保存しない方針を固定化した。

## 5. テスト結果

- `pnpm lint`: docsのみ変更のため未実行（アプリ挙動への影響なし）
- `pnpm test`: docsのみ変更のため未実行（アプリ挙動への影響なし）
- `pnpm build`: docsのみ変更のため未実行（アプリ挙動への影響なし）

## 6. ロールバック

- 本Issueはドキュメント変更のみのため、差し戻し時は以下をrevertする。
  - `docs/runbooks/compare-ocr-monthly-audit-runbook.md`
  - `docs/logs/compare-ocr-monthly-audit-template.md`
  - `docs/current-status.md`
  - `docs/active-issues.md`
  - `docs/logs/2026-05-15-issue-135-compare-ocr-monthly-audit-operations.md`
  - `docs/ai-prompts/2026-05-15-issue-135-compare-ocr-monthly-audit-operations.md`
