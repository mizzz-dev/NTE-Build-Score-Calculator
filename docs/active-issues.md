# Active Issues（Context Bootstrap）

最終更新: 2026-05-12

## 1. 現在Open Issue
本ドキュメント作成時点で、詳細なOpen Issue一覧は GitHub 側の最新状態を確認して更新する運用とする。

- #79: Repository Memory / Context Bootstrap 正本ドキュメント整備（本Issue）
- OCR関連継続Issue: 精度・UX・運用改善系（個別番号は都度追記）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補
1. OCR品質評価運用（指標定義・計測フロー整備）
2. OCR失敗時のUX改善（再試行導線、手動補正支援）
3. `/card` `/compare` OCR展開の要件再評価
4. 公開マスタ運用の誤投入防止強化（レビュー体制・検証手順）

## 3. 優先順位（暫定）
- P1: OCR品質評価運用
- P1: OCR失敗時UX改善
- P2: 公開マスタ運用強化
- P3: `/card` `/compare` OCR展開検討

## 4. Blocker
- OCR対象画面を拡大する前に、`/score` で精度・補正負荷・処理時間の基準値を確定する必要あり。
- 公開マスタの別名/同義語メンテ運用が未成熟な場合、マッピング精度が頭打ちになる可能性あり。

## 5. Handoff情報
- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/ocr-requirements.md` の「対象範囲」「非対象」「payload非混入方針」を確認する。
- 実装前に「今回Issueで変更してよい層（UI/adapter/mapper等）」を明文化し、禁止領域を再確認する。
