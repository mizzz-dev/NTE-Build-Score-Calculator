# Active Issues（Context Bootstrap）

最終更新: 2026-05-14（PR #118 merge後処理 / Issue #119 作成反映）

## 1. 現在Open Issue
本ドキュメント作成時点で、詳細なOpen Issue一覧は GitHub 側の最新状態を確認して更新する運用とする。

- #119: `/compare` OCR限定導入 第2サイクルKPI計測（open）
- #117: `/compare` OCR限定導入後のKPI計測と互換性確認（完了: 条件付き継続判定 / 第2サイクル進行可）
- #115: `/compare` OCR入力補助の最小実装（完了 / A/B別OCR導線・比較前確認ガード追加済み）
- #113: `/compare` OCR入力補助の要件詳細化・監視設計（完了 / 実装未着手で要件固定）
- #111: `/card` OCR限定導入 第2サイクルKPI計測と継続可否判定（完了: 2サイクル連続達成）
- OCR関連継続Issue: 精度・UX・運用改善系（個別番号は都度追記）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補
1. #119: `/compare` OCR限定導入 第2サイクルKPI計測
2. 低スペック端末カテゴリp95短縮の継続検証
3. 展開時の監視条件・ロールバック条件運用Runbook整備
4. fallback率・離脱率の要因分解ログ改善
5. 正式展開前の改善Issue要否判断

## 3. 優先順位（暫定）
- P1: #119 `/compare` OCR限定導入 第2サイクルKPI計測
- P1: 低スペック端末カテゴリp95短縮の継続
- P1: payload非混入・共有URL互換・ランキング互換・比較結果正当性の継続確認
- P2: fallback率・離脱率の要因分解ログ改善
- P2: 展開時の監視条件・ロールバック条件Runbook整備

## 4. Blocker
- `/compare` OCR最小実装（Issue #115）と第1サイクル検証（Issue #117）は完了。
- 次は第2サイクル計測で低スペック端末p95・fallback率・離脱率の改善トレンドを確認する。
- OCRアルゴリズム、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報
- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/logs/compare-ocr-limited-release-kpi.md` と `docs/reviews/issue-113-compare-ocr-requirements-and-observability.md` を確認する。
- Issue #119では `/compare` OCR限定導入 第2サイクルKPI計測を行う。
- 評価画像や個人情報をRepositoryへ保存しない。
