# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-18（Issue #154 canonical方針整合対応）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1として metadata / OGP / canonical / robots / sitemap の最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

正式リリース準備として、公開前チェックリスト、リリースノート案、本番公開前のGo / No-Go判定レポートをRepositoryへ保存済みです。Issue #154で主要機能ページcanonical方針とGo判定レポート記載の不整合も解消済みです。

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
- Issue #148 として商用利用前の権利・法務確認観点を整理済み。
- Issue #150 として正式リリース前チェックリストと正式リリース候補ノートを作成済み。
- Issue #152 として本番URL・環境変数・Go/No-Go判定を記録済み。

## 3. 直近完了タスク（Issue #152 / PR #153）

Issue #152 / PR #153 で本番公開前の最終確認結果とGo / No-Go判定を記録しました。

実施内容:
- `docs/reports/2026-05-18-issue-152-go-no-go-final-readiness.md` を追加。
- 本番URL候補を `https://nte-build-score-calculator.vercel.app` として記録（実装fallbackと整合）。
- `NEXT_PUBLIC_SITE_URL` と `NEXT_PUBLIC_ROBOTS_NOINDEX` の公開方針を `layout.tsx` / `robots.ts` / `sitemap.ts` で照合。
- `.env.local` 非コミット、secret混入なし、service role key不使用方針を再確認。
- security / privacy / license / release / support 観点で最終確認を実施。
- Go / No-Go 判定を **Go（条件付き）** として記録。
- 条件: 商用利用前の専門確認（名称・素材・規約文言）未完了項目を継続管理。

PR #153のレビューで、主要機能ページのcanonical方針についてP2指摘が出ています。Go判定レポートでは主要ページがページ単位の自己canonical方針である旨を記録していますが、`src/app/score/page.tsx`、`src/app/card/page.tsx`、`src/app/compare/page.tsx` に個別canonical metadataがない可能性が指摘されています。

## 4. 現在の次作業（Issue #154）

Issue #154 で主要機能ページのcanonical方針を実装とレポートで整合済みです。

目的:
- PR #153レビューで指摘されたcanonical coverageの不整合を解消する。
- `/score` `/card` `/compare` のcanonical方針を明確にする。
- Go判定レポートのcanonical記載を実装状態と一致させる。
- 正式リリース判断に必要な未解決リスクを更新する。

## 5. 進行中 / 次フェーズ

- 完了: Issue #154（主要機能ページのcanonical方針整合）
- 次候補:
  1. 正式リリース実施判断（Go / No-Go）
  2. 本番deploy手順の実施または別Issue化
  3. post-release確認ログ作成
  4. 商用化前の専門確認（名称・素材・免責文言・収益化導線）

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
- 実際の本番deploy実行
- 本番環境変数の変更

## 7. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/reports/2026-05-18-issue-152-go-no-go-final-readiness.md`
- `docs/release-checklist.md`
- `docs/release-notes/2026-05-18-official-release-candidate.md`
- `docs/logs/2026-05-18-issue-150-release-readiness-docs.md`
- `docs/reports/2026-05-17-issue-148-commercial-legal-readiness-review.md`
- `docs/risks/risks.md`
- `docs/logs/2026-05-15-issue-137-pre-release-quality-seo-compliance-audit.md`
- `docs/logs/2026-05-17-issue-145-sitemap-decision-and-implementation.md`
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/runbooks/compare-ocr-release-runbook.md`
- `docs/active-issues.md`
