# Issue #131 作業ログ（/compare 比較ブロック理由の分類とOCRガイド出し分け）

- 作成日: 2026-05-15
- 対象Issue: #131
- 関連Issue/PR: #129, #130

## 1. 実施概要
- 比較ブロック理由を「入力エラー系」と「OCR確認系」に分類した。
- OCR由来のブロック理由がある場合のみ、未確定残件数と確認順ガイドを表示するよう `/compare` UIを修正した。
- 入力エラーのみでブロックされるケースでは、OCR未確定向けガイドを表示しないようにした。

## 2. 実施内容
1. `canRunCompareWithOcrGuard` の返却値を拡張し、理由詳細（category: input/ocr）と `hasOcrBlockingReason` を追加。
2. `ComparePageContainer` で `hasOcrBlockingReason` を利用し、OCRガイド表示を条件分岐。
3. `compareOcr.test.ts` に、入力エラーのみ時とOCR理由含有時の分類判定テストを追加。

## 3. 非変更確認（禁止領域）
- OCRアルゴリズム: 変更なし
- OCR信頼度計算: 変更なし
- DB / auth / infra / deployment: 変更なし
- 保存payload仕様 / 共有URL仕様 / ランキング仕様: 変更なし
- 低信頼度候補の自動確定: 追加なし

## 4. テスト
- `pnpm lint`
- `pnpm test`
- `pnpm build`

## 5. security/privacy/license/release/support 観点
- security: 機密情報・認証・権限系の変更なし。
- privacy: OCR画像保存やOCRメタの永続payload混入を追加していない。
- license: 依存追加なし。
- release: 比較ブロック文言の条件分岐のみで、比較計算ロジックは変更なし。
- support: 入力エラー時の誤誘導を抑え、問い合わせ一次切り分け性を改善。

## 6. ロールバック
- `src/features/compare/lib/compareOcr.ts` と `src/features/compare/components/ComparePageContainer.tsx` をPR #130相当の実装へ戻すことでロールバック可能。
