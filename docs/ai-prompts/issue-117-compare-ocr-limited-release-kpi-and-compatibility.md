# Issue #117 AIプロンプトログ

- 日付: 2026-05-14
- 指示概要: `docs/ai-protocol/PROMPT.txt` を最優先ルールとして、`/compare` OCR最小導入（Issue #115 / PR #116）後の限定導入KPI計測・互換性確認・継続可否判定を実施する。
- 必須条件:
  - KPI（全体/端末別p95、A/B誤反映率、未確定残存率、離脱率、fallback率、手動補正率）を匿名・集計値で記録
  - 保存payload・共有URL・ランキングpayload互換維持
  - 未確認OCR値の比較計算混入防止
  - A/B取り違え誤反映防止
  - 低信頼度自動確定禁止
  - OCR失敗時の対象系統のみ手動fallback
  - `docs/current-status.md` と `docs/active-issues.md` の更新
