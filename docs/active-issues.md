# Active Issues（Context Bootstrap）

最終更新: 2026-05-13（Issue #97 OCR処理時間p95未達UX改善反映）

## 1. 現在Open Issue
本ドキュメント作成時点で、詳細なOpen Issue一覧は GitHub 側の最新状態を確認して更新する運用とする。

- #95: `/score` OCR品質評価 第2サイクル実測ログ作成（完了）
- #85: `/score` OCR品質評価 初回運用ログ作成（完了）
- #83: `/score` OCR失敗時UX改善と手動補正支援（完了・追補反映済み）
- #81: `/score` OCR品質評価運用定義（完了）
- #79: Repository Memory / Context Bootstrap 正本ドキュメント整備（完了）
- OCR関連継続Issue: 精度・UX・運用改善系（個別番号は都度追記）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補
1. OCR処理時間 p95未達（4.1秒）の改善Issue起票（低スペック端末観点）
2. 低解像度・ぼやけ・韓国語カテゴリの未達/準未達KPI改善Issue起票
3. `/card` `/compare` OCR展開の要件再評価（全KPI達成後）
4. 公開マスタ運用の誤投入防止強化（レビュー体制・検証手順）

## 3. 優先順位（暫定）
- P1: OCR処理時間 p95再測定と4.0秒以内達成確認（低スペック端末）
- P1: 低解像度/ぼやけ/韓国語カテゴリの品質底上げ
- P2: 公開マスタ運用強化
- P3: `/card` `/compare` OCR展開検討

## 4. Blocker
- `/card` `/compare` 展開判定には全KPI達成が必要だが、第2サイクル時点でOCR処理時間 p95（4.0秒以内）が未達（4.1秒）。
- 低スペック端末カテゴリ（p95=4.9秒）が全体閾値を押し上げる傾向があり、Issue #97で追加した待機UX/事前ガイドの効果を第3サイクルで再検証する必要がある。

## 5. Handoff情報
- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/ocr-requirements.md` の「対象範囲」「非対象」「payload非混入方針」を確認する。
- KPI差分は `docs/logs/ocr-quality-evaluation-initial.md` と `docs/logs/ocr-quality-evaluation-cycle-2.md` を比較する。
- 実装前に「今回Issueで変更してよい層（UI/adapter/mapper等）」を明文化し、禁止領域を再確認する。
