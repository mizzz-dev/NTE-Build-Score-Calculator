# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-15（PR #140 merge後処理 / Issue #141 作成反映）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。
- 月次監査Runbookと月次監査ログテンプレートを整備済み。
- 利用規約・免責・プライバシー方針ページを追加済み。

## 3. 直近完了タスク（Issue #139 / PR #140）

Issue #139 / PR #140 で利用規約・免責・プライバシー方針ページを追加しました。

実施内容:
- `src/app/terms/page.tsx` に利用規約ページを追加。
- `src/app/disclaimer/page.tsx` に免責事項ページを追加。
- `src/app/privacy/page.tsx` にプライバシー方針ページを追加。
- `src/components/layout/AppFooter.tsx` に規約系3ページへの導線を追加。
- 非公式ファンツールであること、公式とは関係がないことを明記。
- OCRは入力補助であり、最終確認は利用者責任であることを明記。
- 画像はブラウザ内処理を基本とし、サーバー保存しない方針を明記。
- 個人情報・アカウント情報・機密情報を含む画像の利用注意を明記。
- 正確性非保証、公式素材・名称・ゲーム内情報・画像などの利用可否要確認、商用利用前の権利・法務確認を明記。
- OCRアルゴリズム、OCR信頼度計算、保存payload/共有URL/ランキング仕様は未変更。

## 4. 現在の次作業（Issue #141）

Issue #141 で `metadata` / OGP / canonical / robots を公開前向けに最終調整します。

目的:
- title/description を現在の機能内容と矛盾しない内容へ調整する。
- 公式サービスと誤認させない非公式ファンツール表記を維持する。
- OGP/Twitterカード設定を必要最小限で整理する。
- canonical/robots/sitemap方針を整理する。
- 公式素材・ゲーム画像を使わない方針を維持する。

## 5. 進行中 / 次フェーズ

- 進行中: Issue #141（metadata・OGP・canonical・robots の公開前最終整備）
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
- `docs/logs/2026-05-15-issue-139-terms-disclaimer-privacy-pages.md`
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/runbooks/compare-ocr-release-runbook.md`
- `docs/active-issues.md`
