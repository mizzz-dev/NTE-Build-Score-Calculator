# Active Issues（Context Bootstrap）

最終更新: 2026-05-19（PR #168 merge後処理 / Issue #169 作成反映）

## 1. 現在Open Issue

- #169: 承認・証跡提出テンプレートのdeploy前後条件分離（open）
- #166: 正式リリース承認・公開条件証跡の提出テンプレート作成（完了: テンプレート保存済み）
- #164: 正式リリースGo承認と本番公開条件の証跡保存（完了: No-Go継続）
- #162: 正式リリースNo-Go解除条件確認 / 公開実行可否再判定（完了: No-Go継続）
- #160: 正式リリース公開実施と公開後確認ログ保存（完了: No-Go記録済み / deploy未実施）
- #158: 正式リリース実施可否と本番deploy手順確定（完了: Conditional Go判定と手順文書化）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #169: 承認・証跡提出テンプレートのdeploy前後条件分離（P1）
2. 人間最終Go承認の記録（P1）
3. 実環境証跡の保存（P1）
4. deploy実施ログ保存（P1）
5. post-release実測結果への更新（P1）
6. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
7. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: #169 deploy前Go判定条件からdeploy実行ログURLを除外
- P1: #169 deploy実行ログURLをdeploy後確認項目へ分離
- P1: #169 公開実行前Go判定チェックと公開実行後確認チェックの分離
- P1: 人間最終Go承認の記録
- P1: 本番公開条件の実環境証跡保存
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #166 / PR #168 は完了済み。
- Issue #166で承認・証跡提出テンプレートは作成済み。
- PR #168レビューで、deploy実行ログURLが公開実行前Go判定条件に含まれている点が指摘済み。
- Issue #158の公開手順ではdeploy実行ログ確認はdeploy中またはdeploy後の確認項目であり、現在のテンプレートと不整合がある。
- 次はIssue #169で、公開実行前Go判定条件と公開実行後確認項目を分離する。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #166の提出テンプレートは `docs/runbooks/official-release-approval-and-evidence-submission-template.md` を参照。
- Issue #158 判定と公開手順は `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md` を参照。
- Issue #169では、deploy前Go判定条件とdeploy後確認項目を分離する。
- 実際の公開作業や本番設定変更は行わない。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
