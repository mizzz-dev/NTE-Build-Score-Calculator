# AIプロンプトログ: Issue #133 image_quality_low UX改善

- 日付: 2026-05-15
- 対象Issue: #133

## 入力要約

- `docs/ai-protocol/PROMPT.txt` を最優先遵守。
- `image_quality_low` 起因のOCR失敗/fallback/手動補正負荷低減のため、OCR前後の案内文と再撮影導線を改善。
- OCRアルゴリズム、信頼度計算、保存payload仕様は変更しない。
- `/score` `/card` `/compare` 導線に最小差分で反映。

## 実施方針

1. 共通OCRパネルの読取前チェック文言を要件4点に合わせて更新。
2. OCR失敗表示に「再撮影」「手動入力」両導線を明記。
3. `/card` `/compare` の失敗補足文言を共通方針へ整合。
4. 既存フォーム値保持方針と手動fallback導線維持を確認。
5. ドキュメント（current-status / active-issues / logs）を更新。
