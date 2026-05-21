# Active Issues（Context Bootstrap）

最終更新: 2026-05-21（PR #174 merge後処理 / Issue #175 作成反映）

## 1. 現在Open Issue

- #175: 本番deploy準備と公開実行手順の確定（open）
- #173: 人間対応：公開実行前Go承認と本番公開条件証跡の提出（完了: No-Go継続）
- #171: 人間最終Go承認と本番公開条件証跡の提出（完了: No-Go継続）
- #169: 承認・証跡提出テンプレートのdeploy前後条件分離（完了: deploy前Go判定条件とdeploy後確認項目を分離済み）
- #166: 正式リリース承認・公開条件証跡の提出テンプレート作成（完了: テンプレート保存済み）
- #164: 正式リリースGo承認と本番公開条件の証跡保存（完了: No-Go継続）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #175: 本番deploy準備と公開実行手順の確定（P1）
2. deploy対象環境・ブランチ・コミットの明確化（P1）
3. 条件充足時の公開実行Issue作成（P1）
4. deploy実施ログ保存（P1）
5. post-release実測結果への更新（P1）
6. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
7. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: #175 deploy対象環境の明確化
- P1: #175 deploy対象ブランチ / 対象コミットの明確化
- P1: #175 deploy実施者または実施責任者の明確化
- P1: #175 deploy前確認項目とdeploy後確認項目の分離
- P1: #175 rollback参照コミットとrollback方針の確認
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #173 / PR #174 は完了済み。
- Issue #173フォローアップでも4条件未提出のためNo-Go継続を記録済み。
- 人間担当者より、本番公開URLは未deployのためアクセスできず、現時点ではGo承認できない旨を確認済み。
- 次はIssue #175で、本番URL未到達状態を解消する前段として本番deploy準備と公開実行手順を整理する。
- deploy実行ログURLは公開実行後確認項目として扱い、公開実行前Go判定条件には含めない。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #173フォローアップログは `docs/logs/2026-05-21-issue-173-human-go-approval-and-prod-evidence-followup.md` を参照。
- 提出テンプレートは `docs/runbooks/official-release-approval-and-evidence-submission-template.md` を参照。
- Issue #158 判定と公開手順は `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md` を参照。
- Issue #175では、実際の本番deployや本番設定変更は行わず、公開可能な準備手順・確認観点・記録テンプレートを整備する。
- 非公開情報をRepositoryへ保存しない。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
