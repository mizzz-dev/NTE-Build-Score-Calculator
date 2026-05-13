# Issue #85 用AIプロンプト（/score OCR品質評価 初回ログ）

## 目的
PR #82 で定義したOCR品質評価運用と、PR #84 で改善したOCR失敗時UXを前提に、`/score` OCR入力補助MVPの初回品質評価ログを作成する。誤認識率・手動補正率・処理時間・fallback率・低信頼度候補の手動補正誘導率を集計し、次改善Issueへつなげる。

## 前提・制約
- 前提PR: #66 #68 #70 #72 #74 #76 #78 #80 #82 #84
- OCRアルゴリズム変更を行わない。
- UI実装変更を行わない。
- 画像をRepositoryへ保存しない。
- `/card` `/compare` へ適用しない。
- 外部OCR API連携を行わない。
- DB migrationを追加しない。
- 保存payload仕様を変更しない。

## 実施タスク
1. `docs/reports/ocr-quality-evaluation.md` のKPI定義に沿って初回集計を作成する。
2. `docs/logs/ocr-quality-evaluation-initial.md` を新規作成する。
3. サンプルカテゴリ別（端末/解像度/背景/言語/画質劣化）の結果を整理する。
4. 失敗分類（OCR読み取り失敗/マッピング失敗/UI誘導不足/端末性能問題）を件数または割合で記録する。
5. 改善候補を優先順位（P1/P2/P3）付きで整理する。
6. `docs/current-status.md` `docs/active-issues.md` `docs/risks/risks.md` を必要更新する。
7. 作業ログをRepositoryへ保存する。
