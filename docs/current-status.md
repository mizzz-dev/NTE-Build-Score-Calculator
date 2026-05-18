# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-18（PR #151 merge後処理 / Issue #152 作成反映）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1として metadata / OGP / canonical / robots / sitemap の最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

正式リリース準備として、公開前チェックリストとリリースノート案をRepositoryへ保存済みです。次は本番URL / 環境変数 / Go-No-Go 判定の最終確認を行います。

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

## 3. 直近完了タスク（Issue #150 / PR #151）

Issue #150 / PR #151 で正式リリース準備ドキュメントを整備しました。

実施内容:
- `docs/release-checklist.md` を正式リリース前向けに全面更新。
- security / privacy / license / release / support 観点を整理。
- 本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` の確認項目を追加。
- 利用規約・免責・プライバシー方針への導線確認、OCR画像非保存、低信頼度OCR候補の自動確定禁止、OCRメタ情報非混入方針の確認項目を追加。
- rollback手順とpost-release確認項目を追加。
- `docs/release-notes/2026-05-18-official-release-candidate.md` を追加し、主要機能、公開範囲、既知制限、非公式ファンツール表記、サポート範囲、rollback方針、Breaking changeなし、商用利用前専門確認未完了を記録。
- 本対応はドキュメント作業に限定し、アプリ実装・インフラ・本番deployは変更していない。

## 4. 現在の次作業（Issue #152）

Issue #152 で本番URL・環境変数・Go/No-Go判定を正式リリース前に実施します。

目的:
- 本番URLを確認する。
- `NEXT_PUBLIC_SITE_URL` が本番URLと一致しているか確認する。
- `NEXT_PUBLIC_ROBOTS_NOINDEX` の本番設定方針を確認する。
- `robots.txt` / `sitemap.xml` / canonical / OGP の公開方針を確認する。
- secretや `.env.local` がRepositoryに含まれていないことを確認する。
- Go / No-Go 判定結果と根拠をRepositoryへ保存する。
- 実際の本番deployや本番環境変数変更は行わない。

## 5. 進行中 / 次フェーズ

- 進行中: Issue #152（本番URL・環境変数・Go/No-Go判定）
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
