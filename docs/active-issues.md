# Active Issues（Context Bootstrap）

最終更新: 2026-05-13（Issue #101 OCR品質評価 第4サイクル実測・連続達成判定反映）

## 1. 現在Open Issue
本ドキュメント作成時点で、詳細なOpen Issue一覧は GitHub 側の最新状態を確認して更新する運用とする。

- #101: `/score` OCR品質評価 第4サイクル実測ログ作成・連続達成判定（完了）
- #99: `/score` OCR品質評価 第3サイクル実測ログ作成（完了・整合性再確認済み）
- #95: `/score` OCR品質評価 第2サイクル実測ログ作成（完了）
- #85: `/score` OCR品質評価 初回運用ログ作成（完了）
- #83: `/score` OCR失敗時UX改善と手動補正支援（完了・追補反映済み）
- #81: `/score` OCR品質評価運用定義（完了）
- #79: Repository Memory / Context Bootstrap 正本ドキュメント整備（完了）
- OCR関連継続Issue: 精度・UX・運用改善系（個別番号は都度追記）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補
1. `/card` `/compare` OCR展開可否の要件再評価レビュー（連続2サイクル達成を受けた判定フェーズ）
2. 低スペック端末カテゴリp95短縮の継続検証（4.1秒→4.0秒以内）
3. 低解像度・ぼやけカテゴリの補正率改善継続
4. 展開時の監視条件・ロールバック条件定義Issue起票

## 3. 優先順位（暫定）
- P1: `/card` `/compare` OCR展開可否の要件再評価（判定ゲート通過後の設計確認）
- P1: 低スペック端末カテゴリp95短縮の継続
- P2: 低解像度/ぼやけカテゴリの品質底上げ
- P3: 段階展開時の運用監視設計

## 4. Blocker
- 連続2サイクル達成（第3: p95=3.9秒、第4: p95=3.8秒）を確認し、展開判定レビューへ進行可能。
- 低スペック端末カテゴリは改善（p95=4.1秒）したものの、カテゴリ単体の短縮余地が残る。

## 5. Handoff情報
- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/ocr-requirements.md` の「対象範囲」「非対象」「payload非混入方針」を確認する。
- KPI差分は `docs/logs/ocr-quality-evaluation-initial.md` と `docs/logs/ocr-quality-evaluation-cycle-2.md` を比較する。
- 実装前に「今回Issueで変更してよい層（UI/adapter/mapper等）」を明文化し、禁止領域を再確認する。
