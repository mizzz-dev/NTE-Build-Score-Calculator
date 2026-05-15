# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-15（Issue #139 規約ページ整備対応）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。
- 月次監査Runbookと月次監査ログテンプレートを整備済み。

## 3. 直近完了タスク（Issue #137 / PR #138）

Issue #137 / PR #138 で正式リリース前の品質・SEO・規約表示監査を実施し、不足事項と改善Issue候補を整理しました。

確認結果:
- `/score` `/card` `/compare` の主要導線とOCR未使用時の手動入力導線は維持されています。
- OCRメタ情報（`confidence` `matchType` `rawText` `candidates` など）を保存payload・共有URL・ランキングpayloadへ混入させない方針は維持されています。
- 低信頼度候補を自動確定しない方針は維持されています。
- 非公式ファンツール表記はヘッダー/フッターで確認済みです。
- `.env.local` はコミットされておらず、SupabaseはAnon Key前提です。
- 利用規約/免責/プライバシー方針ページと公開向けmetadata/OGP整備は不足しており、公開前改善Issue候補として整理済みです。

## 4. 現在の次作業（Issue #139）

進捗:
- 利用規約 / 免責 / プライバシー方針ページを追加済み。
- フッターから各ページへ到達できる導線を追加済み。
- 法務確定は行わず、要確認事項として文書化済み。


Issue #139 で利用規約・免責・プライバシー方針ページを追加します。

目的:
- 非公式ファンツールであり、公式とは関係がないことを明記する。
- OCRは入力補助であり、最終確認はユーザー責任であることを明記する。
- 画像はブラウザ内処理を基本とし、サーバー保存しない方針を明記する。
- 個人情報・アカウント情報・機密情報を含む画像をアップロードしない注意を明記する。
- 計算結果・OCR結果・ランキング結果の正確性を保証しないことを明記する。
- 公式素材・名称・ゲーム内情報・画像などの利用可否は要確認であり、商用利用前に権利・法務確認が必要であることを明記する。

## 5. 進行中 / 次フェーズ

- 進行中: Issue #139（利用規約・免責・プライバシー方針ページ整備）
- 次候補:
  1. metadata/OGP/canonical/robots の公開前最終整備（P1）
  2. 商用利用前の権利・法務確認（要確認）
  3. 正式リリース準備・リリースノート作成

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

## 7. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/logs/2026-05-15-issue-137-pre-release-quality-seo-compliance-audit.md`
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/runbooks/compare-ocr-release-runbook.md`
- `docs/runbooks/compare-ocr-monthly-audit-runbook.md`
- `docs/logs/compare-ocr-monthly-audit-template.md`
- `docs/active-issues.md`
