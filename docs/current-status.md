# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-16（Issue #141 対応反映）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

加えて、公開前P1として metadata / OGP / canonical / robots の最小整備を実施しました。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。
- 月次監査Runbookと月次監査ログテンプレートを整備済み。
- 利用規約・免責・プライバシー方針ページを追加済み。
- Issue #141 として metadata/OGP/Twitter/canonical/robots 方針の公開前最終整備を実施。

## 3. 直近完了タスク（Issue #141）

Issue #141 で公開前監査（Issue #137）に基づくSEO/共有表示の最小整備を行いました。

実施内容:
- `src/app/layout.tsx` で `metadataBase`、`title` テンプレート、`description`、`alternates.canonical` を設定。
- `openGraph` / `twitter` を最小構成で追加し、機能説明と「非公式ファンツール」表記を統一。
- `src/app/robots.ts` を追加し、`NEXT_PUBLIC_ROBOTS_NOINDEX=true` で公開前noindex、未指定時はindex許可に切替可能な方針を実装。
- robotsに `sitemap.xml` 参照を記載（sitemap自体の実装は別Issue分離が妥当）。
- 公式素材・ゲーム画像は追加せず、法務判断は引き続き「要確認」として維持。

## 4. 進行中 / 次フェーズ

- 進行中: 商用利用前の権利・法務確認（要確認）
- 次候補:
  1. sitemap実装要否の確定と必要時の別Issue化
  2. 正式リリース準備・リリースノート作成
  3. 公開前最終チェックリスト整備

## 5. 注意すべき変更禁止領域

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

## 6. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/logs/2026-05-15-issue-137-pre-release-quality-seo-compliance-audit.md`
- `docs/logs/2026-05-16-issue-141-metadata-ogp-canonical-robots.md`
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/runbooks/compare-ocr-release-runbook.md`
- `docs/active-issues.md`
