# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-13（Issue #95 第2サイクル実測反映）

## 1. 現在の実装状態
OCR MVP は、`/score` 画面における入力補助として段階的に導入済みです。保存・共有・ランキングのpayload互換は維持されています。

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
- 進行中: OCR MVPの品質安定化（精度・性能・UXの継続検証、第2サイクル評価ログ作成済み）
- 反映済み: Issue #83 で `/score` OCR失敗時UX（再試行導線・手動fallback導線・未解決可視化・反映可否理由表示）を強化
- 次フェーズ候補:
  1. OCR処理時間 p95（4.0秒以内）の未達改善（低スペック端末対策）
  2. 低解像度・ぼやけ・韓国語カテゴリの精度底上げ
  3. `/card` `/compare` への展開可否レビュー（全KPI達成後に再判定）

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
