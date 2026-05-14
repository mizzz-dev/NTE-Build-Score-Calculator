# Active Issues（Context Bootstrap）

最終更新: 2026-05-14（PR #106 merge後処理 / Issue #107 作成反映）

## 1. 現在Open Issue
本ドキュメント作成時点で、詳細なOpen Issue一覧は GitHub 側の最新状態を確認して更新する運用とする。

- #107: `/card` OCR入力補助の最小実装（open）
- #105: `/card` OCR入力補助の要件詳細化・監視設計（完了 / 要件詳細化ドキュメント作成済み、実装未着手）
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
1. #107: `/card` OCR入力補助の最小実装（限定公開）
2. `/card` OCR入力補助の限定導入KPI計測
3. `/compare` OCR入力補助の要件詳細化（`/card` 安定確認後）
4. 低スペック端末カテゴリp95短縮の継続検証（4.1秒→4.0秒以内）
5. 展開時の監視条件・ロールバック条件運用Runbook整備

## 3. 優先順位（暫定）
- P1: #107 `/card` OCR入力補助の最小実装（限定公開）
- P1: payload非混入・共有URL互換・ランキング互換の回帰確認
- P1: 低スペック端末カテゴリp95短縮の継続
- P2: `/card` 限定導入KPI計測
- P3: `/compare` 要件詳細化と段階展開監視設計

## 4. Blocker
- 連続2サイクル達成（第3: p95=3.9秒、第4: p95=3.8秒）を確認し、Issue #103で展開可否レビューを完了。
- 判定は「条件付き可」。低スペック端末カテゴリ（p95=4.1秒）の継続監視と段階展開条件が前提。
- Issue #105で `/card` 要件・監視・ロールバック・payload非混入回帰観点は固定済み。
- Issue #107では `/compare` に影響させず、`/card` 最小実装に限定する。

## 5. Handoff情報
- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/ocr-requirements.md` の「対象範囲」「非対象」「payload非混入方針」を確認する。
- `/card` OCR展開はIssue #107で最小実装に進む。`/compare` は対象外。
- `docs/reviews/issue-105-card-ocr-requirements-and-observability.md` を実装前の正本として扱う。
- 実装前に「今回Issueで変更してよい層（UI/adapter/mapper等）」を明文化し、禁止領域を再確認する。
