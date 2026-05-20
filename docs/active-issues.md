# Active Issues（Context Bootstrap）

最終更新: 2026-05-20（Issue #171 判定ログ反映）

## 1. 現在Open Issue

- #171: 人間最終Go承認と本番公開条件証跡の提出（open / 最新判定: No-Go継続）
- #169: 承認・証跡提出テンプレートのdeploy前後条件分離（完了: deploy前Go判定条件とdeploy後確認項目を分離済み）
- #166: 正式リリース承認・公開条件証跡の提出テンプレート作成（完了: テンプレート保存済み）
- #164: 正式リリースGo承認と本番公開条件の証跡保存（完了: No-Go継続）
- #162: 正式リリースNo-Go解除条件確認 / 公開実行可否再判定（完了: No-Go継続）
- #160: 正式リリース公開実施と公開後確認ログ保存（完了: No-Go記録済み / deploy未実施）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #171: 人間最終Go承認と本番公開条件証跡の提出（P1）
2. 公開実行前Go判定（P1）
3. 条件充足時の公開実行Issue作成（P1）
4. deploy実施ログ保存（P1）
5. post-release実測結果への更新（P1）
6. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
7. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: #171 人間最終Go承認の記録
- P1: #171 本番公開URL一致証跡の記録
- P1: #171 検索公開設定証跡の記録
- P1: #171 rollback参照コミット / rollback方針の記録
- P1: #171 公開実行前Go判定
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #169 / PR #170 は完了済み。
- Issue #169でdeploy前Go判定条件とdeploy後確認項目は分離済み。
- 次はIssue #171で、人間最終Go承認、本番公開URL一致証跡、検索公開設定証跡、rollback参照コミット / rollback方針を保存する。
- deploy実行ログURLは公開実行後確認項目として扱い、公開実行前Go判定条件には含めない。
- Issue #171 判定ログ（`docs/logs/2026-05-20-issue-171-human-go-approval-and-prod-evidence.md`）でNo-Go継続を記録済み。
- 不足項目: 人間最終Go承認、本番公開URL一致証跡、検索公開設定証跡、rollback要否の人間判定記録。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- 提出テンプレートは `docs/runbooks/official-release-approval-and-evidence-submission-template.md` を参照。
- Issue #169の作業ログは `docs/logs/2026-05-20-issue-169-deploy-gate-separation.md` を参照。
- Issue #158 判定と公開手順は `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md` を参照。
- Issue #171では、人間Go承認と実環境証跡を推測せず、Repositoryへ保存されている情報または人間が明示した情報のみを扱う。
- 実際の公開作業や本番設定変更は行わない。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
