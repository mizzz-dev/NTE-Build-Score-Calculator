# Active Issues（Context Bootstrap）

最終更新: 2026-05-21（PR #176 merge後処理 / Issue #177 作成反映）

## 1. 現在Open Issue

- #177: 公開実行Issue起票と人間承認フロー開始条件の明確化（open）
- #175: 本番deploy準備と公開実行手順の確定（完了: deploy準備手順・責任分担・前後確認項目を文書化済み）
- #173: 人間対応：公開実行前Go承認と本番公開条件証跡の提出（完了: No-Go継続）
- #171: 人間最終Go承認と本番公開条件証跡の提出（完了: No-Go継続）
- #169: 承認・証跡提出テンプレートのdeploy前後条件分離（完了: deploy前Go判定条件とdeploy後確認項目を分離済み）
- #166: 正式リリース承認・公開条件証跡の提出テンプレート作成（完了: テンプレート保存済み）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #177: 公開実行Issue起票と人間承認フロー開始条件の明確化（P1）
2. 公開実行Issueテンプレート整備（P1）
3. 条件充足時の公開実行Issue作成（P1）
4. deploy実施ログ保存（P1）
5. post-release実測結果への更新（P1）
6. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
7. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: #177 公開実行Issueに必要な記録項目の明確化
- P1: #177 人間承認フロー開始条件の明確化
- P1: #177 deploy前確認項目とdeploy後確認項目の分離
- P1: #177 Issue #175完了後ステータスと次作業記述の同期
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #175 / PR #176 は完了済み。
- Issue #175で、本番deploy準備と公開実行手順の整理は完了。
- PR #176レビューで、`docs/current-status.md` のIssue #175完了後ステータスと次作業記述が混在している点が指摘済み。
- 次はIssue #177で、公開実行Issue起票条件と人間承認フロー開始条件を整理し、ステータス文書の状態同期を行う。
- deploy実行ログURLは公開実行後確認項目として扱い、公開実行前Go判定条件には含めない。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #175 Runbookは `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md` を参照。
- Issue #175作業ログは `docs/logs/2026-05-21-issue-175-production-deploy-preparation-and-execution-plan.md` を参照。
- 提出テンプレートは `docs/runbooks/official-release-approval-and-evidence-submission-template.md` を参照。
- Issue #158 判定と公開手順は `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md` を参照。
- Issue #177では、実際の本番deployや本番設定変更は行わず、公開実行Issue起票条件と人間承認フロー開始条件を整理する。
- 非公開情報をRepositoryへ保存しない。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
