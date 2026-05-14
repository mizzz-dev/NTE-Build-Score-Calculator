# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-14（Issue #113 `/compare` OCR要件詳細化反映）

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

## 1.5 Issue #109 完了結果（/card OCR限定導入後検証）
- KPI計測ログを `docs/logs/card-ocr-limited-release-kpi.md` として作成し、匿名・集計値で記録済み。
- OCR処理時間p95（全体3.9秒、低4.2秒/中3.7秒/高3.1秒）を確認。
- 補正率18.3%、未確定項目残存率13.8%、反映前確認離脱率4.2%、fallback率9.2%を記録。
- 保存payload・共有URL・ランキングpayload互換は維持（OCRメタ混入なし）。
- `/compare` 副作用なし、低信頼度候補の自動確定なし、OCR失敗時の手動fallback成立を確認。
- 限定導入判定は「条件付き継続」（低性能端末p95が閾値近傍のため監視継続）。
- `/compare` OCR要件詳細化は、`/card`で2サイクル連続達成後に進行判断とする。


## 1.6 Issue #111 完了結果（/card OCR限定導入 第2サイクル）
- KPI計測ログを `docs/logs/card-ocr-limited-release-kpi-cycle-2.md` として作成し、匿名・集計値で記録済み。
- OCR処理時間p95（全体3.7秒、低4.0秒/中3.5秒/高3.0秒）を確認。
- 補正率17.1%、未確定項目残存率12.5%、反映前確認離脱率3.9%、fallback率8.4%を記録。
- 第1サイクル比で全KPIが改善。
- 保存payload・共有URL・ランキングpayload互換は維持（OCRメタ混入なし）。
- `/compare` 副作用なし、低信頼度候補の自動確定なし、OCR失敗時の手動fallback成立を確認。
- `/card` OCR限定導入は2サイクル連続で継続条件を達成。
- `/compare` OCR要件詳細化は進行可（実装着手は次Issueで判断）。


## 1.7 Issue #113 完了結果（`/compare` OCR要件詳細化）
- Issue #113 で `/compare` OCR入力補助の要件詳細化・監視設計ドキュメントを作成済み。
- 成果物: `docs/reviews/issue-113-compare-ocr-requirements-and-observability.md`
- `/compare` の責務境界（入力/表示/比較計算/共有URL/保存・ランキング）を固定し、`/score`・`/card` からの流用責務と分離責務を整理。
- A/B 2系統入力のOCR反映ルール、下書き扱い、比較前手動確認必須、低信頼度未確定維持を明記。
- OCRメタの保存payload・共有URL・ランキングpayload非混入方針、比較結果への未確認値混入防止条件を明文化。
- 監視KPI（誤反映率/未確定残存率/比較前確認離脱率/fallback率/端末別p95）と限定公開ロールバック条件を定義。
- 本Issueは要件定義フェーズのため、`/compare` 実装は未着手。


## 1.8 Issue #115 実装反映状況（`/compare` OCR最小導入）
- `/compare` にA/B別OCR入力補助導線を最小構成で追加。
- A/B別OCR下書き状態を分離し、比較前確認ガード（A/B確認済み + 未確定0件）を導入。
- OCR失敗時は対象系統のみ失敗表示し、手動入力fallbackを維持。
- 保存payload・共有URL・ランキングpayload仕様は変更なし（OCRメタ非混入維持）。

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
- 完了: Issue #111 で `/card` OCR限定導入 第2サイクルKPI計測と互換性確認を記録
- 判定更新: `/card` OCR限定導入は2サイクル連続で継続条件を達成
- 次フェーズ候補:
  1. 低スペック端末カテゴリp95短縮の継続
  2. `/compare` OCR入力補助の要件詳細化（実装前レビュー）
  3. 展開時の監視条件・ロールバック条件Runbook整備
  4. fallback率・離脱率の要因分解ログ改善

## 4. 既知の制約
- OCRは入力補助であり、最終確定はユーザー手動確認が必須。
- 画像はサーバー保存しない（メモリ上の一時処理）。
- OCR由来メタ情報（confidence等）は保存payloadへ混入させない。
- 端末性能・ブラウザ性能によりOCR処理時間が変動する。
- `/card` 限定導入後は、保存payload・共有URL・ランキング互換を継続確認する。

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
- `docs/logs/issue-107-card-ocr-minimum-implementation.md`
- `docs/active-issues.md`
