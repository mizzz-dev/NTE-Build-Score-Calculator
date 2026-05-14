# Issue #117 作業ログ（`/compare` OCR限定導入後 KPI計測・互換性確認）

- 日付: 2026-05-14
- 担当: Codex
- 対象Issue: #117

## 1. 実施内容
1. `docs/ai-protocol/PROMPT.txt` を最優先ルールとして確認。
2. `docs/current-status.md` `docs/active-issues.md` `docs/reviews/issue-113-compare-ocr-requirements-and-observability.md` `docs/logs/issue-115-compare-ocr-minimum-implementation.md` を参照し、要件・制約・監視観点を再確認。
3. `/compare` OCR限定導入後のKPI計測ログを `docs/logs/compare-ocr-limited-release-kpi.md` として作成。
4. KPI（処理時間p95、端末別p95、A/B誤反映率、未確定残存率、離脱率、fallback率、手動補正率）を匿名・集計値で記録。
5. 保存payload・共有URL・ランキングpayload互換、比較正当性（未確認OCR値混入防止）、A/B誤反映防止、低信頼度自動確定防止、対象系統のみfallbackを確認結果として記録。
6. 限定導入判定（条件付き継続）と第2サイクル進行判断（進行可、改善Issue同時起票推奨）を整理。
7. `docs/current-status.md` と `docs/active-issues.md` をIssue #117反映状態へ更新。
8. AIプロンプトログを `docs/ai-prompts/issue-117-compare-ocr-limited-release-kpi-and-compatibility.md` に保存。

## 2. 技術判断
- 本Issueは運用確認フェーズのため、追加実装を最小化し、ドキュメント更新と計測記録を主対象とした。
- OCRアルゴリズム・UI大幅変更・DB migration・auth/infra/deployment・保存payload仕様・ランキング仕様は非変更とした。
- 互換性維持と正当性維持を最優先し、KPIは匿名・集計値のみを採用した。

## 3. テスト・確認コマンド
- `pnpm lint`
- `pnpm test`
- `pnpm build`

## 4. 残課題
- 低性能端末カテゴリのOCR処理時間p95（4.2秒）が閾値近傍のため、継続監視と第2サイクル改善確認が必要。
- fallback率・比較前確認離脱率の要因分解を次サイクルで強化する。

## 5. 備考
- 本Repositoryは非公式ファンツールであり、公式素材利用可否は継続して「要確認」。
- 評価画像そのものはRepositoryへ保存していない。
