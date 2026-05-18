# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-18（Issue #150 正式リリース準備ドキュメント作成）

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
- Issue #148 として商用利用前の権利・法務確認観点を整理済み。

## 3. 直近完了タスク（Issue #148 / PR #149）

Issue #148 / PR #149 で商用利用前の権利・法務確認観点を整理しました。

実施内容:
- `docs/reports/2026-05-17-issue-148-commercial-legal-readiness-review.md` を追加し、非公式ファンツールとしての権利・法務確認観点を整理。
- 公式名称・略称・ゲーム内用語、公式素材・画像・スクリーンショット・ロゴ・アイコン、計算式・スコア定義・ステータス名称・ゲーム内情報、OCR画像処理、免責、収益化時追加確認事項を棚卸し。
- 確認済み / 未確認 / 専門確認必須の分類、公開前P0と商用前必須リスクを分離。
- 利用規約・免責・プライバシー方針、非公式表記、OCR画像非保存方針との整合を確認。
- `docs/risks/risks.md` へ商用利用時の権利・法務確認未完了リスクを追記。
- 法務判断は確定せず、専門確認へ引き継げる形に限定。

## 4. 直近対応タスク（Issue #150）

Issue #150 で正式リリース準備・リリースノート・公開前チェックリストを作成しました。

目的:
- 正式リリース前チェックリストをRepositoryへ保存する。
- リリースノート案をRepositoryへ保存する。
- security / privacy / license / release / support 観点を明記する。
- 本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` の確認項目を明記する。
- rollback手順とpost-release確認項目を明記する。
- 非公式ファンツール、正確性非保証、OCR補助、画像非保存、商用利用前専門確認の残課題を明記する。

## 5. 進行中 / 次フェーズ

- 進行中: 正式公開前の最終確認（Go / No-Go 判定準備）
- 次候補:
  1. 本番URL / `NEXT_PUBLIC_SITE_URL` の最終確認
  2. `NEXT_PUBLIC_ROBOTS_NOINDEX` の本番設定確認
  3. 正式リリース実施判断（Go / No-Go）
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

## 7. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/logs/2026-05-15-issue-137-pre-release-quality-seo-compliance-audit.md`
- `docs/logs/2026-05-16-issue-141-metadata-ogp-canonical-robots.md`
- `docs/logs/2026-05-16-issue-143-canonical-metadata-noindex-fix.md`
- `docs/logs/2026-05-17-issue-145-sitemap-decision-and-implementation.md`
- `docs/reports/2026-05-17-issue-148-commercial-legal-readiness-review.md`
- `docs/risks/risks.md`
- `docs/release-checklist.md`
- `docs/release-notes/2026-05-18-official-release-candidate.md`
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/runbooks/compare-ocr-release-runbook.md`
- `docs/active-issues.md`
