# Issue #141 作業ログ（metadata / OGP / canonical / robots 公開前最終整備）

- 作成日: 2026-05-16
- 対象Issue: #141
- 関連監査: #137（P1）
- 方針: 非公式ファンツール表記を維持し、法務判断は確定せず「要確認」を継続

## 1. 実施概要

公開前監査でP1となっていた metadata/OGP/canonical/robots を、現在機能と矛盾しない最小構成で整備した。

## 2. 実施内容

1. `src/app/layout.tsx` の metadata を更新。
   - title/description を現行機能説明へ更新。
   - 「非公式ファンツール」を明記。
   - `metadataBase` / `alternates.canonical` を設定。
   - `openGraph` / `twitter` を最小構成で追加。
2. `src/app/robots.ts` を追加。
   - `NEXT_PUBLIC_ROBOTS_NOINDEX=true` なら `disallow: /`。
   - それ以外は `allow: /`。
   - index許可時のみ `sitemap.xml` URLを提示。
3. `docs/current-status.md` と `docs/active-issues.md` を更新。
4. 本作業ログおよびAIプロンプトログを追加。

## 3. 技術判断

- canonical: ルート基準で `alternates.canonical: '/'` を設定し、metadataBaseと組み合わせて正規URLを解決する最小実装を採用。
- robots: 公開前と公開後で切替可能な運用を優先し、環境変数で noindex を制御。
- OGP/Twitter: 公式素材・ゲーム画像の権利確認が未完了のため、画像指定は行わずテキスト中心で安全側に寄せた。
- sitemap: robotsから参照URLは提示するが、`sitemap.ts` 実装は公開URL・運用方針の最終確定後に別Issueへ分離する判断。
- 法務判断（名称・素材利用可否）は本Issueで確定しない。

## 4. テスト結果

- `pnpm lint`: 失敗（環境要因: corepack経由pnpm取得時に `registry.npmjs.org` へのHTTPトンネルが403）
- `pnpm test`: 失敗（同上）
- `pnpm build`: 失敗（同上）

## 5. 残課題

1. sitemap実装要否の確定（必要時は別Issue化）。
2. 商用利用前の権利・法務確認（要確認）。
3. 公開URLの最終確定後に `NEXT_PUBLIC_SITE_URL` の運用を固定。

## 6. Rollback方法

1. `git revert <本IssueのコミットSHA>` で差し戻す。
2. `src/app/layout.tsx` と `src/app/robots.ts` を直前状態へ戻す。
3. `docs/current-status.md` `docs/active-issues.md` `docs/logs/...` `docs/ai-prompts/...` を必要に応じて復元する。

## 7. PR本文案（日本語）

### タイトル
Issue #141: metadata/OGP/canonical/robots の公開前最終整備

### 本文（案）
- Issue: #141

#### 実施内容
- `layout.tsx` の title/description を現行機能に合わせて更新
- 非公式ファンツール表記を metadata / OGP / Twitter に反映
- canonical相当（metadataBase + alternates.canonical）を追加
- robots設定を追加し、公開前noindexを環境変数で切替可能化
- robotsにsitemap参照を記載（sitemap本体は別Issue判断）
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

#### 残課題
- sitemap実装要否の確定（必要時は別Issue）
- 商用利用前の権利・法務確認（要確認）
