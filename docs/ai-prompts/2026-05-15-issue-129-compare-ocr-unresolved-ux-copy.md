# AIプロンプトログ: Issue #129 `/compare` OCR 未確定項目解消フローUX文言改善

- 日付: 2026-05-15
- 対象Issue: #129
- 目的: `unresolved_items_remaining` 起因の比較前確認離脱を下げるため、未確定項目解消フローのUX文言を改善する。

## 指示要約
1. `docs/ai-protocol/PROMPT.txt` を最優先で遵守。
2. OCRアルゴリズム・信頼度計算を変更しない。
3. 未確定0件まで比較実行をブロックする既存ガードを維持。
4. 未確定残件数、A/B対象、確認順ガイドが分かる文言へ改善。
5. payload/共有URL/ランキングへのOCRメタ非混入方針を維持。
6. 必要テスト実行、`docs/current-status.md` `docs/active-issues.md` `docs/logs` `docs/ai-prompts` を更新。

## 実施結果サマリ
- `/compare` 比較前ブロックパネルに未確定残件（合計/A/B）と確認順ガイドを追加。
- ガード理由文言をA/B対象と残件が明確になるよう更新。
- 単体テスト期待文言を更新し、挙動維持を確認。
