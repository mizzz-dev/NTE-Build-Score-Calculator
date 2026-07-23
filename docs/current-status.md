# 現在ステータス（Context Bootstrap）

最終更新: 2026-07-23（Issue #193 / PR #202 完了状態同期）

## 1. 現在の実装状態

OCR MVPは、`/score`から`/card`、`/compare`へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1としてmetadata / OGP / canonical / robots / sitemapの最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

正式リリース準備では、公開前チェックリスト、リリースノート案、Go / No-Go判定、公開手順、rollback条件、証跡提出テンプレート、公開実行Issue記録をRepositoryへ保存済みです。

- Issue #187 / PR #188: Gate AとGate Bを分離済み。
- Issue #189 / PR #190: Gate Aの機械確認済み証跡を同期済み。
- Issue #191 / PR #192: 対象SHA単位の`release-preflight` Workflowを追加済み。
- Issue #193 / PR #202: Gate Aの人間確認とDeploy-Go判定をGitHub Issue Formへ統一済み。

PR #202は`CI` / `app-quality` / `docs-validation`成功後、レビュー承認を必須とせず`main`へマージ済みです。merge commitは`e3dc00d7efa9a31dd30ee5e9f8f48e41fa432e8d`です。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRの条件付き正式展開可判定。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針の整理。
- 利用規約・免責・プライバシー方針ページの追加。
- metadata / OGP / canonical / robots / sitemapの公開前整備。
- 正式リリース前チェックリスト、候補ノート、公開手順、rollback方針の文書化。
- Gate A / Gate Bの分離、品質証跡自動化、人間判定Issue Formの整備。

## 3. Issue #193の完了内容

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

- APIキー、トークン、パスワード、Cookie、環境変数値、非公開管理画面情報を記録しない確認を必須化した。
- 必須項目が1つでも未確認の場合は`No-Go`とする。
- Pull Requestレビュー承認とDeploy-Go判定を別の手続きとして明示した。
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
- Gate Aの人間確認を構造化Issue Formへ記録できる。

未確認・人間対応:

- 完了状態同期PRマージ後の最終`main` HEAD確定。
- 最終deploy対象SHAに対する`release-preflight`成功結果の確認とRun URL保存。
- deploy実施者 / 実施責任者 / 記録責任者の確定。
- 本番環境変数設定済みの人間確認。
- rollback参照コミットとrollback手順の確認。
- deploy後確認担当者と確認期限の確定。
- Gate A Issue Formによる人間のDeploy-Go判定。

本番URL・robots・sitemap・canonical等が未実測であることは、Gate AのNo-Go理由には含めません。

## 5. 次に必要な対応

1. 完了状態同期PRマージ後の`main` HEADをdeploy対象候補として確定する。
2. 対象SHAに対して`release-preflight`を実行し、成功Run URLを取得する。
3. `Gate A Deploy-Go判定` Issue Formを起票する。
4. 人間が役割分担・環境確認・rollback・Gate B担当・Deploy-Go判定を入力する。
5. Gate Aが`Go`の場合のみ初回本番deployへ進む。
6. deploy後、指定期限内にGate Bを確認し、公開継続またはrollbackを判断する。

## 6. 注意すべき変更禁止領域

次フェーズでも、明示的な別Issueがない限り以下を変更しません。

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
- Branch Protection設定

## 7. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/runbooks/issue-179-official-release-execution-issue.md`
- `docs/runbooks/release-preflight-workflow.md`
- `docs/runbooks/gate-a-deploy-go-issue-form.md`
- `docs/runbooks/issue-177-official-release-execution-issue-template.md`
- `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
- `docs/runbooks/official-release-approval-and-evidence-submission-template.md`
- `docs/risks/risks.md`
- `docs/active-issues.md`
