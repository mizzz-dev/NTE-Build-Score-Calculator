# Issue #79 作業ログ

## 1. 対象
- Issue: #79 Repository Memory / Context Bootstrap 正本ドキュメント整備
- スコープ: docs整備のみ（機能実装なし）

## 2. 実施内容
- 既存docs（要件、ロードマップ、OCR要件、過去作業ログ）を確認し、矛盾が出ないように基準情報を整理。
- 以下のContext Bootstrap文書を新規作成。
  - `docs/project-overview.md`
  - `docs/current-status.md`
  - `docs/active-issues.md`
  - `docs/architecture/system-overview.md`
- リスク正本として `docs/risks/risks.md` を新規作成。
- 再利用可能なAI入力として `docs/ai-prompts/issue-79-repository-memory-context-bootstrap.md` を追加。

## 3. 判断メモ
- Open Issueの完全一覧は時点依存情報のため、本ドキュメントでは運用方針（着手時同期）を明記し、固定値化を避けた。
- OCRスコープは `/score` 限定・payload非混入を明記し、既存方針との整合を維持。
- アーキテクチャ文書では単方向依存とUI/Business Logic分離を優先して記述。

## 4. 残課題
- GitHubのOpen Issue一覧と `docs/active-issues.md` を定期同期する運用を確立する。
- OCR品質評価指標（誤認識率・補正率・処理時間）をIssue化して継続管理する。
