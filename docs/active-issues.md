# Active Issues（Context Bootstrap）

最終更新: 2026-05-14（Issue #113 `/compare` OCR要件詳細化反映）

## 1. 現在Open Issue

- #115: `/compare` OCR入力補助の最小実装（進行中: 限定公開前提の最小導線追加と回帰確認）

本ドキュメント作成時点で、詳細なOpen Issue一覧は GitHub 側の最新状態を確認して更新する運用とする。

- #113: `/compare` OCR入力補助の要件詳細化・監視設計（完了 / 実装未着手で要件固定）
- #111: `/card` OCR限定導入 第2サイクルKPI計測と継続可否判定（完了: 2サイクル連続達成）
- #109: `/card` OCR限定導入後のKPI計測と互換性確認（完了: 条件付き継続判定）
- #107: `/card` OCR入力補助の最小実装（完了 / 限定公開前提の導線追加済み）
- #105: `/card` OCR入力補助の要件詳細化・監視設計（完了 / 要件詳細化ドキュメント作成済み）
- #103: `/card` `/compare` OCR展開可否レビュー（完了: 判定=条件付き可、実装は未着手）
- #101: `/score` OCR品質評価 第4サイクル実測ログ作成・連続達成判定（完了）
- #99: `/score` OCR品質評価 第3サイクル実測ログ作成（完了・整合性再確認済み）
- #95: `/score` OCR品質評価 第2サイクル実測ログ作成（完了）
- #85: `/score` OCR品質評価 初回運用ログ作成（完了）
- #83: `/score` OCR失敗時UX改善と手動補正支援（完了・追補反映済み）
- #81: `/score` OCR品質評価運用定義（完了）
- #79: Repository Memory / Context Bootstrap 正本ドキュメント整備（完了）
- OCR関連継続Issue: 精度・UX・運用改善系（個別番号は都度追記）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補
1. `/compare` OCR入力補助の最小実装Issue化（Issue #113要件に基づく限定公開スコープ）
2. 低スペック端末カテゴリp95短縮の継続検証
3. 展開時の監視条件・ロールバック条件運用Runbook整備
4. fallback率・離脱率の要因分解ログ改善

## 3. 優先順位（暫定）
- P1: `/compare` OCR最小実装（Issue #113要件準拠）
- P1: payload非混入・共有URL互換・ランキング互換の継続確認
- P1: 低スペック端末カテゴリp95短縮の継続
- P2: fallback率・離脱率の要因分解ログ改善
- P3: 展開時の監視条件・ロールバック条件Runbook整備

## 4. Blocker
- 連続2サイクル達成（第3: p95=3.9秒、第4: p95=3.8秒）を確認し、Issue #103で展開可否レビューを完了。
- 判定は「条件付き可」。低スペック端末カテゴリの継続監視と段階展開条件が前提。
- Issue #105で `/card` 要件・監視・ロールバック・payload非混入回帰観点は固定済み。
- Issue #107で `/card` 最小実装は完了。
- Issue #109では `/compare` に影響させず、`/card` 限定導入後のKPI計測と互換性確認に限定する。

## 5. Handoff情報
- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/ocr-requirements.md` の「対象範囲」「非対象」「payload非混入方針」を確認する。
- `/card` OCR展開はIssue #107で最小実装済み。Issue #109ではKPI計測・互換性確認を行う。
- `docs/reviews/issue-105-card-ocr-requirements-and-observability.md` と `docs/logs/issue-107-card-ocr-minimum-implementation.md` を正本として扱う。
- `/compare` はIssue #109の結果を踏まえて要件詳細化へ進めるか判断する。
