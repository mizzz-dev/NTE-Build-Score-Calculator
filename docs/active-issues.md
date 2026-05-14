# Active Issues（Context Bootstrap）

最終更新: 2026-05-14（PR #120 merge後処理 / Issue #121 作成反映）

## 1. 現在Open Issue
本ドキュメント作成時点で、詳細なOpen Issue一覧は GitHub 側の最新状態を確認して更新する運用とする。

- #121: `/compare` OCR正式展開前の低性能端末p95短縮とfallback・離脱要因分解（open）
- #119: `/compare` OCR限定導入 第2サイクルKPI計測（完了: 2サイクル連続で条件付き継続達成）
- #117: `/compare` OCR限定導入後のKPI計測と互換性確認（完了: 条件付き継続判定 / 第2サイクル進行可）
- #115: `/compare` OCR入力補助の最小実装（完了 / A/B別OCR導線・比較前確認ガード追加済み）
- #113: `/compare` OCR入力補助の要件詳細化・監視設計（完了 / 実装未着手で要件固定）
- #111: `/card` OCR限定導入 第2サイクルKPI計測と継続可否判定（完了: 2サイクル連続達成）
- OCR関連継続Issue: 精度・UX・運用改善系（個別番号は都度追記）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補
1. #121: `/compare` OCR正式展開前の低性能端末p95短縮とfallback・離脱要因分解
2. `/compare` OCR正式展開可否の最終判断
3. 展開時の監視条件・ロールバック条件運用Runbook整備
4. fallback率・離脱率の要因分解ログ改善の継続

## 3. 優先順位（暫定）
- P1: #121 低性能端末カテゴリp95短縮の継続
- P1: #121 fallback率・比較前確認離脱率の要因分解
- P1: payload非混入・共有URL互換・ランキング互換・比較結果正当性の継続確認
- P2: 正式展開可否の最終判断
- P2: 展開時の監視条件・ロールバック条件Runbook整備

## 4. Blocker
- `/compare` OCR最小実装（Issue #115）と第1・第2サイクル検証（Issue #117 / #119）は完了。
- 2サイクル連続で条件付き継続条件は達成済み。
- 正式展開前に、低性能端末p95短縮とfallback/離脱要因分解を先行する。
- OCRアルゴリズム、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報
- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/logs/compare-ocr-limited-release-kpi.md` と `docs/logs/compare-ocr-limited-release-kpi-cycle-2.md` を確認する。
- Issue #121では正式展開前改善として、低性能端末p95短縮とfallback/離脱要因分解を扱う。
- 評価画像や個人情報をRepositoryへ保存しない。
