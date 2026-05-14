# Active Issues（Context Bootstrap）

最終更新: 2026-05-14（PR #116 merge後処理 / Issue #117 作成反映）

## 1. 現在Open Issue
本ドキュメント作成時点で、詳細なOpen Issue一覧は GitHub 側の最新状態を確認して更新する運用とする。

- #117: `/compare` OCR限定導入後のKPI計測と互換性確認（open）
- #115: `/compare` OCR入力補助の最小実装（完了 / A/B別OCR導線・比較前確認ガード追加済み）
- #113: `/compare` OCR入力補助の要件詳細化・監視設計（完了 / 実装未着手で要件固定）
- #111: `/card` OCR限定導入 第2サイクルKPI計測と継続可否判定（完了: 2サイクル連続達成）
- #109: `/card` OCR限定導入後のKPI計測と互換性確認（完了: 条件付き継続判定）
- #107: `/card` OCR入力補助の最小実装（完了 / 限定公開前提の導線追加済み）
- #105: `/card` OCR入力補助の要件詳細化・監視設計（完了）
- #103: `/card` `/compare` OCR展開可否レビュー（完了: 判定=条件付き可）
- OCR関連継続Issue: 精度・UX・運用改善系（個別番号は都度追記）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補
1. #117: `/compare` OCR限定導入後のKPI計測と互換性確認
2. `/compare` OCR限定導入 第2サイクルKPI計測
3. 低スペック端末カテゴリp95短縮の継続検証
4. 展開時の監視条件・ロールバック条件運用Runbook整備
5. fallback率・離脱率の要因分解ログ改善

## 3. 優先順位（暫定）
- P1: #117 `/compare` OCR限定導入後のKPI計測と互換性確認
- P1: A/B取り違え誤反映率、未確定項目残存率、比較前確認離脱率の確認
- P1: payload非混入・共有URL互換・ランキング互換・比較結果正当性の継続確認
- P2: 低スペック端末カテゴリp95短縮の継続
- P2: fallback率・離脱率の要因分解ログ改善
- P3: 展開時の監視条件・ロールバック条件Runbook整備

## 4. Blocker
- Issue #115で `/compare` OCR入力補助の最小実装は完了。
- Issue #117では追加実装を最小限に抑え、KPI計測・互換性確認・継続可否判定に限定する。
- OCRアルゴリズム、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は変更しない。

## 5. Handoff情報
- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/reviews/issue-113-compare-ocr-requirements-and-observability.md` と `docs/logs/issue-115-compare-ocr-minimum-implementation.md` を確認する。
- Issue #117では `/compare` OCR限定導入後のKPI計測と互換性確認を行う。
- 評価画像や個人情報をRepositoryへ保存しない。
