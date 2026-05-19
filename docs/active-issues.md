# Active Issues（Context Bootstrap）

最終更新: 2026-05-19（PR #165 merge後処理 / Issue #166 作成反映）

## 1. 現在Open Issue

- #166: 正式リリース承認・公開条件証跡の提出テンプレート作成（open）
- #164: 正式リリースGo承認と本番公開条件の証跡保存（完了: No-Go継続）
- #162: 正式リリースNo-Go解除条件確認 / 公開実行可否再判定（完了: No-Go継続）
- #160: 正式リリース公開実施と公開後確認ログ保存（完了: No-Go記録済み / deploy未実施）
- #158: 正式リリース実施可否と本番deploy手順確定（完了: Conditional Go判定と手順文書化）
- #156: 主要機能ページmetadata title重複解消（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #166: 正式リリース承認・公開条件証跡の提出テンプレート作成（P1）
2. 人間最終Go承認の記録（P1）
3. 実環境証跡の保存（P1）
4. deploy実施ログ保存（P1）
5. post-release実測結果への更新（P1）
6. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
7. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: #166 承認・証跡提出テンプレート作成
- P1: #166 証跡として保存してよい情報・保存してはいけない情報の明確化
- P1: 人間最終Go承認の記録
- P1: 本番公開条件の実環境証跡保存
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #164 / PR #165 は完了済み。
- Issue #164では承認・証跡不足のためNo-Go継続を記録済み。
- 未充足項目は、人間最終Go承認、本番公開URLの実環境証跡、検索公開設定の実環境証跡、deploy実行ログURL。
- 次はIssue #166で、人間担当者が安全に承認・証跡を提出できるテンプレートを整備する。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #164のNo-Go継続記録は `docs/logs/2026-05-18-issue-164-go-approval-and-production-evidence-check.md` を参照。
- Issue #162のNo-Go継続記録は `docs/logs/2026-05-18-issue-162-no-go-recheck.md` を参照。
- Issue #158 判定と公開手順は `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md` を参照。
- Issue #166では、承認・証跡提出テンプレートを作成し、保存してよい情報・保存してはいけない情報を明記する。
- 実際の公開作業や本番設定変更は行わない。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
