# AI Prompt Log（Issue #121）

- 日付: 2026-05-14
- 対象Issue: #121
- 目的: `/compare` OCR正式展開前に低性能端末向け待機/案内導線、fallback要因分類、比較前確認離脱要因分類を最小差分で整備する

## 実行プロンプト要約

1. `docs/ai-protocol/PROMPT.txt` を最優先遵守する。
2. OCRアルゴリズム・DB・auth・infra・deployment・保存payload仕様・ランキング仕様は変更しない。
3. 低性能端末p95、fallback率、比較前確認離脱率、手動補正率の改善対象を整理する。
4. 待機/案内文言を最小変更し、途中離脱を抑える。
5. fallback要因分類、比較前確認離脱要因分類の記録方針を追加する。
6. 記録は匿名・集計値前提とし、画像・個人情報・アカウント情報を保存しない。
7. `docs/current-status.md`、`docs/active-issues.md`、`docs/logs/` を更新する。
