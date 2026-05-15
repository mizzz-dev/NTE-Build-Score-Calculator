# Active Issues（Context Bootstrap）

最終更新: 2026-05-15（PR #130 merge後処理 / Issue #131 作成反映）

## 1. 現在Open Issue

- #131: `/compare` 比較ブロック理由に応じて案内文を出し分ける（open）
- #129: `/compare` OCRの未確定項目解消フローのUX文言改善（完了）
- #127: `/compare` OCR正式展開後の監視運用定常化と残リスク改善方針整理（完了）
- #125: `/compare` OCR正式展開可否の最終判定と運用Runbook整備（完了）
- #123: `/compare` OCR正式展開前改善後の第3サイクルKPI計測（完了）
- OCR関連継続Issue: 精度・UX・運用改善系（個別番号は都度追記）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #131: `/compare` 比較ブロック理由に応じた案内文出し分け
2. `image_quality_low` 起因の事前撮影ガイド・再撮影導線改善
3. 条件付き正式展開後の監視運用をRunbook + 監査ログで月次運用へ移行
4. 正式リリース前の品質・SEO・規約整備

## 3. 優先順位（暫定）

- P1: #131 入力エラー系とOCR確認系のブロック理由別案内出し分け
- P1: OCR未使用時の手動比較導線を誤誘導しないこと
- P1: payload非混入・共有URL互換・ランキング互換・比較結果正当性の継続確認
- P2: `image_quality_low` 起因改善
- P2: 条件付き正式展開後の運用Runbook適用と監査ログ蓄積

## 4. Blocker

- Issue #129 / PR #130 は完了済み。
- PR #130のレビューで、入力エラーのみの比較ブロック時にもOCR未確定向けガイドが表示される可能性が指摘された。
- Issue #131では、OCR由来ブロック理由がある場合のみOCR向けガイドを表示する。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `src/features/compare/components/ComparePageContainer.tsx`、`src/features/compare/lib/compareOcr.ts`、`src/features/compare/lib/compareOcr.test.ts` を確認する。
- Issue #131では、入力エラーのみの場合とOCR由来ブロック理由がある場合で案内文を出し分ける。
- 低信頼度候補の自動確定、OCRアルゴリズム変更、保存payload仕様変更は行わない。
- 評価画像や個人情報をRepositoryへ保存しない。
