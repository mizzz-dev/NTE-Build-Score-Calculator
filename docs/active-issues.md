# Active Issues（Context Bootstrap）

最終更新: 2026-05-22（PR #178 merge後処理 / Issue #179 作成反映）

## 1. 現在Open Issue

- #179: 公開実行Issue作成と人間Go承認待ち状態の整備（open）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #179: 公開実行Issue作成と人間Go承認待ち状態の整備（P1）
2. 条件充足時のdeploy実行（P1）
3. deploy実施ログ保存（P1）
4. post-release実測結果への更新（P1）
5. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
6. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: #179 公開実行Issueの起票
- P1: #179 人間Go承認待ち状態の明確化
- P1: #179 未充足項目を `未確認` として明記
- P1: #179 deploy前確認項目とdeploy後確認項目の分離
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #177 / PR #178 は完了済み。
- Issue #177で、公開実行Issueテンプレートと人間承認フロー開始条件は整理済み。
- 次はIssue #179で、テンプレートを使って実際の公開実行Issueを起票し、人間Go承認待ち状態をRepository上で明確化する。
- Go承認前にdeploy実行へ進めない。
- 人間Go承認や本番公開条件証跡を推測で補完しない。
- deploy実行ログURLは公開実行後確認項目として扱い、公開実行前Go判定条件には含めない。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- 公開実行Issueテンプレートは `docs/runbooks/issue-177-official-release-execution-issue-template.md` を参照。
- Issue #175 Runbookは `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md` を参照。
- 提出テンプレートは `docs/runbooks/official-release-approval-and-evidence-submission-template.md` を参照。
- Issue #158 判定と公開手順は `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md` を参照。
- Issue #179では、実際の本番deployや本番設定変更は行わず、公開実行Issueの起票と人間Go承認待ち状態を整える。
- 非公開情報をRepositoryへ保存しない。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
