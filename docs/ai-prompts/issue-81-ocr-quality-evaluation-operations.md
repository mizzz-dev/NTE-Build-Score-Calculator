# Issue #81 用 AIプロンプト

```txt
Issue #81 に対応してください。

目的:
PR #80 でRepository Memory / Context Bootstrapの正本ドキュメントが整備されたため、次に /score OCR MVP の品質評価運用を定義してください。誤認識率、手動補正率、処理時間、端末差、失敗時fallback率を継続的に評価できる状態にし、/card・/compare への展開可否を判断できる材料を作ることが目的です。

前提:
- PR #66 のOCR要件定義を前提にする
- PR #68 のブラウザ内OCR PoCを前提にする
- PR #70 の /score OCR入力補助UIを前提にする
- PR #72 のOCR実行アダプタと手動補正UIを前提にする
- PR #74 のOCR入力補助UI責務分離と回帰テストを前提にする
- PR #76 のTesseract.js遅延読み込み実OCRエンジンを前提にする
- PR #78 のOCR結果ステータスマッピング精度改善を前提にする
- PR #80 のRepository Memory / Context Bootstrapを前提にする
- 今回はOCR品質評価運用のドキュメント整備に限定する
- OCRアルゴリズム変更は行わない
- UI実装変更は行わない
- 画像保存機能追加は行わない
- 外部OCR API連携は行わない
- DB migrationは追加しない
- 保存payload仕様は変更しない
- PR本文・コメント・ドキュメントは日本語で統一する
```
