# Active Issues（Context Bootstrap）

最終更新: 2026-05-22（Issue #181 Pre-deploy証跡受領確認反映）

## 1. 現在Open Issue

- #181: 公開実行前Go承認とPre-deploy証跡提出（open / 証跡未提出のためNo-Go継続）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #181: 公開実行前Go承認とPre-deploy証跡提出（P1）
2. 条件充足時のdeploy実行（P1）
3. deploy実施ログ保存（P1）
4. post-release実測結果への更新（P1）
5. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
6. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: #181 人間最終Go承認の提出
- P1: #181 deploy対象コミットSHAの提出
- P1: #181 本番URL一致証跡の提出
- P1: #181 検索公開設定証跡の提出
- P1: #181 rollback要否判定の提出
- P1: #181 deploy実施者 / 実施責任者 / 記録責任者の提出
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #179 / PR #180 は完了済み。
- Issue #179で、公開実行Issue記録を作成し、人間Go承認待ち状態を明確化済み。
- 現在はIssue #181で、Pre-deploy必須証跡の受領確認を実施したが、必須証跡は未提出。
- Go承認前にdeploy実行へ進めない。
- 人間Go承認や本番公開条件証跡を推測で補完しない。
- deploy実行ログURLは公開実行後確認項目として扱い、公開実行前Go判定条件には含めない。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- 公開実行Issue記録は `docs/runbooks/issue-179-official-release-execution-issue.md` を参照。
- 公開実行Issueテンプレートは `docs/runbooks/issue-177-official-release-execution-issue-template.md` を参照。
- Issue #175 Runbookは `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md` を参照。
- 提出テンプレートは `docs/runbooks/official-release-approval-and-evidence-submission-template.md` を参照。
- Issue #181では、人間担当者が提出した一次情報のみを扱う。
- 非公開情報をRepositoryへ保存しない。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
