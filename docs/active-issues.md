# Active Issues（Context Bootstrap）

最終更新: 2026-05-18（PR #149 merge後処理 / Issue #150 作成反映）

## 1. 現在Open Issue

- #150: 正式リリース準備・リリースノート・公開前チェックリスト作成（open）
- #148: 商用利用前の権利・法務確認観点整理（完了）
- #145: sitemap実装要否の確定と必要時のsitemap.ts追加（完了）
- #143: canonicalページ別方針見直し / metadata noindex反映（完了）
- #141: metadata・OGP・canonical・robots の公開前最終整備（完了）
- #139: 利用規約・免責・プライバシー方針ページ整備（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #150: 正式リリース準備・リリースノート・公開前チェックリスト作成（P1）
2. 本番URL / `NEXT_PUBLIC_SITE_URL` の最終確認
3. `NEXT_PUBLIC_ROBOTS_NOINDEX` の本番設定確認
4. 正式リリース実施判断
5. 商用化前の専門確認（名称・素材・免責文言・収益化導線）

## 3. 優先順位（暫定）

- P1: #150 正式リリース準備・リリースノート・公開前チェックリスト作成
- P1: secretや環境変数が公開されていないことの継続監査
- P1: 本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` の最終確認
- P2: 正式リリース実施判断
- P2: 商用化前の専門確認

## 4. Blocker

- Issue #148 / PR #149 は完了済み。
- 次はIssue #150で、正式リリース前チェックリスト、リリースノート、rollback手順、post-release確認をRepositoryに残す。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #148 対応内容は `docs/reports/2026-05-17-issue-148-commercial-legal-readiness-review.md` を参照。
- Issue #150では、正式リリース前チェックリスト、リリースノート案、rollback手順、post-release確認を作成する。
- 本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` の最終確認項目を必ず含める。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
