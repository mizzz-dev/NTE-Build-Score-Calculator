# Active Issues（Context Bootstrap）

最終更新: 2026-05-15（Issue #125 正式展開可否最終判定反映）

## 1. 現在Open Issue
本ドキュメント作成時点で、詳細なOpen Issue一覧は GitHub 側の最新状態を確認して更新する運用とする。

- #125: `/compare` OCR正式展開可否の最終判定と運用Runbook整備（完了: 条件付き正式展開可判定・監視/rollback手順確定）
- #123: `/compare` OCR正式展開前改善後の第3サイクルKPI計測（完了: 重点KPI改善・互換維持確認）
- #121: `/compare` OCR正式展開前の低性能端末p95短縮とfallback・離脱要因分解（完了 / UX案内改善・要因分類方針追加済み）
- #119: `/compare` OCR限定導入 第2サイクルKPI計測（完了: 2サイクル連続で条件付き継続達成）
- #117: `/compare` OCR限定導入後のKPI計測と互換性確認（完了: 条件付き継続判定 / 第2サイクル進行可）
- #115: `/compare` OCR入力補助の最小実装（完了 / A/B別OCR導線・比較前確認ガード追加済み）
- #113: `/compare` OCR入力補助の要件詳細化・監視設計（完了 / 実装未着手で要件固定）
- OCR関連継続Issue: 精度・UX・運用改善系（個別番号は都度追記）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補
1. `unresolved_items_remaining` / `image_quality_low` 起因の追加改善Issue検討
2. 条件付き正式展開後の監視運用（しきい値超過時対応の定常化）
3. 正式リリース前の品質・SEO・規約整備

## 3. 優先順位（暫定）
- P1: payload非混入・共有URL互換・ランキング互換・比較結果正当性の継続確認
- P1: 重点KPI（低性能端末p95 / fallback率 / 比較前確認離脱率）の監視継続
- P1: `unresolved_items_remaining` / `image_quality_low` 起因改善
- P2: 条件付き正式展開後の運用Runbook適用と監査ログ蓄積

## 4. Blocker
- `/compare` OCR最小実装（Issue #115）、第1〜第3サイクル検証（Issue #117 / #119 / #123）、正式展開前改善（Issue #121）、正式展開可否最終判定（Issue #125）は完了。
- 次は条件付き正式展開後の監視運用と追加改善Issue管理を進める。
- OCRアルゴリズム、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報
- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/logs/compare-ocr-limited-release-kpi.md`、`docs/logs/compare-ocr-limited-release-kpi-cycle-2.md`、`docs/logs/issue-121-compare-ocr-pre-release-ux-and-observability.md` を確認する。
- Issue #123では改善後の第3サイクルKPI計測を行う。
- 評価画像や個人情報をRepositoryへ保存しない。
