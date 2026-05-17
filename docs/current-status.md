# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-17（PR #147 merge後処理 / Issue #148 作成反映）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1として metadata / OGP / canonical / robots / sitemap の最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

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
- Issue #145 として sitemap実装要否を確定し、`src/app/sitemap.ts` を追加済み。

## 3. 直近完了タスク（Issue #145 / PR #147）

Issue #145 / PR #147 で sitemap実装要否を確定し、`src/app/sitemap.ts` を追加しました。

実施内容:
- `src/app` 配下の公開対象ページを棚卸しし、公開対象を静的ページ・主要機能ページへ限定。
- `MetadataRoute.Sitemap` で最小構成の `src/app/sitemap.ts` を追加。
- `NEXT_PUBLIC_SITE_URL` と fallback URL（`https://nte-build-score-calculator.vercel.app`）を `layout.tsx` / `robots.ts` と同一方針で統一。
- `NEXT_PUBLIC_ROBOTS_NOINDEX=true` 時は sitemap を空配列として返し、公開前noindex運用と整合。
- `robots.ts` の `sitemap.xml` 参照と sitemap 本体の実装有無を整合。
- 公式素材・ゲーム画像は追加せず、法務判断は引き続き「要確認」として維持。

## 4. 現在の次作業（Issue #148）

Issue #148 で商用利用前の権利・法務確認観点を整理します。

目的:
- 非公式ファンツールとして確認すべき権利・法務論点をRepositoryに残す。
- 公式名称、略称、ゲーム内用語、公式素材、画像、スクリーンショット、ロゴ、アイコン利用の確認観点を整理する。
- 計算式、スコア定義、ステータス名称、ゲーム内情報の扱いを整理する。
- 広告、収益化、寄付、課金などを行う場合の追加確認事項を整理する。
- 法務判断は確定せず、専門確認へ引き継げる形にする。

## 5. 進行中 / 次フェーズ

- 進行中: Issue #148（商用利用前の権利・法務確認観点整理）
- 次候補:
  1. 正式リリース準備・リリースノート作成
  2. 公開前最終チェックリスト整備
  3. 本番URL / `NEXT_PUBLIC_SITE_URL` の最終確認

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
- `docs/logs/2026-05-17-issue-145-sitemap-decision-and-implementation.md`
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/runbooks/compare-ocr-release-runbook.md`
- `docs/active-issues.md`
