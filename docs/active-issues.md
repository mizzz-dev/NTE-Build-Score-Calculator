# Active Issues（Context Bootstrap）

最終更新: 2026-05-17（Issue #148 対応完了反映）

## 1. 現在Open Issue

- #148: 商用利用前の権利・法務確認観点整理（完了）
- #145: sitemap実装要否の確定と必要時のsitemap.ts追加（完了）
- #143: canonicalページ別方針見直し / metadata noindex反映（完了）
- #141: metadata・OGP・canonical・robots の公開前最終整備（完了）
- #139: 利用規約・免責・プライバシー方針ページ整備（完了）
- #137: 正式リリース前の品質・SEO・規約表示確認（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #148: 商用利用前の権利・法務確認観点整理（P1）
2. 正式リリース準備・リリースノート作成
3. 公開前最終チェックリスト整備
4. 本番URL / `NEXT_PUBLIC_SITE_URL` の最終確認

## 3. 優先順位（暫定）

- P1: secretや環境変数が公開されていないことの継続監査
- P1: 商用化前の専門確認（名称・素材・免責・収益化導線）
- P2: 正式リリース準備・リリースノート作成
- P2: 公開前最終チェックリスト整備

## 4. Blocker

- Issue #145 / PR #147 は完了済み。
- Issue #148は完了。次は整理済み論点を公開前チェックとリリースノートへ反映する。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #137 対応内容は `docs/logs/2026-05-15-issue-137-pre-release-quality-seo-compliance-audit.md` を参照。
- Issue #145 対応内容は `docs/logs/2026-05-17-issue-145-sitemap-decision-and-implementation.md` を参照。
- Issue #148では、法務判断を断定せず、非公式ファンツールとして確認すべき権利・法務論点を整理する。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
