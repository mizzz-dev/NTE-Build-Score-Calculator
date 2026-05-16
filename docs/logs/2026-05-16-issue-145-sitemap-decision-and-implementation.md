# Issue #145 作業ログ（sitemap実装要否の確定と実装）

- 作成日: 2026-05-16
- 対象Issue: #145
- 関連PR: （このブランチのPRで対応）

## 1. 実施概要

公開URL運用方針に合わせて公開対象ページを棚卸しし、`robots.ts` の `sitemap.xml` 参照と整合する `src/app/sitemap.ts` を最小実装した。

## 2. 実施内容

1. 公開対象ページを棚卸し。
   - 含める: `/`, `/score`, `/card`, `/compare`, `/presets`, `/ranking`, `/guide`, `/faq`, `/updates`, `/contact`, `/terms`, `/privacy`, `/disclaimer`, `/statuses`
   - 含めない: `/admin`（管理用途ページのため除外）
2. `src/app/sitemap.ts` を追加。
   - Next.js `MetadataRoute.Sitemap` を採用。
   - `NEXT_PUBLIC_SITE_URL` 未指定時のfallbackを `https://nte-build-score-calculator.vercel.app` に固定（`layout.tsx` / `robots.ts` と同一方針）。
   - `NEXT_PUBLIC_ROBOTS_NOINDEX=true` 時は空配列を返し、公開前noindex運用と整合。
3. `docs/current-status.md` と `docs/active-issues.md` を更新。
4. 本作業ログとAIプロンプトログを追加。

## 3. 技術判断

- sitemapは「実装する」を採用。
  - 理由: `robots.ts` が index許可時に `sitemap.xml` を案内する実装であり、本体未実装のままでは参照不整合となるため。
- 公開対象は、現時点で公開すべき静的ページ・主要機能ページに限定。
- 管理用途ページ（`/admin`）や将来予定ページは除外。
- 画像sitemapは追加しない（公式素材・ゲーム画像の権利判断が未確定のため）。
- 法務判断は本Issueで確定しない（要確認継続）。

## 4. テスト結果

- `pnpm lint`: 実行
- `pnpm test`: 実行
- `pnpm build`: 実行

## 5. 残課題

1. 商用利用前の権利・法務確認（要確認）。
2. 正式公開直前に公開対象ページ一覧を再確認し、sitemap対象が過不足ないか最終監査する。

## 6. Rollback方法

1. `git revert <Issue #145対応コミットSHA>` を実行。
2. `src/app/sitemap.ts` を削除（または直前状態へ戻す）。
3. `docs/current-status.md` `docs/active-issues.md` `docs/logs/...` `docs/ai-prompts/...` を必要に応じて復元。

## 7. PR本文案（日本語）

### タイトル
Issue #145: sitemap実装要否を確定し最小sitemapを追加

### 本文（案）
- Issue: #145

#### 実施内容
- 公開対象ページを棚卸しし、sitemap掲載対象を限定
- `src/app/sitemap.ts` を `MetadataRoute.Sitemap` で追加
- `NEXT_PUBLIC_SITE_URL` + fallback URL方針を `layout.tsx` / `robots.ts` と統一
- `NEXT_PUBLIC_ROBOTS_NOINDEX=true` 時は空sitemapを返し、公開前noindex方針と整合
- `docs/current-status.md` `docs/active-issues.md` を更新
- 作業ログ/AIプロンプトログを追加

#### 非変更
- OCRアルゴリズム
- OCR信頼度計算
- DB / auth / infra / deployment
- 保存payload仕様 / ランキング仕様
- 公式素材・ゲーム画像の追加

#### テスト
- `pnpm lint`
- `pnpm test`
- `pnpm build`
