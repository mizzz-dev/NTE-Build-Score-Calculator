# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-14（Issue #107 /card OCR最小実装反映）

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

## 1.3 Issue #105 要件詳細化結果
- Issue #105 で `/card` OCR入力補助の要件詳細化・監視設計ドキュメントを作成済み。
- 成果物: `docs/reviews/issue-105-card-ocr-requirements-and-observability.md`
- `/card` の責務整理、`/score` からの流用/分離責務、項目別反映ルール、payload非混入方針、監視KPI、ロールバック条件、次実装Issue最小スコープを定義済み。
- 本Issueは要件定義フェーズのため、実装は未着手。

## 1.4 Issue #107 実装反映状況
- `/card` にOCR入力補助UI導線を最小構成で追加済み（限定公開前提）。
- OCR結果は下書きとして扱い、カード生成前に確認チェックを必須化済み。
- 低信頼度項目は自動確定せず、未確定表示のまま手動確認待ちを維持。
- OCR失敗時に手動入力へ戻るfallback導線を維持。
- 保存payload・共有URL・ランキングpayload仕様は変更なし（非混入方針維持）。
- `/compare` への影響はなし。

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
- 進行中: `/card` OCR入力補助の限定導入実装フェーズ（Issue #107）
- 反映済み: Issue #105 で `/card` OCR入力補助の要件詳細化・監視設計を完了
- 次フェーズ候補:
  1. Issue #107: `/card` OCR入力補助の最小実装（限定公開）
  2. `/card` OCR入力補助の限定導入KPI計測
  3. `/card` 安定確認後の `/compare` 要件詳細化
  4. 低スペック端末カテゴリp95（4.1秒）短縮の継続
  5. 展開時の監視条件・ロールバック条件Runbook整備

## 4. 既知の制約
- OCRは入力補助であり、最終確定はユーザー手動確認が必須。
- 画像はサーバー保存しない（メモリ上の一時処理）。
- OCR由来メタ情報（confidence等）は保存payloadへ混入させない。
- 端末性能・ブラウザ性能によりOCR処理時間が変動する。
- `/card` 展開前に、保存payload・共有URL・ランキング互換への影響を明文化する。

## 5. 注意すべき変更禁止領域
本フェーズでは以下を変更しない。
- OCRアルゴリズムの大幅変更（MVP範囲外）
- DB migration の追加
- auth / infra / deployment 設定
- 保存payload仕様
- ランキング仕様
- 管理画面CRUD
- `/compare` へのOCR適用実装

## 6. 参照ドキュメント
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/reviews/ocr-expansion-feasibility-card-compare-issue-103.md`
- `docs/reviews/issue-105-card-ocr-requirements-and-observability.md`
- `docs/active-issues.md`
