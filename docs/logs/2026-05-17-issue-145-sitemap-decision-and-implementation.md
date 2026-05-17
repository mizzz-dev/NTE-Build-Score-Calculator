# Issue #145 作業ログ（sitemap実装要否の確定と実装）

- 作成日: 2026-05-17
- 対象Issue: #145
- 関連PR: （このブランチのPRで対応）

## 1. 実施概要

`robots.ts` の `sitemap.xml` 参照と実体の有無を整合させるため、公開対象ページの棚卸しを実施し、最小構成の `src/app/sitemap.ts` を追加した。

## 2. 公開対象ページ棚卸し

`src/app` のページを確認し、現時点の公開対象を以下に限定した。

- `/`
- `/score`
- `/card`
- `/compare`
- `/ranking`
- `/presets`
- `/statuses`
- `/guide`
- `/faq`
- `/updates`
- `/contact`
- `/terms`
- `/privacy`
- `/disclaimer`

除外:
- `/admin`（管理用途ページのため公開対象から除外）
- 将来予定・未実装の専用ルート（現時点で公開方針未確定）

## 3. 技術判断

1. sitemapは「実装する」を採用。
   - 理由: `robots.ts` が index許可時に `sitemap.xml` を提示しており、実体が存在しない状態を避けるため。
2. 実装方式は Next.js `MetadataRoute.Sitemap` を採用。
3. URL解決は `NEXT_PUBLIC_SITE_URL` 優先、未指定時は `https://nte-build-score-calculator.vercel.app` を fallback とし、`layout.tsx` / `robots.ts` と整合。
4. `NEXT_PUBLIC_ROBOTS_NOINDEX=true` 時は sitemap を空配列で返却し、公開前noindex運用と矛盾しない方針とした。
5. 画像sitemap、公式素材・ゲーム画像は追加しない。
6. 法務判断は本Issueで確定しない（要確認継続）。

## 4. 変更ファイル

- `src/app/sitemap.ts`（新規）
- `docs/current-status.md`
- `docs/active-issues.md`
- `docs/logs/2026-05-17-issue-145-sitemap-decision-and-implementation.md`
- `docs/ai-prompts/2026-05-17-issue-145-sitemap-decision-and-implementation.md`

## 5. テスト結果

- `pnpm lint`: 実行
- `pnpm test`: 実行
- `pnpm build`: 実行

## 6. 非変更の確認

- OCRアルゴリズム
- OCR信頼度計算
- DB migration
- auth / infra / deployment 設定
- 保存payload仕様
- ランキング仕様
- 外部OCR API連携
- 公式素材・ゲーム画像追加
- 法務判断の確定

## 7. 残課題

1. 商用利用前の権利・法務確認（要確認）。
2. 正式公開時の `NEXT_PUBLIC_SITE_URL` 本番値の最終固定。

## 8. Rollback方法

1. `git revert <Issue #145対応コミットSHA>` を実行。
2. `src/app/sitemap.ts` を削除。
3. `docs/current-status.md` `docs/active-issues.md` `docs/logs/...` `docs/ai-prompts/...` を直前状態へ戻す。

## 9. PR本文案

### タイトル
Issue #145: sitemap実装要否を確定し sitemap.ts を追加

### 本文（案）
- Issue: #145

#### 実施内容
- 公開対象ページを棚卸しし、sitemap対象を主要機能/静的公開ページへ限定
- `src/app/sitemap.ts` を `MetadataRoute.Sitemap` で追加
- `NEXT_PUBLIC_SITE_URL` + fallback URL方針を metadata/robots と統一
- `NEXT_PUBLIC_ROBOTS_NOINDEX=true` 時は空sitemap返却で公開前noindex運用に整合
- `robots.ts` の `sitemap.xml` 参照とsitemap本体の有無を整合
- `docs/current-status.md` `docs/active-issues.md` を更新
- 作業ログ/AIプロンプトログを追加

#### 非変更
- OCRアルゴリズム
- OCR信頼度計算
- DB / auth / infra / deployment
- 保存payload仕様 / ランキング仕様
- 公式素材・ゲーム画像の追加
- 法務判断の確定

#### テスト
- `pnpm lint`
- `pnpm test`
- `pnpm build`
