# Active Issues（Context Bootstrap）

最終更新: 2026-05-15（PR #128 merge後処理 / Issue #129 作成反映）

## 1. 現在Open Issue
本ドキュメント作成時点で、詳細なOpen Issue一覧は GitHub 側の最新状態を確認して更新する運用とする。

- #129: `/compare` OCRの未確定項目解消フローのUX文言改善（open）
- #127: `/compare` OCR正式展開後の監視運用定常化と残リスク改善方針整理（完了: 監査ログ項目・改善Issueテンプレ方針・次Issue候補を整理）
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
1. #129: `unresolved_items_remaining` 起因改善として `/compare` OCRの未確定項目解消フローのUX文言改善
2. `image_quality_low` 起因の事前撮影ガイド・再撮影導線改善
3. 条件付き正式展開後の監視運用をRunbook + 監査ログで月次運用へ移行
4. 正式リリース前の品質・SEO・規約整備

## 3. 優先順位（暫定）
- P1: #129 未確定項目解消フローのUX文言改善
- P1: payload非混入・共有URL互換・ランキング互換・比較結果正当性の継続確認
- P1: 重点KPI（低性能端末p95 / fallback率 / 比較前確認離脱率）の監視継続
- P2: `image_quality_low` 起因改善
- P2: 条件付き正式展開後の運用Runbook適用と監査ログ蓄積

## 4. Blocker
- `/compare` OCR最小実装（Issue #115）、第1〜第3サイクル検証（Issue #117 / #119 / #123）、正式展開前改善（Issue #121）、正式展開可否最終判定（Issue #125）、監視運用定常化方針整理（Issue #127）は完了。
- 次はIssue #127で分離された残リスク改善のうち、比較前確認離脱に直結しやすい `unresolved_items_remaining` 起因改善としてIssue #129を進める。
- OCRアルゴリズム、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 5. Handoff情報
- まず `docs/current-status.md` と `docs/architecture/system-overview.md` を読む。
- 次に `docs/runbooks/compare-ocr-release-runbook.md` と `docs/logs/issue-127-compare-ocr-post-release-monitoring-operations.md` を確認する。
- Issue #129では `/compare` OCRの未確定項目解消フローのUX文言改善を行う。
- 低信頼度候補の自動確定、OCRアルゴリズム変更、保存payload仕様変更は行わない。
- 評価画像や個人情報をRepositoryへ保存しない。
