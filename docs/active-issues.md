# Active Issues（Context Bootstrap）

最終更新: 2026-07-23（Issue #191 Gate A品質確認Workflow追加）

## 1. 現在Open Issue

- #191: Gate A品質確認をGitHub Actionsで再実行・記録できるWorkflowを追加（open / 実装中）

完了済み:
- #187: 初回本番deploy承認と公開継続Go判定の分離（closed / completed）
- PR #188: `main`へマージ済み
- #189: Gate Aの機械確認済み証跡を同期し人間承認待ち項目を明確化（closed / completed）
- PR #190: CI成功後、承認レビューなしで`main`へマージ済み

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #191: Gate A品質確認Workflow追加（P1）
2. Issue #191マージ後の`main` HEADに対する`release-preflight`結果確認（P1）
3. Gate Aの対象SHA・記録時刻・記録者確定（P1 / 人間対応）
4. Gate Aの役割分担・本番環境変数設定済み確認・rollback準備（P1 / 人間対応）
5. Deploy-Go人間承認（P1 / 人間対応）
6. Gate A通過時の初回本番deploy（P1）
7. Gate Bの本番実測確認（P1）
8. 公開継続またはrollback判断（P1）
9. post-release実測結果への更新（P1）
10. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
11. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: deploy対象コミットに対する品質確認を再実行可能にする
- P1: 対象SHAとlint / test / build結果を同一Summaryへ保存する
- P1: 品質確認失敗を成功扱いにしない
- P1: PR headとdeploy対象commitの品質証跡を混同しない
- P1: Gate A通過前に本番deployへ進めない
- P1: Gate B完了前に正式公開完了として扱わない
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Issue #191 対応内容

### 4.1 Workflow追加

- `.github/workflows/release-preflight.yml`
- `main`へのpushで自動実行
- `workflow_dispatch`で手動実行可能
- 手動時は任意の40文字コミットSHAを指定可能
- Node.js 22 / pnpm 10系の既存構成を維持

### 4.2 品質確認

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

各Stepの結果を取得した後、`GITHUB_STEP_SUMMARY`へ以下を保存します。

- 対象コミットSHA
- 実行者
- UTC実行時刻
- Workflow Run URL
- install / lint / test / buildの結果

いずれかが`success`以外の場合は、最終判定StepでWorkflowを失敗させます。

### 4.3 セキュリティ

- 権限は`contents: read`のみ
- checkoutは`persist-credentials: false`
- secret、環境変数値、非公開管理画面情報を出力しない
- deploy処理を含めない

### 4.4 対象外

- 実際の本番deploy
- Vercel / Netlify設定変更
- ホスティング移行
- 本番環境変数の確認または保存
- Deploy-Goの人間承認
- OCR / DB / auth / payload仕様変更
- アプリUI変更

## 5. 現在の判定 / Blocker

- Gate A: `Deploy-No-Go`
- Gate B: `未開始`

Issue #191で解消予定:
- deploy対象commitの品質確認を再実行する手段がない
- 対象SHAと品質結果を統一形式で保存する手段がない

Gate Aの残Blocker:
- Issue #191マージ後の`release-preflight`成功確認
- deploy対象コミットSHA・記録時刻・記録者未確定
- deploy実施者 / 実施責任者 / 記録責任者未確定
- 本番環境変数設定済みの人間確認未提出
- rollback手順確認未提出
- deploy後確認担当者と確認期限未確定
- Deploy-Go人間承認未提出

運用ルール:
- Pull Requestの承認レビューは必須としない。競合がなく必要なCIが成功している場合にマージ可能とする。
- Deploy-Goの人間承認はPRレビュー承認とは別のリリース判定として維持する。
- PR headのWorkflow成功をdeploy対象commitの成功として推測補完しない。
- 本番URLやrobots等の未実測はGate AのNo-Go理由に含めない。
- Gate A通過前に初回本番deployへ進めない。
- Gate A通過を公開継続承認として扱わない。
- Gate B完了前に正式公開完了と記録しない。
- AIは人間承認・環境設定・本番実測を推測補完しない。
- secret・環境変数値・非公開管理画面情報をRepositoryへ保存しない。

## 6. Handoff情報

- まず`docs/current-status.md`と`docs/ai-protocol/PROMPT.txt`を読む。
- Gate A品質確認Workflowの手順は`docs/runbooks/release-preflight-workflow.md`を参照する。
- 公開実行Issue記録は`docs/runbooks/issue-179-official-release-execution-issue.md`を参照する。
- 公開実行Issueテンプレートは`docs/runbooks/issue-177-official-release-execution-issue-template.md`を参照する。
- deploy準備手順は`docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`を参照する。
- 証跡提出テンプレートは`docs/runbooks/official-release-approval-and-evidence-submission-template.md`を参照する。
- Issue #191では実際の本番deploy、Vercel / Netlify設定変更を行わない。
- 評価画像、個人情報、アカウント情報、secretをRepositoryへ保存しない。
