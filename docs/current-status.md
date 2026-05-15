# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-15（Issue #135 月次監査運用ドキュメント整備）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。

## 3. 直近完了タスク（Issue #133 / PR #134）

Issue #133 / PR #134 で `image_quality_low` 起因の事前撮影ガイドと再撮影導線改善を完了しました。

実施内容:
- OCR実行前チェックに、明るさ・傾き/ブレ回避・ステータス欠け防止・不要な情報の写り込み防止を追加。
- OCR失敗時に「再撮影で再試行」または「手動入力継続」を選べる案内へ更新。
- `/score` `/card` `/compare` のOCR導線へ最小差分で反映（共通パネル文言中心）。
- OCRアルゴリズム、OCR信頼度計算、保存payload/共有URL/ランキング仕様は未変更。

## 4. 現在の次作業（Issue #135）

Issue #135 で条件付き正式展開後のOCR監視運用を月次サイクルへ移行します。

目的:
- Runbookと監査ログに基づく月次運用手順を明文化する。（完了）
- fallback率、手動補正率、比較前確認離脱率、A/B取り違え誤反映率、payload互換確認を月次監査項目として固定する。（完了）
- 警戒しきい値超過、rollbackしきい値超過、改善Issue起票基準を月次運用で追える状態にする。（完了）
- 記録は匿名・集計値に限定し、画像や個人情報を保存しない。（完了）

## 5. 進行中 / 次フェーズ

- 進行中: なし（Issue #135 はドキュメント整備完了、レビュー待ち）
- 次候補:
  1. 正式リリース前の品質・SEO・規約整備
  2. 利用規約・免責・非公式ファンツール表記の再確認
  3. 商用利用前の権利・法務確認

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

## 7. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/reviews/issue-113-compare-ocr-requirements-and-observability.md`
- `docs/runbooks/compare-ocr-release-runbook.md`
- `docs/logs/issue-127-compare-ocr-post-release-monitoring-operations.md`
- `docs/logs/2026-05-15-issue-133-image-quality-low-ux-improvement.md`
- `docs/active-issues.md`
