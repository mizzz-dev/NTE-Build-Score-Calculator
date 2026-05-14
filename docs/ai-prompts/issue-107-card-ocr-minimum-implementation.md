# AIプロンプトログ: Issue #107 `/card` OCR入力補助 最小実装

- 日付: 2026-05-14
- モデル: Codex
- 対象Issue: #107

## 入力プロンプト要約
- `docs/ai-protocol/PROMPT.txt` を最優先遵守。
- Issue #105 / PR #106で確定した要件・監視設計を前提に、`/card` に限定公開向けOCR入力補助の最小実装を追加。
- 保存payload・共有URL・ランキングpayload仕様は変更しない。
- OCRは一時下書きとして扱い、カード生成前に手動確認を必須化。
- `/compare` は対象外。

## 出力方針
- UI導線追加は `/card` に限定。
- OCRメタ情報非混入をテストで担保。
- current-status / active-issues / 作業ログを更新。
