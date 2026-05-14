# Issue #113 作業ログ（`/compare` OCR入力補助 要件詳細化）

- 作成日: 2026-05-14
- 対象Issue: #113
- 方針: 要件定義のみ（実装なし）

## 1. 実施内容

1. `docs/ai-protocol/PROMPT.txt` を最優先ルールとして確認。
2. `docs/current-status.md` `docs/active-issues.md` `docs/ocr-requirements.md` と関連レビュー/ログを読込。
3. `/compare` OCR入力補助の要件詳細化ドキュメントを新規作成。
4. `docs/current-status.md` に Issue #113 完了結果を追記。
5. `docs/active-issues.md` に Issue #113 完了反映と次Issue候補更新を追記。

## 2. 技術判断サマリ

- `/compare` ではA/B 2系統入力の誤反映防止を最優先し、下書き状態を系統分離する方針を採用。
- 比較計算への未確認OCR値混入を防ぐため、比較実行前ガード条件（A/B確認済み・未確定0件）を必須化。
- payload/共有URL/ランキングへのOCRメタ非混入は `/score` `/card` 同等の絶対条件として固定。
- KPIは `/card` で実績のある指標に、`/compare` 固有の2系統誤反映率を追加して監視強化。

## 3. 実行コマンド結果

- `pnpm lint`: 実行失敗（環境要因: corepack経由のpnpm取得時にProxy 403）
- `pnpm test`: 実行失敗（環境要因: corepack経由のpnpm取得時にProxy 403）
- `pnpm build`: 実行失敗（環境要因: corepack経由のpnpm取得時にProxy 403）

## 4. 残課題

- `/compare` 2系統誤反映率の許容閾値を最終合意する必要あり。
- 比較実行ブロック時の具体文言・UI粒度は次実装Issueで固定する必要あり。
- 限定公開対象（内部/一部公開）の運用定義が未確定。
