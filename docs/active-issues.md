# Active Issues（Context Bootstrap）

最終更新: 2026-05-18（PR #157 merge後処理 / Issue #158 作成反映）

## 1. 現在Open Issue

- #158: 正式リリース実施可否と本番deploy手順確定（open）
- #156: 主要機能ページmetadata title重複解消（完了）
- #154: 主要機能ページのcanonical方針整合（完了）
- #152: 本番URL・環境変数・Go/No-Go判定（完了: Go条件付き）
- #150: 正式リリース準備・リリースノート・公開前チェックリスト作成（完了）
- #148: 商用利用前の権利・法務確認観点整理（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #158: 正式リリース実施可否と本番deploy手順確定（P1）
2. 本番deploy手順の実施または別Issue化
3. post-release確認ログ作成
4. 商用化前の専門確認（名称・素材・免責文言・収益化導線）
5. rollback運用監査

## 3. 優先順位（暫定）

- P1: #158 正式リリース実施可否判断
- P1: #158 本番deploy手順とrollback条件の明確化
- P1: post-release確認ログ作成
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #156 / PR #157 は完了済み。
- metadata title重複リスク、主要機能ページcanonical方針不整合、Go判定レポート不整合は解消済み。
- 次はIssue #158で、正式リリース実施可否、本番deploy手順、rollback条件、post-release確認方針をRepositoryに保存する。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #156 対応内容は `docs/logs/2026-05-18-issue-156-metadata-title-dedup.md` を参照。
- Issue #158では、正式リリース実施可否、deploy手順、rollback条件、post-release確認項目を根拠付きで記録する。
- 本番deployを実行する場合は、人間が最終判断したうえで実施する。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
