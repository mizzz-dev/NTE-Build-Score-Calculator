# Active Issues（Context Bootstrap）

最終更新: 2026-05-18（Issue #156 metadata title重複解消対応）

## 1. 現在Open Issue

- #156: 主要機能ページmetadata title重複解消（完了）
- #154: 主要機能ページのcanonical方針整合（完了）
- #152: 本番URL・環境変数・Go/No-Go判定（完了: Go条件付き）
- #150: 正式リリース準備・リリースノート・公開前チェックリスト作成（完了）
- #148: 商用利用前の権利・法務確認観点整理（完了）
- #145: sitemap実装要否の確定と必要時のsitemap.ts追加（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. 正式リリース実施判断
2. 本番deploy手順の実施または別Issue化
3. post-release確認ログ作成
4. 商用化前の専門確認（名称・素材・免責文言・収益化導線）

## 3. 優先順位（暫定）

- P1: 正式リリース実施判断
- P1: post-release確認ログ作成
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Blocker

- Issue #154 / PR #155 は完了済み。
- PR #155レビュー指摘のmetadata title重複リスクはIssue #156で解消済み。
- `title.template` はroot layoutで維持し、`/score` `/card` `/compare` のpage titleはセクション名のみに統一済み。
- canonical設定は維持する。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #154 対応内容は `docs/logs/2026-05-18-issue-154-canonical-policy-alignment.md` を参照。
- Issue #156で実施したmetadata title整合（`/score` `/card` `/compare`）を維持する。
- root layoutの `title.template` を維持し、ページtitleはセクション名のみへ寄せる方針を優先する。
- 本番deployや本番環境変数変更は実施しない。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
