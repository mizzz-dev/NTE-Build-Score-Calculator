# Active Issues（Context Bootstrap）

最終更新: 2026-07-23（Issue #193 Gate A Deploy-Go Issue Form追加）

## 1. 現在Open Issue

- #193: Gate Aの人間確認・Deploy-Go判定を構造化Issue Formへ統一する（open / 実装中）

完了済み:

- #187 / PR #188: Deploy-GoとRelease-Goの分離（closed / merged）
- #189 / PR #190: Gate Aの機械確認済み証跡の同期（closed / merged）
- #191 / PR #192: Gate A品質確認`release-preflight` Workflowの追加（closed / merged）

作業対象外:

- #194〜#201: Issue #193着手時の誤作成Issue。すべて`closed / not_planned`。

> GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #193: Gate A人間確認・Deploy-Go判定Issue Form追加（P1）
2. #193マージ後の`main` HEAD確定（P1）
3. 最終deploy対象SHAに対する`release-preflight`実行・成功確認（P1）
4. Gate A Deploy-Go判定Issueの起票・人間入力（P1 / 人間対応）
5. Gate AがGoの場合の初回本番deploy（P1）
6. Gate Bの本番実測確認（P1）
7. 公開継続またはrollback判断（P1）
8. post-release実測結果への更新（P1）
9. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
10. rollback運用監査（P2）

## 3. 優先順位

- P1: Gate Aの必須人間確認を構造化フィールドで漏れなく記録する。
- P1: secret・環境変数値・非公開管理画面情報の記録を防止する。
- P1: PRレビュー承認とDeploy-Go判定を混同しない。
- P1: Gate AがNo-Goの場合は本番deployへ進めない。
- P1: Gate AがGoでもGate B完了前は正式公開完了としない。
- P1: 商用化前の専門確認は要確認を維持する。
- P2: rollback運用を監査する。

## 4. Issue #193 対応内容

### 4.1 Issue Form

追加:

- `.github/ISSUE_TEMPLATE/gate-a-deploy-go.yml`

必須項目:

- deploy対象コミットSHA
- release-preflight Workflow Run URL
- 品質確認時刻 / 品質確認者
- deploy実施者 / 実施責任者 / 記録責任者
- 本番環境変数設定済み確認者 / 確認時刻
- rollback参照コミット / rollback手順
- deploy後確認担当者 / 確認期限
- Deploy-Go判定 / 判定理由 / 判定者 / 判定時刻

### 4.2 安全確認

必須チェック:

- APIキー、トークン、パスワード、Cookie、環境変数値、非公開管理画面情報を記載していない。
- Pull Requestレビュー承認とDeploy-Go判定は別の手続きである。
- Gate AがGoでもGate B完了前は正式公開完了ではない。
- Gate AがNo-Goなら本番deployを実施しない。
- deploy後は指定期限内にGate Bを実施する。

### 4.3 運用Runbook

- `docs/runbooks/gate-a-deploy-go-issue-form.md`

Issue Formから生成したIssueを、Gate A人間確認のSource of Truthとします。

## 5. 現在の判定 / Blocker

- Gate A: `Deploy-No-Go`
- Gate B: `未開始`

機械的に整備済み:

- `release-preflight`による対象SHA単位のinstall / lint / test / build。
- GitHub Actions Summaryへの結果保存。
- 失敗・skip時のWorkflow失敗判定。

Gate Aの残Blocker:

- 最終deploy対象SHAの確定。
- 対象SHAに対する`release-preflight`成功Run URLの確認。
- deploy実施者 / 実施責任者 / 記録責任者の確定。
- 本番環境変数設定済みの人間確認。
- rollback参照コミットと手順の確認。
- deploy後確認担当者と確認期限の確定。
- Deploy-Go人間判定。

運用ルール:

- Pull Requestのレビュー承認は必須としない。競合がなく必要なCIが成功している場合にマージ可能とする。
- Deploy-Goの人間承認はPRレビュー承認とは別のリリース判定として維持する。
- PR headのCI成功をdeploy対象commitのrelease-preflight成功として推測補完しない。
- 本番URLやrobots等の未実測はGate AのNo-Go理由に含めない。
- Gate A通過前に初回本番deployへ進めない。
- Gate B完了前に正式公開完了として扱わない。
- AIは人間承認・環境設定・本番実測を推測補完しない。
- secret・環境変数値・非公開管理画面情報をRepositoryへ保存しない。

## 6. Handoff情報

- `docs/current-status.md`と`docs/ai-protocol/PROMPT.txt`を最初に読む。
- Gate A品質確認は`docs/runbooks/release-preflight-workflow.md`を参照する。
- Gate A人間判定は`docs/runbooks/gate-a-deploy-go-issue-form.md`を参照する。
- 公開実行記録は`docs/runbooks/issue-179-official-release-execution-issue.md`を参照する。
- Issue #193では本番deploy、Vercel / Netlify設定変更、secret操作を行わない。
