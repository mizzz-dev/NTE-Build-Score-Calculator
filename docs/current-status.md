# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-15（Issue #137 監査結果反映）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。
- 月次監査Runbookと月次監査ログテンプレートを整備済み。

## 3. 直近完了タスク（Issue #135 / PR #136）

Issue #135 / PR #136 で条件付き正式展開後のOCR監視運用を月次サイクルへ移行するためのドキュメント整備を完了しました。

実施内容:
- `docs/runbooks/compare-ocr-monthly-audit-runbook.md` を追加。
- `docs/logs/compare-ocr-monthly-audit-template.md` を追加。
- fallback率、手動補正率、比較前確認離脱率、A/B取り違え誤反映率、未確認OCR値の比較計算混入有無、payload互換確認、しきい値判定、改善Issue、rollback要否、次月アクションを月次監査項目として固定。
- 記録は匿名・集計値のみとし、画像や個人情報をRepositoryへ保存しない方針を明記。
- OCRアルゴリズム、OCR信頼度計算、保存payload/共有URL/ランキング仕様は未変更。

## 4. 直近完了タスク（Issue #137）

Issue #137 で正式リリース前の品質・SEO・規約表示監査を実施し、不足事項と改善Issue候補を整理しました。

目的:
- `/score` `/card` `/compare` の主要導線と公開前情報を確認する。
- SEO/metadata/OGPが機能内容と矛盾しないか確認する。
- 非公式ファンツール表記、免責、プライバシー、サポート導線を確認する。
- secretや環境変数が公開されていないことを確認する。
- 不足がある場合は改善Issue候補を優先順位付きで整理する。

## 5. 進行中 / 次フェーズ

- 完了: Issue #137（正式リリース前の品質・SEO・規約表示確認）
- 次候補:
  1. 利用規約・免責・プライバシー方針ページ整備（P0）
  2. metadata/OGP/canonical/robots の公開前最終整備（P1）
  3. 商用利用前の権利・法務確認（要確認）
  4. 正式リリース準備・リリースノート作成

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
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/runbooks/compare-ocr-release-runbook.md`
- `docs/runbooks/compare-ocr-monthly-audit-runbook.md`
- `docs/logs/compare-ocr-monthly-audit-template.md`
- `docs/active-issues.md`


## 8. Issue #137 監査での主要結論

- `/score` `/card` `/compare` の主要導線とOCR未使用時の手動入力導線は維持されている。
- OCRメタ情報（`confidence` `matchType` `rawText` `candidates` など）を保存payload・共有URL・ランキングpayloadへ混入させない方針は維持されている。
- 低信頼度候補を自動確定しない方針は維持されている。
- 非公式ファンツール表記はヘッダー/フッターで確認できる。
- 一方で、利用規約/免責/プライバシー方針ページと公開向けmetadata/OGP整備は不足しており、公開前改善Issue候補として整理済み。
