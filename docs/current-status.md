# 現在ステータス（Context Bootstrap）

最終更新: 2026-07-23（Issue #193 Gate A Deploy-Go Issue Form追加）

## 1. 現在の実装状態

OCR MVPは、`/score`から`/card`、`/compare`へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1としてmetadata / OGP / canonical / robots / sitemapの最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

正式リリース準備では、公開前チェックリスト、リリースノート案、Go / No-Go判定、公開手順、rollback条件、証跡提出テンプレート、公開実行Issue記録をRepositoryへ保存済みです。

Issue #187 / PR #188で、初回本番deploy前の**Gate A: Deploy-Go**と、deploy後の公開継続判断である**Gate B: Release-Go**を分離しました。

Issue #189 / PR #190では、GitHub上で確認できる一次情報をGate Aへ同期し、PR headの品質結果とdeploy対象commitの品質結果を区別しました。

Issue #191 / PR #192では、deploy対象commitに対してinstall / lint / test / buildを再実行し、対象SHAと結果をGitHub Actions Summaryへ残す`release-preflight` Workflowを追加しました。PR #192はCI成功後、レビュー承認を必須とせず`main`へマージ済みです。

Issue #193では、Gate Aに残る人間確認とDeploy-Go判定を、構造化されたGitHub Issue Formへ統一します。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRの条件付き正式展開可判定。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針の整理。
- 利用規約・免責・プライバシー方針ページの追加。
- metadata / OGP / canonical / robots / sitemapの公開前整備。
- 正式リリース前チェックリスト、候補ノート、公開手順、rollback方針の文書化。
- Issue #187 / PR #188: Deploy-GoとRelease-Goの分離。
- Issue #189 / PR #190: Gate Aの機械確認済み証跡の同期。
- Issue #191 / PR #192: `release-preflight` Workflowの追加。

## 3. Issue #193の実装内容

### 3.1 Gate A専用Issue Form

追加ファイル:

- `.github/ISSUE_TEMPLATE/gate-a-deploy-go.yml`

必須記録:

- deploy対象コミットSHA
- release-preflight Workflow Run URL
- 品質確認時刻・確認者
- deploy実施者 / 実施責任者 / 記録責任者
- 本番環境変数設定済み確認者・確認時刻
- rollback参照コミット・rollback手順
- deploy後確認担当者・確認期限
- Deploy-Go判定・理由・判定者・判定時刻

### 3.2 安全境界

- APIキー、トークン、パスワード、Cookie、環境変数値、非公開管理画面情報を記録しない確認を必須化する。
- 必須項目が1つでも未確認の場合は`No-Go`とする。
- Pull Requestレビュー承認とDeploy-Go判定を別の手続きとして明示する。
- Gate Aが`Go`でも、Gate B完了前は正式公開完了ではない。
- Gate Aが`No-Go`の場合は本番deployを実施しない。

### 3.3 運用手順

- `docs/runbooks/gate-a-deploy-go-issue-form.md`

Gate Aの人間入力は、Issue Formから生成したIssueをSource of Truthとします。静的Runbookへ同じ値を重複転記することは必須としません。

## 4. 現在の判定

- Gate A: `Deploy-No-Go`
- Gate B: `未開始`
- 本番deploy: `未実施`

機械的に整備済み:

- `main`へのpushまたは手動実行で`release-preflight`を起動できる。
- 完全な40文字SHAを指定してinstall / lint / test / buildを実行できる。
- 各結果をGitHub Actions Summaryへ保存できる。
- 失敗またはskipがある場合にWorkflow全体を失敗させる。

未確認・人間対応:

- 最終deploy対象SHAに対する`release-preflight`成功結果の確認とRun URL保存。
- deploy対象コミットSHA、記録時刻、記録者の確定。
- deploy実施者 / 実施責任者 / 記録責任者の確定。
- 本番環境変数設定済みの人間確認。
- rollback参照コミットとrollback手順の確認。
- deploy後確認担当者と確認期限の確定。
- 人間によるDeploy-Go判定。

本番URL・robots・sitemap・canonical等が未実測であることは、Gate AのNo-Go理由には含めません。

## 5. 変更対象

- `.github/ISSUE_TEMPLATE/gate-a-deploy-go.yml`
- `docs/current-status.md`
- `docs/active-issues.md`
- `docs/runbooks/issue-179-official-release-execution-issue.md`
- `docs/runbooks/gate-a-deploy-go-issue-form.md`
- `docs/logs/2026-07-23-issue-193-gate-a-issue-form.md`
- `docs/ai-prompts/2026-07-23-issue-193-gate-a-issue-form.md`

## 6. 次に必要な対応

1. Issue #193のPRで`CI` / `app-quality` / `docs-validation`が成功することを確認する。
2. 競合がなく必要なCIが成功した場合、レビュー承認を必須とせずPRをマージする。
3. マージ後の`main` HEADをdeploy対象候補として確定する。
4. 対象SHAに対して`release-preflight`を実行し、成功Run URLを取得する。
5. `Gate A Deploy-Go判定` Issue Formを起票する。
6. 人間が役割分担・環境確認・rollback・Gate B担当・Deploy-Go判定を入力する。
7. Gate Aが`Go`の場合のみ初回本番deployへ進む。
8. deploy後、指定期限内にGate Bを確認し、公開継続またはrollbackを判断する。

## 7. 注意すべき変更禁止領域

Issue #193では以下を変更しません。

- OCRアルゴリズム / OCR信頼度計算
- DB migration
- auth
- 保存payload / 共有URL / ランキング仕様
- 画像保存方式
- 外部OCR API連携
- 法務判断の確定
- 公式素材・ゲーム画像
- secret、環境変数値、非公開情報
- Vercel / Netlify本番設定
- 本番deploy処理
- Branch Protection設定

## 8. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/runbooks/issue-179-official-release-execution-issue.md`
- `docs/runbooks/release-preflight-workflow.md`
- `docs/runbooks/gate-a-deploy-go-issue-form.md`
- `docs/runbooks/issue-177-official-release-execution-issue-template.md`
- `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
- `docs/runbooks/official-release-approval-and-evidence-submission-template.md`
- `docs/risks/risks.md`
- `docs/active-issues.md`
