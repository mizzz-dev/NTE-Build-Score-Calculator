# Active Issues（Context Bootstrap）

最終更新: 2026-05-18（PR #163 merge後処理 / Issue #164 作成反映）

## 1. 現在Open Issue

- #164: 正式リリースGo承認と本番公開条件の証跡保存（open）
- #162: 正式リリースNo-Go解除条件確認 / 公開実行可否再判定（完了: No-Go継続）
- #160: 正式リリース公開実施と公開後確認ログ保存（完了: No-Go記録済み / deploy未実施）
- #158: 正式リリース実施可否と本番deploy手順確定（完了: Conditional Go判定と手順文書化）
- #156: 主要機能ページmetadata title重複解消（完了）
- #154: 主要機能ページのcanonical方針整合（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #164: 正式リリースGo承認と本番公開条件の証跡保存（P1）
2. 人間最終Go承認の記録（P1）
3. 実環境証跡の保存（P1）
4. deploy実施ログ保存（P1）
5. post-release実測結果への更新（P1）
6. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
7. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: #164 人間最終Go承認の有無確認
- P1: #164 本番公開URLの実環境証跡保存可否確認
- P1: #164 検索公開設定の実環境証跡保存可否確認
- P1: #164 deploy実行ログURL保存可否確認
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #162 / PR #163 は完了済み。
- Issue #162ではNo-Go解除条件を再確認し、未充足のためNo-Go継続を記録済み。
- 未充足項目は、人間最終Go承認、本番公開URLの実環境証跡、検索公開設定の実環境証跡、deploy実行者・対象コミット・実行ログURL。
- 次はIssue #164で、承認・証跡の保存可否を確認し、Go前提充足またはNo-Go継続を判定する。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #162のNo-Go継続記録は `docs/logs/2026-05-18-issue-162-no-go-recheck.md` を参照。
- Issue #160のNo-Go記録は `docs/logs/2026-05-18-issue-160-post-release-check.md` を参照。
- Issue #158 判定と公開手順は `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md` を参照。
- Issue #164では、人間Go承認、公開条件証跡、deploy実行ログURLの有無を推測せず確認する。
- 公開しない場合はNo-Go継続理由と再開条件を記録する。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
