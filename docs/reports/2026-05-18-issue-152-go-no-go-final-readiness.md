# Issue #152 本番公開前 最終確認レポート（Go / No-Go 判定）

- 作成日: 2026-05-18
- 対象Issue: #152
- 判定対象: 正式リリース候補（非公式ファンツール）
- 注意: 本レポートは法務判断を確定しない。権利・法務は引き続き「要確認」。

## 1. 実施目的

Issue #150 / PR #151 で整備した公開前チェックリストとリリースノートを基に、本番公開前の最終確認（Release / Security / Privacy / License / Support）を実施し、Go / No-Go 判定根拠をRepositoryへ記録する。

## 2. 確認結果サマリー

- 判定結果: **Go（条件付き）**
- 判定日時: 2026-05-18
- 理由: 本番URL・環境変数方針・SEO公開方針・secret管理・規約導線・OCR安全方針の整合が、現行正本ドキュメントと実装で確認できたため。
- 条件: 商用利用前の専門確認（名称・素材・規約文言）未完了項目を継続管理すること。

## 3. 項目別確認結果

### 3.1 Release

1. 本番URL
   - 現行実装の `siteUrl` fallback は `https://nte-build-score-calculator.vercel.app`。
   - 本Issueでは実deploy/環境変数変更を行わないため、**本番URL候補は上記URLとして記録**。

2. `NEXT_PUBLIC_SITE_URL` 整合
   - `layout.tsx` / `robots.ts` / `sitemap.ts` で同一環境変数を参照。
   - 未設定時は同一fallback URLへ収束し、URL生成の不整合は現時点で確認されない。

3. `NEXT_PUBLIC_ROBOTS_NOINDEX` 本番方針
   - `true` の場合: robots で全体disallow、metadataは noindex/nofollow、sitemapは空。
   - `false` の場合: robots allow + sitemap公開、metadata index/follow。
   - 本番公開時の方針は **`NEXT_PUBLIC_ROBOTS_NOINDEX=false`** でチェックリスト記載どおり。

4. robots / sitemap / canonical / OGP 方針
   - robots: 環境変数で公開可否を切替。
   - sitemap: 公開対象ページのみ列挙、noindex時は空。
   - canonical: 主要ページはページ単位の自己canonical方針を採用。
   - OGP: root metadataで非公式ファンツール表記を含む説明を維持。

### 3.2 Security

1. `.env.local` / secret混入
   - trackedなenvは `.env.example` のみで、`.env.local` はRepository非含有を再確認。
2. Supabase service role key
   - ドキュメントと実装方針で「Anon Keyのみ公開可」「service role key禁止」を維持。

### 3.3 Privacy

- OCR画像非保存方針、低信頼度候補の自動確定禁止、OCRメタ情報非混入方針を、公開前チェックリスト・リリースノート・既存要件と整合確認。

### 3.4 License / Legal（要確認）

- 利用規約・免責・プライバシー方針ページの導線は整備済み。
- ただし、公式名称・略称・ゲーム内用語・公式素材の利用可否は引き続き「要確認」。
- 法務判断は本Issueで確定しない。

### 3.5 Support / 運用

- 問い合わせ導線 `/contact`、更新履歴導線 `/updates`、障害時告知（Issue/Discussion）の既存方針を維持。
- rollback方針（`git revert <release_commit>` または直前タグ再deploy、必要時noindex再有効化）を再確認。

## 4. 未解決リスク / 許容する既知制限

### 4.1 未解決リスク（継続管理）

1. 商用利用時の権利・法務確認未完了（高）
2. 公式素材利用可否未確認（高）
3. 非公式表記の将来ページ追加時の表記漏れ運用リスク（高）

### 4.2 許容する既知制限

1. OCRは入力補助であり、最終確定は利用者の手動確認が必須。
2. 計算結果・OCR結果・ランキング結果の正確性は保証しない。
3. 回答保証なしの限定サポート。

## 5. 公開後確認項目（Post-release）

1. 本番トップ・主要導線の表示崩れ有無
2. `/terms` `/privacy` `/disclaimer` `/contact` `/updates` のリンク有効性
3. robots / sitemap / canonical / OGP の想定どおり反映
4. 重大問い合わせ・障害の初動記録

## 6. Go / No-Go 判定

- **判定: Go（条件付き）**
- 条件:
  1. 商用化前専門確認（名称・素材・規約文言）を未完了課題として維持する。
  2. 実公開時に `NEXT_PUBLIC_SITE_URL` を本番URLへ最終固定し、`NEXT_PUBLIC_ROBOTS_NOINDEX=false` を再監査する。
  3. 公開後チェック項目の実施ログを別途保存する。

## 7. 非実施項目（意図的）

- 実際の本番deploy
- 本番環境変数変更
- 法務判断の確定
- OCR/DB/auth/infra/deployment/payload/ランキング仕様の変更
