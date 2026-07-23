# Gate A Deploy-Go判定 Issue Form運用手順

## 1. 目的

初回本番deploy前に必要な人間確認を、GitHub Issue Formへ一貫した形式で記録します。

対象Issue Form:

- `.github/ISSUE_TEMPLATE/gate-a-deploy-go.yml`

このIssueはGate Aの人間判断に関するSource of Truthです。静的Runbookへ同じ値を重複転記することは必須としません。

## 2. 前提

Issue Formを起票する前に、以下を満たしてください。

1. deploy対象候補が`main`の完全な40文字コミットSHAとして確定している。
2. 対象SHAに対して`release-preflight`を実行している。
3. install / lint / test / buildがすべて成功している。
4. Workflow Run URLが公開可能である。
5. deploy、rollback、Gate Bの担当者候補を決めている。

いずれかが未確認の場合は、Deploy-Go判定を`No-Go`にします。

## 3. 起票方法

1. GitHub Repositoryの`Issues`を開く。
2. `New issue`を選択する。
3. `Gate A Deploy-Go判定`を選択する。
4. すべての必須項目を入力する。
5. 機密情報が含まれていないことを確認する。
6. `Go`または`No-Go`を選択して起票する。

## 4. 必須記録

### 4.1 品質証跡

- deploy対象コミットSHA
- release-preflight Workflow Run URL
- 品質確認時刻（UTC）
- 品質確認者

PR headのCI成功と、deploy対象commitのrelease-preflight成功を混同しません。

### 4.2 役割分担

- deploy実施者
- 実施責任者
- 記録責任者
- deploy後確認担当者

### 4.3 本番環境確認

- 本番環境変数設定済み確認者
- 確認時刻（UTC）

Repositoryへ保存するのは「設定済みであるという確認結果」だけです。値、secret、管理画面の非公開情報は保存しません。

### 4.4 rollback

- rollback参照コミットSHA
- rollback手順
- 切り戻し後の確認方法

### 4.5 判定

- Deploy-Go判定
- 判定理由
- 判定者
- 判定時刻（UTC）

## 5. 判定ルール

### Go

以下をすべて満たす場合だけ選択できます。

- 対象SHAが確定している。
- release-preflightが成功している。
- 役割分担が確定している。
- 本番環境変数の設定済み確認が完了している。
- rollback参照コミットと手順が確認済みである。
- Gate B担当者と確認期限が確定している。
- 人間の判定者が初回本番deployを許可している。

### No-Go

必須項目が1つでも未確認、失敗、不明の場合は`No-Go`にします。

判定理由には次を記録します。

- 未充足項目
- 再開条件
- 再確認担当者

## 6. PRレビュー承認との違い

Pull Requestのレビュー承認は、このRepositoryではマージの必須条件としません。

一方、Deploy-Goは本番deployを許可する人間のリリース判断です。PRがマージ済みでCIが成功していても、Deploy-Goが`No-Go`なら本番deployを実施しません。

## 7. Gate Bへの引継ぎ

Gate Aが`Go`となり本番deployを実施した後は、原則としてdeploy完了から30分以内にGate Bを実施します。

Gate Bでは次を確認します。

- deploy実行ログURLと結果
- 本番URL一致
- robots / sitemap / noindex相当の出力
- 主要導線
- canonical / metadata / OGP
- 重大不具合
- rollback要否
- 公開継続またはrollbackの最終判断

Gate Aの`Go`は正式公開完了を意味しません。Gate B完了前に正式リリース完了と記録しません。

## 8. 保存禁止情報

次をIssue、コメント、Runbook、ログへ保存しません。

- APIキー、トークン、秘密鍵、パスワード
- Cookie、セッション情報
- `.env.local`、環境変数値
- Supabase service role key
- 非公開管理画面のURLやスクリーンショット原本
- 個人情報

誤って記載した場合は、単なる編集だけで済ませず、漏えいした可能性のあるsecretを失効・再発行します。

## 9. Rollback

Issue Form自体に問題がある場合は、該当PRをrevertするか、`.github/ISSUE_TEMPLATE/gate-a-deploy-go.yml`を削除・修正します。

既存のRunbookと手動記録方式は残るため、Issue Form障害時もGate A判定を省略せず、公開実行Runbookへ必要事項を記録します。
