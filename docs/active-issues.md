# Active Issues（Context Bootstrap）

最終更新: 2026-05-18（Issue #160 No-Go判断ログ反映）

## 1. 現在Open Issue

- #160: 正式リリース公開実施と公開後確認ログ保存（open / 2026-05-18時点 No-Go記録済み）
- #158: 正式リリース実施可否と本番deploy手順確定（完了: Conditional Go判定と手順文書化）
- #156: 主要機能ページmetadata title重複解消（完了）
- #154: 主要機能ページのcanonical方針整合（完了）
- #152: 本番URL・環境変数・Go/No-Go判定（完了: Go条件付き）
- #150: 正式リリース準備・リリースノート・公開前チェックリスト作成（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #160: 正式リリース公開実施と公開後確認ログ保存（P1）
2. post-release確認ログ作成（P1）
3. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
4. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: #160 人間最終Go承認の記録（未完了）
- P1: #160 deploy実施ログ保存（未完了）
- P1: #160 No-Go理由と再開条件の記録（完了）
- P1: #160 公開後確認ログ（実測）保存（未完了）
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #158 / PR #159 は完了済み。
- 正式リリース判定はConditional Goとして文書化済み。
- 公開手順、切り戻し条件、公開後確認ログ仕様はRepositoryへ保存済み。
- 次はIssue #160で、実際の公開実施判断、実施ログ、公開後確認ログを分離管理する。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #158 判定と公開手順は `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md` を参照。
- Issue #160では、人間の最終Go承認、公開実施結果、公開後確認結果をRepositoryに保存する。
- 公開しない場合はNo-Go理由と再開条件を記録する。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
