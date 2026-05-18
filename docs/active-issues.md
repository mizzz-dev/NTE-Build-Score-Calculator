# Active Issues（Context Bootstrap）

最終更新: 2026-05-18（PR #151 merge後処理 / Issue #152 作成反映）

## 1. 現在Open Issue

- #152: 本番URL・環境変数・Go/No-Go判定（open）
- #150: 正式リリース準備・リリースノート・公開前チェックリスト作成（完了）
- #148: 商用利用前の権利・法務確認観点整理（完了）
- #145: sitemap実装要否の確定と必要時のsitemap.ts追加（完了）
- #143: canonicalページ別方針見直し / metadata noindex反映（完了）
- #141: metadata・OGP・canonical・robots の公開前最終整備（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #152: 本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` の最終確認とGo/No-Go判定（P1）
2. 正式リリース実施判断
3. 本番deploy手順の実施または別Issue化
4. post-release確認ログ作成
5. 商用化前の専門確認（名称・素材・免責文言・収益化導線）

## 3. 優先順位（暫定）

- P1: #152 本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` の最終確認
- P1: #152 secretや環境変数が公開されていないことの継続監査
- P1: #152 リリースチェックリストに基づくGo / No-Go判定記録
- P2: 正式リリース実施判断
- P2: 商用化前の専門確認

## 4. Blocker

- Issue #150 / PR #151 は完了済み。
- 次はIssue #152で、本番URL、`NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_ROBOTS_NOINDEX`、security/privacy/license/release/support観点の最終確認結果とGo/No-Go判定をRepositoryに残す。
- 実際の本番deployや本番環境変数変更はIssue #152では行わない。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #150 対応内容は `docs/release-checklist.md`、`docs/release-notes/2026-05-18-official-release-candidate.md`、`docs/logs/2026-05-18-issue-150-release-readiness-docs.md` を参照。
- Issue #152では、本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` の確認結果をRepositoryに保存する。
- Go / No-Go判定は根拠付きで記録する。
- 本番deployや本番環境変数変更は実施しない。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
