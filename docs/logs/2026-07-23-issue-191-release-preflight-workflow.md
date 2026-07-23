# Issue #191 作業ログ: Gate A品質確認Workflow追加

- 日付: 2026-07-23 (JST)
- 対象Issue: #191
- 対象ブランチ: `add-release-preflight-workflow`

## 1. 目的

deploy対象コミットに対するlint・test・buildを再実行し、対象SHAと各結果をGitHub Actions Summaryへ保存できるGate A専用Workflowを追加する。

## 2. 確認した正本

- `docs/ai-protocol/PROMPT.txt`
- `docs/current-status.md`
- `docs/active-issues.md`
- `docs/runbooks/issue-179-official-release-execution-issue.md`
- `.github/workflows/ci.yml`
- `.github/workflows/app-quality.yml`
- `package.json`
- Issue #191

## 3. 実施内容

- `.github/workflows/release-preflight.yml`を追加した。
- `main`へのpushと`workflow_dispatch`を実行契機にした。
- 手動実行時に40文字コミットSHAを指定可能にした。
- checkout前にSHA形式を検証するようにした。
- Node.js 22とRepository指定のpnpmを利用するようにした。
- frozen lockfileで依存関係をインストールするようにした。
- lint / test / buildの各結果を個別に取得するようにした。
- 対象SHA、実行者、UTC時刻、Run URL、各結果をSummaryへ保存するようにした。
- 1件でも失敗・skipがある場合に最終StepでWorkflow全体を失敗させるようにした。
- `contents: read`と`persist-credentials: false`を設定した。
- Context Bootstrap docsをIssue #191へ同期した。
- 専用Runbookを追加した。

## 4. 技術判断

### main pushでも実行する

PRマージ直後の`main` HEADに対する品質証跡を自動取得するため、手動実行だけでなく`main` pushでも起動する。

### 品質Stepをcontinue-on-errorにする

最初の失敗で後続結果が取得できなくなるのを避け、install / lint / test / buildの結果を1つのSummaryへ集約するため、各Stepの結果を個別取得する。

成功判定を緩める目的ではない。最後の判定Stepで、1件でも`success`以外ならWorkflowを失敗させる。

### 完全SHAのみ受け付ける

対象commitを曖昧にしないため、手動入力は40文字の16進数だけを許可する。branch名、tag名、短縮SHAは受け付けない。

### deploy処理を分離する

本Workflowは品質証跡の作成だけを担当し、Vercel / Netlifyへのdeployや本番secret参照を含めない。

## 5. 影響範囲

変更あり:
- GitHub Actions
- Gate A品質確認手順
- Context Bootstrap docs
- Runbook
- 作業ログ / AIプロンプトログ

変更なし:
- アプリコード
- OCRアルゴリズム / OCR信頼度計算
- DB / auth
- 保存payload / 共有URL / ランキングpayload
- Vercel / Netlify本番設定
- 本番環境変数
- secret
- 本番deploy処理

## 6. 作業中の誤操作と復旧

GitHub Contents API操作時に、作業branch指定前の空または最小Workflowファイルを`main`へ直接作成する誤操作が2回発生した。

発生したcommit:
- `bbc781cd0df25aa12a263380271138738a3bcc4d`: 空ファイル作成
- `7de4b4b54c10eabae50b0cacdce8a20c82eb12bd`: 空ファイル削除
- `18c1372815fdefe9c320762586fecec4d27847fc`: 最小ファイル作成
- `278424182def809dee9b84323962df1fc7712134`: 最小ファイル削除

復旧結果:
- 誤作成ファイルは直ちに削除済み。
- `main`の最終ファイル構成には誤作成Workflowが残っていない。
- secret、本番設定、アプリコード、deploy処理への変更はない。
- commit履歴は残るため、deploy対象SHAを以前の候補から固定せず、Issue #191マージ後の`main` HEADを改めて確定する。
- 作業branchは復旧後の`main`から作成した。

再発防止:
- Repositoryへの新規ファイル作成前に作業branchを先に作成する。
- 書き込みAPIの`branch`指定を必須確認項目とする。
- `main`への直接書き込みを行わない。

## 7. テスト観点

- Workflow YAMLがGitHubに認識されること。
- PRの既存`CI` / `app-quality` / `docs-validation`が成功すること。
- `main`マージ後に`release-preflight`が自動起動すること。
- 40文字SHAを指定して手動実行できること。
- 不正SHAがcheckout前に失敗すること。
- install / lint / test / buildの結果がSummaryへ記録されること。
- 失敗・skipがある場合にWorkflow全体が失敗すること。
- secretや環境変数値が出力されないこと。

## 8. テスト結果

PR作成前:
- ローカル実行: 未実施（RepositoryのGitHub Actionsで確認する）
- Workflow実動作: mainマージ後に確認する

PR作成後に確認する項目:
- `CI`
- `app-quality`
- `docs-validation`

## 9. リスク

- GitHub式コンテキストの差異によりpush時のSHA解決が失敗するリスク。
- 依存関係取得障害で品質確認が失敗するリスク。
- Summaryの成功をDeploy-Go承認と誤認するリスク。
- 手動指定SHAと実際のdeploy対象SHAが不一致になるリスク。
- 既存CIとの重複実行によるActions実行時間増加。

## 10. Rollback

問題がある場合はIssue #191のPRをrevertするか、`.github/workflows/release-preflight.yml`を削除する修正PRを作成する。

専用RunbookとContext Bootstrap docsも同時に戻す。既存の`CI` / `app-quality` / `docs-validation`は維持する。

## 11. 次アクション

1. PRを作成する。
2. 既存3 Workflowの成功を確認する。
3. 承認レビューを必須とせずPRをマージする。
4. `main` pushで実行される`release-preflight`を確認する。
5. 成功Run URLと対象SHAをGate Aへ記録する。
6. 残る人間確認・Deploy-Go判定へ進む。
