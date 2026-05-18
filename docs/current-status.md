# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-18（Issue #160 No-Go判断とpost-releaseログ記録）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1として metadata / OGP / canonical / robots / sitemap の最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

正式リリース準備として、公開前チェックリスト、リリースノート案、本番公開前のGo / No-Go判定レポートをRepositoryへ保存済みです。Issue #154で主要機能ページcanonical方針とGo判定レポート記載の不整合は解消済みです。Issue #156で主要機能ページmetadata titleのサイト名サフィックス重複リスクも解消済みです。Issue #158で正式リリース実施可否、公開手順、切り戻し条件、公開後確認ログ仕様を文書化済みです。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。
- 月次監査Runbookと月次監査ログテンプレートを整備済み。
- 利用規約・免責・プライバシー方針ページを追加済み。
- Issue #141 として metadata / OGP / Twitter / canonical / robots 方針の公開前最小整備を実施済み。
- Issue #143 として canonicalページ別方針見直しとmetadata noindex反映を実施済み。
- Issue #145 として sitemap実装要否を確定し、`src/app/sitemap.ts` を追加済み。
- Issue #148 として商用利用前の権利・法務確認観点を整理済み。
- Issue #150 として正式リリース前チェックリストと正式リリース候補ノートを作成済み。
- Issue #152 として本番URL・環境変数・Go/No-Go判定を記録済み。
- Issue #154 として主要機能ページのcanonical方針とGo判定レポート記載を整合済み。
- Issue #156 として主要機能ページmetadata titleの重複リスクを解消済み。
- Issue #158 として正式リリース実施可否判定、公開手順、切り戻し条件、公開後確認ログ仕様を文書化済み。

## 3. 直近完了タスク（Issue #158 / PR #159）

Issue #158 / PR #159 で正式リリース実施可否と公開手順を確定しました。

実施内容:
- `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md` を追加。
- 判定結論を Conditional Go として記録。
- Issue #152 Go（条件付き）判定の有効性をIssue #154 / #156対応後の状態で再確認。
- 未解決リスク、専門確認事項の再分類、本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` の確認観点を記録。
- 公開手順、切り戻し条件、公開後確認ログ仕様を文書化。
- 本PRでは実際の公開作業や環境変数変更は実施していない。

## 4. 現在の次作業（Issue #160）

Issue #160で正式リリース公開実施判断ログを作成し、現時点ではNo-Go判断を記録済みです。

記録結果（2026-05-18 UTC）:
- 人間の最終Go承認: 未記録
- 本番deploy: 未実施
- 判定: No-Go（Conditional Go条件未充足）
- 再開条件: 人間Go承認、環境変数証跡、deploy実施ログURLの保存
- post-release確認ログ: `docs/logs/2026-05-18-issue-160-post-release-check.md`


## 5. 進行中 / 次フェーズ

- 進行中: Issue #160（No-Go解除待ち / 人間Go承認待ち）
- 次候補:
  1. 人間最終Go承認の記録（承認者・時刻・URL）
  2. deploy実施ログの記録（実施者・対象コミット・ログURL）
  3. post-release実測結果への更新
  4. 商用化前の専門確認（名称・素材・免責文言・収益化導線）
  5. rollback運用監査

## 6. 注意すべき変更禁止領域

本フェーズでは以下を変更しない。

- OCRアルゴリズム
- OCR信頼度計算
- DB migration
- auth / infra / deployment 設定
- 保存payload仕様
- 共有URL仕様
- ランキング仕様
- 画像保存方式
- 外部OCR API連携
- 低信頼度候補の自動確定
- 法務判断の確定
- 公式素材・ゲーム画像の追加

## 7. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md`
- `docs/reports/2026-05-18-issue-152-go-no-go-final-readiness.md`
- `docs/release-checklist.md`
- `docs/release-notes/2026-05-18-official-release-candidate.md`
- `docs/logs/2026-05-18-issue-158-release-decision-and-deploy-plan.md`
- `docs/logs/2026-05-18-issue-156-metadata-title-dedup.md`
- `docs/logs/2026-05-18-issue-154-canonical-policy-alignment.md`
- `docs/reports/2026-05-17-issue-148-commercial-legal-readiness-review.md`
- `docs/risks/risks.md`
- `docs/active-issues.md`
