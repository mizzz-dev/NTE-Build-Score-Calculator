# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-22（PR #178 merge後処理 / Issue #179 作成反映）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1として metadata / OGP / canonical / robots / sitemap の最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

正式リリース準備として、公開前チェックリスト、リリースノート案、本番公開前のGo / No-Go判定レポートをRepositoryへ保存済みです。Issue #154で主要機能ページcanonical方針とGo判定レポート記載の不整合は解消済みです。Issue #156で主要機能ページmetadata titleの重複リスクも解消済みです。Issue #158で正式リリース実施可否、公開手順、切り戻し条件、公開後確認ログ仕様を文書化済みです。Issue #160で正式リリース公開実施判断をNo-Goとして記録済みです。Issue #162でNo-Go解除条件を再確認し、No-Go継続を記録済みです。Issue #164で正式リリースGo承認と本番公開条件の証跡保存可否を確認し、No-Go継続を記録済みです。Issue #166で正式リリース承認・公開条件証跡の提出テンプレートを作成済みです。Issue #169でdeploy前Go判定条件とdeploy後確認項目の分離を反映済みです。Issue #171で公開実行前Go判定ログを保存し、No-Go継続を記録済みです。Issue #173フォローアップでも4条件未提出のためNo-Go継続を記録済みです。Issue #175で本番deploy準備手順と公開実行手順を文書化済みです。Issue #177で公開実行Issueテンプレートを整備し、人間承認フロー開始条件を明確化済みです。

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
- Issue #173 として公開実行前Go判定フォローアップを保存し、No-Go継続を記録済み。
- Issue #175 として本番deploy準備手順と公開実行手順を文書化済み。
- Issue #177 として公開実行Issueテンプレートを整備し、人間承認フロー開始条件を明確化済み。

## 3. 直近完了タスク（Issue #177 / PR #178）

Issue #177 / PR #178 で公開実行Issueテンプレートを整備し、人間承認フロー開始条件、deploy前確認項目、deploy後確認項目、役割分担、rollback判定欄を明確化しました。

- 公開実行Issueに必要な記録項目を定義。
- 人間承認フロー開始条件を定義。
- deploy対象環境、対象ブランチ、対象コミットSHA記録欄を定義。
- 人間最終Go承認、役割分担、rollback判定欄を定義。
- Pre-deploy / Post-deploy チェックを分離。
- Issue #175完了後ステータスと次作業記述の混在を解消。

保存先:
- Runbook: `docs/runbooks/issue-177-official-release-execution-issue-template.md`
- 作業ログ: `docs/logs/2026-05-21-issue-177-release-execution-issue-template-and-status-sync.md`
- AIプロンプトログ: `docs/ai-prompts/2026-05-21-issue-177-release-execution-issue-template-and-status-sync.md`

## 4. 現在の次作業（Issue #179）

Issue #179 で、整備済みテンプレートを使って実際の公開実行Issueを起票し、人間Go承認待ち状態をRepository上で明確化します。

目的:
- `docs/runbooks/issue-177-official-release-execution-issue-template.md` を元に公開実行Issueを起票する。
- Go承認前にdeploy実行へ進めないことを明記する。
- 未充足項目を `未確認` として明記する。
- 人間が入力すべき欄を明確にする。
- AIが証跡を推測補完しないルールを明記する。
- deploy前確認項目とdeploy後確認項目を分離する。

## 5. 進行中 / 次フェーズ

- 進行中: Issue #179（公開実行Issue起票と人間Go承認待ち状態の整備）
- 次候補:
  1. 公開実行Issueの起票
  2. 人間Go承認待ち状態の明確化
  3. 条件充足時のdeploy実行
  4. deploy実施ログの記録（実施者・対象コミット・ログURL、公開実行後確認）
  5. post-release実測結果への更新
  6. 商用化前の専門確認（名称・素材・免責文言・収益化導線）
  7. rollback運用監査

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
- 非公開情報の保存

## 7. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/runbooks/issue-177-official-release-execution-issue-template.md`
- `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
- `docs/runbooks/official-release-approval-and-evidence-submission-template.md`（Issue #169反映版）
- `docs/logs/2026-05-21-issue-177-release-execution-issue-template-and-status-sync.md`
- `docs/logs/2026-05-21-issue-175-production-deploy-preparation-and-execution-plan.md`
- `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md`
- `docs/risks/risks.md`
- `docs/active-issues.md`
