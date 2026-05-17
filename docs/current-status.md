# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-17（Issue #145 sitemap方針確定と実装反映）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1として metadata / OGP / canonical / robots の最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。
- 月次監査Runbookと月次監査ログテンプレートを整備済み。
- 利用規約・免責・プライバシー方針ページを追加済み。
- Issue #141 として metadata / OGP / Twitter / canonical / robots 方針の公開前最小整備を実施済み。
- Issue #143 として canonicalページ別方針見直しとmetadata noindex反映を実施済み。

## 3. 直近完了タスク（Issue #143 / PR #144）

Issue #143 / PR #144 で canonical をページ別方針に見直し、公開前noindexをmetadataにも反映しました。

実施内容:
- `src/app/layout.tsx` から root layout のホームcanonical固定を削除。
- `NEXT_PUBLIC_ROBOTS_NOINDEX` に応じて metadata `robots` を `index: false, follow: false` または `index: true, follow: true` へ切替。
- `src/app/terms/page.tsx`、`src/app/privacy/page.tsx`、`src/app/disclaimer/page.tsx` に自己canonicalを追加。
- `robots.ts` の既存方針とmetadata側のrobots指示を同一環境変数で整合。
- 公式素材・ゲーム画像は追加せず、法務判断は引き続き「要確認」として維持。

## 4. 直近完了タスク（Issue #145）

Issue #145 で sitemap実装要否を確定し、`src/app/sitemap.ts` を追加しました。

実施内容:
- `src/app` 配下の公開対象ページを棚卸しし、公開対象を静的ページ・主要機能ページへ限定。
- `MetadataRoute.Sitemap` で最小構成の `src/app/sitemap.ts` を追加。
- `NEXT_PUBLIC_SITE_URL` と fallback URL（`https://nte-build-score-calculator.vercel.app`）を `layout.tsx` / `robots.ts` と同一方針で統一。
- `NEXT_PUBLIC_ROBOTS_NOINDEX=true` 時は sitemap を空配列として返し、公開前noindex運用と整合。
- `robots.ts` の `sitemap.xml` 参照と sitemap 本体の実装有無を整合。

## 5. 進行中 / 次フェーズ

- 進行中: なし（Issue #145は実装完了、レビュー待ち）
- 次候補:
  1. 商用利用前の権利・法務確認（要確認）
  2. 正式リリース準備・リリースノート作成
  3. 公開前最終チェックリスト整備

## 6. 注意すべき変更禁止領域

本フェーズでは以下を変更しない。

- OCRアルゴリズム
- OCR信頼度計算
- DB migration
- auth / infra / deployment 設定
- 保存payload仕様
- 共有URL仕様
- ランキング仕様
- 画像保存方式
- 外部OCR API連携
- 低信頼度候補の自動確定
- 法務判断の確定
- 公式素材・ゲーム画像の追加

## 7. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/logs/2026-05-15-issue-137-pre-release-quality-seo-compliance-audit.md`
- `docs/logs/2026-05-16-issue-141-metadata-ogp-canonical-robots.md`
- `docs/logs/2026-05-16-issue-143-canonical-metadata-noindex-fix.md`
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/runbooks/compare-ocr-release-runbook.md`
- `docs/active-issues.md`
