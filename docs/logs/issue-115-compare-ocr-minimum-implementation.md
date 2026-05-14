# Issue #115 作業ログ（/compare OCR入力補助 最小実装）

- 日付: 2026-05-14
- 対象: Issue #115

## 変更可能層 / 禁止領域
- 変更可能層: `/compare` UI層、`src/features/compare/lib` の入力ガード層、既存OCR UI再利用層、テスト層
- 禁止領域: OCRアルゴリズム本体、DB migration、auth/infra/deploy、保存payload仕様、ランキング仕様

## 実施内容
- `/compare` にA/B別OCR入力補助パネルを追加。
- OCR下書き状態を A/B で分離管理し、片系統のみ反映可能に制約。
- 比較実行前ガードを導入し、A/B確認済み・未確定0件・OCR失敗状態解消を必須化。
- OCR失敗時は対象系統のみ失敗表示し、手動入力継続導線を維持。
- ガードロジックの単体テストを追加。

## 実行コマンド
- pnpm lint
- pnpm test
- pnpm build
