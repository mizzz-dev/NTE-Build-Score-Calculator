# Active Issues（Context Bootstrap）

最終更新: 2026-05-18（Issue #154 canonical方針整合対応）

## 1. 現在Open Issue

- #154: 主要機能ページのcanonical方針整合（完了）
- #152: 本番URL・環境変数・Go/No-Go判定（完了: Go条件付き）
- #150: 正式リリース準備・リリースノート・公開前チェックリスト作成（完了）
- #148: 商用利用前の権利・法務確認観点整理（完了）
- #145: sitemap実装要否の確定と必要時のsitemap.ts追加（完了）
- #143: canonicalページ別方針見直し / metadata noindex反映（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #154: 主要機能ページのcanonical方針整合（P2）
2. 正式リリース実施判断
3. 本番deploy手順の実施または別Issue化
4. post-release確認ログ作成
5. 商用化前の専門確認（名称・素材・免責文言・収益化導線）

## 3. 優先順位（暫定）

- P1: 正式リリース実施判断前のGo判定レポート整合
- P1: post-release確認ログ作成
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #152 / PR #153 は完了済み。
- PR #153レビュー指摘（canonical coverage不整合）はIssue #154で解消済み。
- `/score` `/card` `/compare` に自己canonical metadataを追加し、Go判定レポート記載と整合済み。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #152の確認結果とGo / No-Go判定根拠は `docs/reports/2026-05-18-issue-152-go-no-go-final-readiness.md` を参照。
- PR #153のレビューで指摘されたcanonical coverageの不整合をIssue #154で解消する。
- `/score` `/card` `/compare` に自己canonicalを追加するか、Go判定レポートを実装状態に合わせて修正する。
- 本番deployや本番環境変数変更は実施しない。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
