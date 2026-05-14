# Issue #121 作業ログ: `/compare` OCR正式展開前のUX/観測性改善

- 作成日: 2026-05-14
- 対象Issue: #121
- 関連: #113, #115, #117, #119, PR #120
- 対象範囲: 低性能端末p95短縮に向けた待機/案内導線の最小改善、fallback要因分類、比較前確認離脱要因分類の記録方針

## 0. 変更禁止領域の再確認

本Issueでは以下を**変更しない**。

- OCRアルゴリズム
- DB / auth / infra / deployment
- 保存payload仕様
- 共有URL仕様
- ランキングpayload仕様
- 外部OCR API連携
- 画像保存方式（画像は引き続き保存しない）

## 1. 改善対象整理（KPI）

- 低性能端末p95: 4.0秒（第2サイクル）を重点監視し、待機中離脱を抑える案内文言を強化。
- fallback率: OCR失敗/長時間待機/画像品質要因/任意手動切替を分類記録。
- 比較前確認離脱率: 入力エラー・未確定残存・確認チェック未完了・OCRエラー残存を分類記録。
- 手動補正率: 未解決項目残存との相関を次サイクルで確認可能にする。

## 2. 実装・文言改善（最小差分）

- OCR処理中案内文言を調整し、「待機継続」か「再試行/手動fallback」を明示。
- 長時間処理時に「A/B入力値は保持される」ことを表示し、取り違え不安による途中離脱を抑制。
- OCRアルゴリズムには手を入れず、UI文言のみ改善。

## 3. fallback要因分類ポリシー

`src/features/compare/lib/compareOcrObservability.ts` に分類関数を追加。

- `ocr_engine_error`: OCR処理失敗
- `ocr_timeout_wait_switch`: 長時間待機（6秒以上）で手動切替
- `image_quality_low`: 未解決項目残存に起因する切替
- `manual_input_preferred`: 任意手動入力選好
- `unknown`: 上記以外

## 4. 比較前確認離脱要因分類ポリシー

- `input_validation_error`: A/B入力エラー
- `ocr_error_unresolved`: OCR失敗状態残存
- `unresolved_items_remaining`: 未確定項目残存
- `review_acknowledgement_missing`: 確認チェック未完了
- `ab_test_recheck`: A/B再確認導線起因
- `unknown`: 上記以外

※ 記録は匿名・集計値のみ。画像・個人情報・アカウント情報は保存しない。

## 5. 安全性・互換性確認観点

- 保存payload・共有URL・ランキングpayloadへOCRメタを混入させない方針を維持。
- 未確認OCR値は比較計算へ混入しない（既存ガード維持）。
- A/B取り違え誤反映防止（side分離状態管理）を維持。
- 低信頼度候補の自動確定禁止を維持。
- OCR失敗時の対象系統のみ手動fallback維持。

## 6. 次アクション判断

- 本改善反映後は第3サイクルKPI計測へ進む。
- 第3サイクルで以下が維持/改善なら正式展開可否判定へ進む。
  - 低性能端末p95
  - fallback率（要因別比率含む）
  - 比較前確認離脱率（要因別比率含む）
  - A/B取り違え誤反映率0.0%維持

## 7. security / privacy / license / release / support

- security: OCRメタはUI一時状態のみに限定。
- privacy: 画像・個人情報・アカウント情報を保存しない。
- license: 非公式ファンツールとして公式素材利用可否は要確認を継続。
- release: 正式展開前の運用リスク低減を優先し、第3サイクル計測へ進行。
- support: 長時間処理時の案内強化で手動fallback判断を容易化。
