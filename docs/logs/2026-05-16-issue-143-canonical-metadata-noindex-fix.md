# Issue #143 作業ログ（canonical見直し / metadata noindex反映）

- 作成日: 2026-05-16
- 対象Issue: #143
- 関連PR: （このブランチのPRで対応）
- 背景: PR #142 / Issue #141 のCodex Review指摘（P1）

## 1. 実施概要

root layoutが全ページへホームcanonicalを強制していた構成を解消し、`NEXT_PUBLIC_ROBOTS_NOINDEX=true` 時に metadata 側にも noindex/no follow を明示するよう修正した。`robots.ts` の出力方針と矛盾しない制御に統一した。

## 2. 実施内容

1. `src/app/layout.tsx`
   - `alternates.canonical: '/'` を削除し、全ページへのホームcanonical強制を停止。
   - `NEXT_PUBLIC_ROBOTS_NOINDEX` を参照し、metadata `robots` を動的に切替。
     - `true`: `index: false, follow: false`
     - 未指定/`false`: `index: true, follow: true`
   - OGP/Twitterの非公式ファンツール表記は維持。
2. `src/app/terms/page.tsx` / `src/app/privacy/page.tsx` / `src/app/disclaimer/page.tsx`
   - 各ページに `alternates.canonical` を明示し、ホームcanonical扱いにならないよう固定。
3. `docs/current-status.md` と `docs/active-issues.md` をIssue #143反映で更新。
4. 本作業ログおよびAIプロンプトログを追加。

## 3. 技術判断

- canonicalは「rootで一括固定」ではなく「ページ単位の自己canonical優先」に変更。
- noindex制御は `robots.ts`（crawl制御）と metadata `robots`（index/follow制御）を同一環境変数で揃え、公開前の誤indexリスクを低減。
- 公式素材・ゲーム画像は追加せず、非公式ファンツール表記を維持。
- 法務判断は本対応で確定しない（要確認継続）。

## 4. テスト結果

- `pnpm lint`: 実行
- `pnpm test`: 実行
- `pnpm build`: 実行

## 5. 残課題

1. sitemap本体実装要否の最終判断（必要なら別Issue化）。
2. 商用利用前の権利・法務確認（要確認）。

## 6. Rollback方法

1. `git revert <Issue #143対応コミットSHA>` を実行。
2. `src/app/layout.tsx` と `src/app/{terms,privacy,disclaimer}/page.tsx` を直前コミットへ戻す。
3. 更新ドキュメント（`docs/current-status.md` `docs/active-issues.md` `docs/logs/...` `docs/ai-prompts/...`）を必要に応じて復元。

## 7. PR本文案（日本語）

### タイトル
Issue #143: canonicalページ別方針へ修正し metadata noindex を追加

### 本文（案）
- Issue: #143

#### 実施内容
- root layout のホームcanonical固定を削除
- `NEXT_PUBLIC_ROBOTS_NOINDEX` に応じて metadata robots を切替
- `/terms` `/privacy` `/disclaimer` に自己canonicalを追加
- robots.ts 方針とmetadata robotsの整合を維持
- `docs/current-status.md` `docs/active-issues.md` を更新
- 作業ログ/AIプロンプトログを追加

#### 非変更
- OCRアルゴリズム
- OCR信頼度計算
- DB / auth / infra / deployment
- 保存payload仕様 / ランキング仕様
- 公式素材・ゲーム画像の追加
- sitemap本体実装

#### テスト
- `pnpm lint`
- `pnpm test`
- `pnpm build`
