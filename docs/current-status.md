# 現在ステータス（Context Bootstrap）

最終更新: 2026-07-23（Issue #191 Gate A品質確認Workflow追加）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1として metadata / OGP / canonical / robots / sitemap の最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

正式リリース準備では、公開前チェックリスト、リリースノート案、Go / No-Go判定、公開手順、rollback条件、証跡提出テンプレート、公開実行Issue記録をRepositoryへ保存済みです。

Issue #187 / PR #188で、初回本番deploy前の **Gate A: Deploy-Go** と、deploy後の公開継続判断である **Gate B: Release-Go** を分離しました。

Issue #189 / PR #190では、GitHub上で確認できる一次情報をGate Aへ同期し、PR headの品質結果とdeploy対象merge commitの品質結果を区別しました。PR #190は承認レビューを必須とせず、CI成功後に`main`へマージ済みです。

Issue #191では、deploy対象コミットに対するlint・test・buildを再実行し、対象SHAと結果をGitHub Actions Summaryへ残す`release-preflight` Workflowを追加します。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。
- 月次監査Runbookと月次監査ログテンプレートを整備済み。
- 利用規約・免責・プライバシー方針ページを追加済み。
- metadata / OGP / canonical / robots / sitemap の公開前整備を実施済み。
- 商用利用前の権利・法務確認観点を整理済み（最終判断は要確認）。
- 正式リリース前チェックリスト、候補ノート、公開手順、rollback方針を文書化済み。
- 公開実行Issueテンプレート、証跡提出テンプレート、公開実行Issue記録を整備済み。
- Issue #187 / PR #188でDeploy-GoとRelease-Goを分離済み。
- Issue #189 / PR #190でGate Aの機械確認済み証跡を同期済み。

## 3. Issue #191の実装内容

### 3.1 Workflow

追加ファイル:
- `.github/workflows/release-preflight.yml`

実行契機:
- `main`へのpush
- `workflow_dispatch`による手動実行

手動実行時:
- `target_sha`へ40文字のコミットSHAを指定可能
- 未指定時はWorkflow実行時の`github.sha`を使用
- SHA形式が不正な場合はcheckout前に失敗

品質確認:
- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

結果記録:
- 対象コミットSHA
- 実行者
- 実行日時（UTC）
- Workflow Run URL
- install / lint / test / buildの各結果

上記を`GITHUB_STEP_SUMMARY`へ日本語で記録します。各品質確認は個別に結果を取得し、最後に1件でも失敗・skipがある場合はWorkflow全体を失敗させます。

### 3.2 セキュリティ・権限

- Workflow権限は`contents: read`のみ
- checkoutでは`persist-credentials: false`
- secret、環境変数値、非公開管理画面情報をSummaryへ出力しない
- 本番deploy、Vercel / Netlify設定変更、環境変数変更は行わない

### 3.3 運用手順

詳細は以下を参照します。
- `docs/runbooks/release-preflight-workflow.md`

## 4. 現在の判定

- Gate A: `Deploy-No-Go`
- Gate B: `未開始`

Issue #191で解消する項目:
- deploy対象コミットに対するlint / test / buildの再実行手段
- 対象SHAと品質結果を同一Workflow Summaryへ保存する手段
- PR headとdeploy対象commitの品質証跡を混同しない運用

Gate Aの残Blocker:
- Issue #191マージ後の`main` HEADに対する`release-preflight`成功結果を確認・記録すること
- deploy対象コミットSHA、記録時刻、記録者を確定すること
- deploy実施者 / 実施責任者 / 記録責任者を確定すること
- 本番環境変数設定済みを権限を持つ人間が確認すること
- rollback参照コミットとrollback手順を人間が確認すること
- deploy後確認担当者と確認期限を確定すること
- 人間のDeploy-Go承認を記録すること

本番URL・robots・sitemap・canonical等が未実測であることは、Gate AのNo-Go理由には含めません。

## 5. 変更対象

- `.github/workflows/release-preflight.yml`
- `docs/current-status.md`
- `docs/active-issues.md`
- `docs/runbooks/release-preflight-workflow.md`
- `docs/logs/2026-07-23-issue-191-release-preflight-workflow.md`
- `docs/ai-prompts/2026-07-23-issue-191-release-preflight-workflow.md`

## 6. 次に必要な対応

1. Issue #191のPRで`CI` / `app-quality` / `docs-validation`が成功することを確認する。
2. 承認レビューを必須とせず、競合がなくCI成功の場合にPRをマージする。
3. `main`へのpushで起動する`release-preflight`の結果を確認する。
4. 成功したWorkflow Run URLと対象SHAをGate A記録へ保存する。
5. deploy実施者 / 実施責任者 / 記録責任者を確定する。
6. 本番環境変数設定済みを、権限を持つ人間が確認する。
7. rollback参照コミット・rollback手順・deploy後確認担当者・確認期限を確定する。
8. 人間のDeploy-Go承認を記録する。
9. Gate A通過後のみ初回本番deployへ進む。
10. deploy後30分以内を目安にGate Bを確認し、公開継続またはrollbackを判断する。

## 7. 注意すべき変更禁止領域

Issue #191では以下を変更しません。

- OCRアルゴリズム
- OCR信頼度計算
- DB migration
- auth
- 保存payload仕様
- 共有URL仕様
- ランキング仕様
- 画像保存方式
- 外部OCR API連携
- 低信頼度候補の自動確定
- 法務判断の確定
- 公式素材・ゲーム画像の追加
- secret、環境変数値、非公開情報の保存
- Vercel / Netlify本番設定
- 本番deploy処理

## 8. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/runbooks/issue-179-official-release-execution-issue.md`
- `docs/runbooks/release-preflight-workflow.md`
- `docs/runbooks/issue-177-official-release-execution-issue-template.md`
- `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
- `docs/runbooks/official-release-approval-and-evidence-submission-template.md`
- `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md`
- `docs/risks/risks.md`
- `docs/active-issues.md`
