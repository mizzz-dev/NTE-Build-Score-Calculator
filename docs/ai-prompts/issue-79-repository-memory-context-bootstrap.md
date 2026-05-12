# Issue #79 用 AIプロンプト

```txt
Issue #79 に対応してください。

目的:
AI/人間のどちらが作業を引き継いでも短時間で現在地を理解できるように、Repository Memory と Context Bootstrap の正本ドキュメントを整備してください。会話ログやPR本文だけに依存せず、Repository内のdocsをSource of Truthとして扱える状態にすることが目的です。

前提:
- PR #78 まででOCR MVPは以下の段階まで進んでいる
  - OCR要件定義
  - ブラウザ内OCR PoC
  - /score OCR入力補助UI
  - OCR実行アダプタ
  - OCR UI責務分離
  - Tesseract.js遅延読み込み接続
  - OCRステータスマッピング精度改善
- 以下のContext Bootstrap用ドキュメントが未整備である
  - docs/project-overview.md
  - docs/current-status.md
  - docs/active-issues.md
  - docs/architecture/system-overview.md
- 今回はRepository Memory / Context Bootstrapの整備に限定する
- 機能実装は行わない
- OCRロジック変更は行わない
- DB migrationは追加しない
- auth / infra / deployment設定変更は行わない
- 保存payload仕様は変更しない
- PR本文・コメント・ドキュメントは日本語で統一する
```
