# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-20（PR #172 merge後処理 / Issue #173 作成反映）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1として metadata / OGP / canonical / robots / sitemap の最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

正式リリース準備として、公開前チェックリスト、リリースノート案、本番公開前のGo / No-Go判定レポートをRepositoryへ保存済みです。Issue #154で主要機能ページcanonical方針とGo判定レポート記載の不整合は解消済みです。Issue #156で主要機能ページmetadata titleのサイト名サフィックス重複リスクも解消済みです。Issue #158で正式リリース実施可否、公開手順、切り戻し条件、公開後確認ログ仕様を文書化済みです。Issue #160で正式リリース公開実施判断をNo-Goとして記録済みです。Issue #162でNo-Go解除条件を再確認し、No-Go継続を記録済みです。Issue #164で正式リリースGo承認と本番公開条件の証跡保存可否を確認し、No-Go継続を記録済みです。Issue #166で正式リリース承認・公開条件証跡の提出テンプレートを作成済みです。Issue #169でdeploy前Go判定条件とdeploy後確認項目の分離を反映済みです。Issue #171で公開実行前Go判定ログを保存し、No-Go継続を記録済みです。

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
- Issue #160 として正式リリース公開実施判断をNo-Goとして記録済み。
- Issue #162 としてNo-Go解除条件を再確認し、No-Go継続を記録済み。
- Issue #164 として正式リリースGo承認と本番公開条件の証跡保存可否を確認し、No-Go継続を記録済み。
- Issue #166 として正式リリース承認・公開条件証跡の提出テンプレートを作成済み。
- Issue #169 として承認・証跡提出テンプレートのdeploy前後条件分離を反映済み。
- Issue #171 として公開実行前Go判定ログを保存し、No-Go継続を記録済み。

## 3. 直近完了タスク（Issue #171 / PR #172）

Issue #171 / PR #172 で公開実行前Go判定ログを記録しました。

判定結果:
- 公開実行前Go判定: No-Go継続
- 不足項目:
  - 人間最終Go承認
  - 本番公開URL一致証跡
  - 検索公開設定証跡
  - rollback要否の人間判定記録
- deploy実行ログURLは公開実行後確認項目として扱い、公開実行前Go判定条件には含めていません。
- 作業ログ: `docs/logs/2026-05-20-issue-171-human-go-approval-and-prod-evidence.md`
- AIプロンプトログ: `docs/ai-prompts/2026-05-20-issue-171-human-go-approval-and-prod-evidence.md`

## 4. 現在の次作業（Issue #173）

Issue #173 で人間担当者が公開実行前Go承認と本番公開条件証跡を提出します。

目的:
- 人間最終Go承認を提出する。
- 本番公開URL一致証跡を提出する。
- 検索公開設定証跡を提出する。
- rollback要否の人間判定記録を提出する。
- 4条件が揃った場合は公開実行前Go判定をGoとして公開実行Issueへ進む。
- 条件不足時はNo-Go継続として不足項目と再開条件を保存する。

## 5. 進行中 / 次フェーズ

- 進行中: Issue #173（人間対応: 公開実行前Go承認と本番公開条件証跡の提出）
- 次候補:
  1. 公開実行前Go判定
  2. 条件充足時の公開実行Issue作成
  3. deploy実施ログの記録（実施者・対象コミット・ログURL、公開実行後確認）
  4. post-release実測結果への更新
  5. 商用化前の専門確認（名称・素材・免責文言・収益化導線）
  6. rollback運用監査

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
- 機微情報やローカル環境ファイルの保存

## 7. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/runbooks/official-release-approval-and-evidence-submission-template.md`（Issue #169反映版）
- `docs/logs/2026-05-20-issue-171-human-go-approval-and-prod-evidence.md`
- `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md`
- `docs/logs/2026-05-20-issue-169-deploy-gate-separation.md`
- `docs/logs/2026-05-19-issue-166-release-approval-and-evidence-template.md`
- `docs/logs/2026-05-18-issue-164-go-approval-and-production-evidence-check.md`
- `docs/logs/2026-05-18-issue-162-no-go-recheck.md`
- `docs/logs/2026-05-18-issue-160-post-release-check.md`
- `docs/risks/risks.md`
- `docs/active-issues.md`
