# Gate A品質確認Workflow運用手順

- 作成日: 2026-07-23 (JST)
- 対象Issue: #191
- 対象Workflow: `.github/workflows/release-preflight.yml`
- 目的: deploy対象コミットに対するlint・test・buildを再実行し、対象SHAと結果を同一のGitHub Actions Summaryへ保存する。

## 1. 位置づけ

`release-preflight`は、Gate A（Deploy-Go）の品質確認証跡を作るためのWorkflowです。

このWorkflowの成功だけでGate A通過とはしません。以下は別途、人間が確認・記録します。

- deploy対象コミットの最終確定
- deploy実施者 / 実施責任者 / 記録責任者
- 本番環境変数設定済み確認
- rollback参照コミットとrollback手順
- deploy後確認担当者と確認期限
- Deploy-Go判定

## 2. 実行契機

### 2.1 mainへのpush

`main`へcommitが追加された場合、自動的に実行します。

PRをマージした直後の`main` HEADに対する品質証跡として使用します。

### 2.2 手動実行

GitHub Actionsの`release-preflight`から`Run workflow`を選択します。

入力項目:
- `target_sha`: 確認対象の40文字コミットSHA

未指定時:
- Workflow実行時の`github.sha`を対象にします。

指定時:
- 40文字の16進数であることをcheckout前に検証します。
- branch名、tag名、短縮SHAは受け付けません。

## 3. 実行内容

以下を順に実行します。

1. 対象コミットSHAの形式確認
2. 対象コミットのcheckout
3. pnpmセットアップ
4. Node.js 22セットアップ
5. `pnpm install --frozen-lockfile`
6. `pnpm lint`
7. `pnpm test`
8. `pnpm build`
9. GitHub Actions Summary作成
10. 最終成否判定

## 4. 結果の扱い

Summaryへ以下を記録します。

- 対象コミットSHA
- 実行者
- UTC実行時刻
- Workflow Run URL
- install結果
- lint結果
- test結果
- build結果

各品質確認は`continue-on-error`で個別結果を取得します。

最終判定では、install / lint / test / buildのいずれかが`success`以外の場合にWorkflow全体を失敗させます。中間Stepの失敗が成功扱いになることはありません。

## 5. Gate Aへの記録方法

Workflow成功後、以下を`docs/runbooks/issue-179-official-release-execution-issue.md`のGate A記録欄へ保存します。

- deploy対象コミットSHA
- Workflow Run URL
- 実行日時（UTC）
- install / lint / test / buildの結果
- 記録者

記録時の注意:
- 実際に実行した対象SHAとdeploy対象SHAが一致していることを確認する。
- PR headの結果をmerge後の`main` HEADの結果として扱わない。
- Workflow成功をDeploy-Go承認として扱わない。

## 6. 失敗時の対応

### SHA形式エラー

- 40文字の完全SHAを指定する。
- 短縮SHAやbranch名を入力しない。

### install失敗

- `pnpm-lock.yaml`と`packageManager`の整合を確認する。
- 依存関係取得障害かlockfile不整合かを切り分ける。
- lockfileを無視するために`--no-frozen-lockfile`へ安易に変更しない。

### lint / test / build失敗

- 対象Stepのログを確認する。
- 原因修正は別branch・別PRで行う。
- 失敗したcommitをdeploy対象として確定しない。

### GitHub Actions障害

- GitHub側障害やrunner障害であることを一次情報で確認する。
- 再実行した場合は、採用するWorkflow Run URLを明示する。
- 実行不能理由を記録しても、品質成功としては扱わない。

## 7. セキュリティ

- Workflow権限は`contents: read`のみとする。
- checkoutのcredentialは保持しない。
- secret、APIキー、環境変数値、Cookie、非公開管理画面情報をSummaryやログへ意図的に出力しない。
- 本Workflowへ本番deploy処理を追加しない。
- 本番環境を参照するsecretを追加しない。

## 8. Pull Request運用

- PRレビューの承認は必須としない。
- 競合がなく、必須CIが成功していることをマージ条件とする。
- 自己承認できないことを理由にマージを停止しない。
- Deploy-Goの人間承認は、PRレビュー承認とは別のリリース判定として維持する。

## 9. Rollback

Workflow追加に問題がある場合:

1. 追加PRをrevertする。
2. または`.github/workflows/release-preflight.yml`を削除する修正PRを作成する。
3. 既存の`CI` / `app-quality` / `docs-validation`は維持する。

本Workflowはdeploy処理を含まないため、Workflow削除による本番データ・DB・認証への影響はありません。
