# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-13（Issue #103 `/card` `/compare` OCR展開可否レビュー反映）

## 1. 現在の実装状態
OCR MVP は、`/score` 画面における入力補助として段階的に導入済みです。保存・共有・ランキングのpayload互換は維持されています。


## 1.1 第3・第4サイクル実測結果サマリ（Issue #99 / #101）
- 第3サイクルログの統計整合性を再確認し、4秒超過導線到達率の分母誤記を是正（39→5）。
- 第4サイクルで受け入れKPIを全項目達成（OCR処理時間 p95=3.8秒）。
- 第3・第4の連続2サイクルで全KPI達成を確認。
- `/card` `/compare` へのOCR展開は本Issueでは未実装とし、次Issueで要件再評価レビューへ進行。


## 1.2 Issue #103 展開可否レビュー結果
- `/card`・`/compare` へのOCR入力補助展開可否を要件・影響・リスク・運用条件で再評価。
- 判定は「条件付き可」。
- 条件: payload非混入維持、ランキング/共有URL互換維持、低スペック端末監視強化、段階展開・ロールバック条件明文化。
- 本Issueでは実装は行わず、次Issue候補（`/card` 要件詳細化→限定導入→`/compare` 要件化）を整理。

## 2. 完了済みフェーズ（PR #80 まで）
- OCR要件定義
- ブラウザ内OCR PoC
- `/score` OCR入力補助UI
- OCR実行アダプタ
- OCR UI責務分離（Container/Panel分割）
- Tesseract.js 遅延読み込み接続
- OCRステータスマッピング精度改善
- Repository Memory / Context Bootstrap 正本ドキュメント整備

## 3. 進行中 / 次フェーズ
- 進行中: OCR MVPの品質安定化（精度・性能・UXの継続検証、Issue #101で第4サイクル実測と連続達成を記録）
- 反映済み: Issue #83 で `/score` OCR失敗時UX（再試行導線・手動fallback導線・未解決可視化・反映可否理由表示）を強化
- 次フェーズ候補:
  1. OCR KPI全項目の連続達成確認（`/card` `/compare` 展開判定条件）
  2. 低スペック端末カテゴリp95（4.4秒）短縮の継続
  3. 低解像度・ぼやけ・韓国語カテゴリの精度底上げ

## 4. 既知の制約
- OCRは入力補助であり、最終確定はユーザー手動確認が必須。
- 初期適用範囲は `/score` のみ（`/card` `/compare` は未適用）。
- 画像はサーバー保存しない（メモリ上の一時処理）。
- OCR由来メタ情報（confidence等）は保存payloadへ混入させない。
- 端末性能・ブラウザ性能によりOCR処理時間が変動する。

## 5. 注意すべき変更禁止領域
本フェーズでは以下を変更しない。
- OCRアルゴリズムの大幅変更（MVP範囲外）
- DB migration の追加
- auth / infra / deployment 設定
- 保存payload仕様
- ランキング仕様
- 管理画面CRUD
- `/card` `/compare` へのOCR適用

## 6. 参照ドキュメント
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
