# Active Issues（Context Bootstrap）

最終更新: 2026-05-13（Issue #85反映）

## 1. 現在Open Issue
本ドキュメント作成時点で、詳細なOpen Issue一覧は GitHub 側の最新状態を確認して更新する運用とする。

- #85: `/score` OCR品質評価 初回運用ログ作成（完了）
- #83: `/score` OCR失敗時UX改善と手動補正支援（完了）
- #81: `/score` OCR品質評価運用定義（完了）
- #79: Repository Memory / Context Bootstrap 正本ドキュメント整備（完了）
- OCR関連継続Issue: 精度・UX・運用改善系（個別番号は都度追記）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補
1. OCR品質評価 第2サイクル実測（前週差分・カテゴリ母数拡張）
2. OCR品質評価未達KPIの改善Issue起票（低解像度/韓国語/低スペック端末）
3. `/card` `/compare` OCR展開の要件再評価
4. 公開マスタ運用の誤投入防止強化（レビュー体制・検証手順）

## 3. 優先順位（暫定）
- P1: OCR品質評価未達KPI改善
- P1: OCR品質評価第2サイクル実測
- P2: 公開マスタ運用強化
- P3: `/card` `/compare` OCR展開検討

## 4. Blocker
- OCR対象画面を拡大する前に、`/score` で精度・補正負荷・処理時間の基準値を確定する必要あり。
- 公開マスタの別名/同義語メンテ運用が未成熟な場合、マッピング精度が頭打ちになる可能性あり。

## 5. Handoff情報
- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/ocr-requirements.md` の「対象範囲」「非対象」「payload非混入方針」を確認する。
- 実装前に「今回Issueで変更してよい層（UI/adapter/mapper等）」を明文化し、禁止領域を再確認する。
