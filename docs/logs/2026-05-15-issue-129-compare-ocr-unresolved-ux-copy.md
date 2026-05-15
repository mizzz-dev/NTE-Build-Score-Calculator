# Issue #129 作業ログ（/compare OCR 未確定項目解消フローUX文言改善）

- 作成日: 2026-05-15
- 対象Issue: #129
- 関連Issue/PR: #127, #128

## 1. 実施概要
- `/compare` OCRの比較前確認ガード文言を改善し、未確定残件数（合計/A/B）、A/B対象、確認順ガイドを明示した。
- 既存ガード（未確定0件まで比較実行をブロック）を維持した。
- 低信頼度候補の自動確定は行わない既存方針を維持した。

## 2. 実施内容
1. `canRunCompareWithOcrGuard` の理由文言を、未確定残件とA/B対象が読み取りやすい表現へ更新。
2. `/compare` 画面のブロックパネルに以下を追加。
   - 未確定残件（合計 / A / B）
   - 確認順ガイド（A解消→B解消→確認済みチェック）
3. 既存単体テストの期待文言を更新し、ガード挙動維持を確認。

## 3. 非変更確認（禁止領域）
- OCRアルゴリズム: 変更なし
- OCR信頼度計算: 変更なし
- DB / auth / infra / deployment: 変更なし
- 保存payload仕様 / 共有URL仕様 / ランキング仕様: 変更なし
- 画像保存・外部OCR API連携: 追加なし

## 4. テスト
- `pnpm lint` を実行したが、corepack経由のpnpm取得時にProxy 403で失敗
- `pnpm test` を実行したが、corepack経由のpnpm取得時にProxy 403で失敗
- `pnpm build` を実行したが、corepack経由のpnpm取得時にProxy 403で失敗

## 5. security/privacy/license/release/support 観点
- security: 認証・鍵管理・外部通信設定変更なし。
- privacy: OCRメタを永続payloadへ混入させる変更なし。画像保存追加なし。
- license: 依存追加なし。
- release: 既存比較前ガードのままUX文言改善のみ。
- support: 未確定残件・確認順ガイド明示により問い合わせ時の説明容易性が向上。

## 6. ロールバック
- 本変更は文言と表示補助のため、必要時は `src/features/compare/components/ComparePageContainer.tsx` と `src/features/compare/lib/compareOcr.ts` の該当文言をPR #128相当へ戻すことでロールバック可能。
