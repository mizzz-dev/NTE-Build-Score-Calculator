# Issue #191 AIプロンプトログ: Gate A品質確認Workflow追加

- 日付: 2026-07-23 (JST)
- 対象Issue: #191
- 対象Repository: `mizzz-dev/NTE-Build-Score-Calculator`

## 1. 使用目的

Gate Aで必要となるdeploy対象commitの品質証跡を、GitHub Actionsで再実行・保存できる仕組みを追加するため。

## 2. 入力要約

- PRレビュー承認は必須にしない。
- PR #190はCI成功後にマージ済み。
- 次タスクを継続して実装する。
- Gate Aのdeploy対象merge commit品質証跡は未確定。
- 既存CIはNode.js 22、pnpm、lint、test、buildを利用している。
- secret・本番設定・deploy処理は変更しない。

## 3. 実装指示

- `.github/workflows/release-preflight.yml`を追加する。
- `main` pushと`workflow_dispatch`に対応する。
- 手動入力は40文字commit SHAだけを許可する。
- Node.js / pnpm条件を既存CIと合わせる。
- frozen lockfileでinstallする。
- lint / test / buildをすべて実行する。
- 各結果と対象SHAをGitHub Actions Summaryへ日本語で保存する。
- 中間Step失敗時もSummaryを作成する。
- 最終判定で失敗を成功扱いにしない。
- 権限を`contents: read`へ限定する。
- checkout credentialを保持しない。
- 専用Runbook、Context Bootstrap、作業ログを更新する。

## 4. 採用した判断

### main pushでの自動実行

マージ後の`main` HEADを自動確認でき、PR headとmerge commitの結果を混同しにくくなるため採用した。

### workflow_dispatchでのSHA指定

再確認や候補commitの明示確認に利用できるため採用した。

### 各品質Stepのcontinue-on-error

失敗を無視するためではなく、全Stepの結果を1つのSummaryへ集約するため採用した。最後の判定Stepで厳格に失敗させる。

### 完全SHA検証

branch・tag・短縮SHAによる対象の曖昧さを避けるため採用した。

### deploy処理の非搭載

品質確認とdeployの責務を分離し、誤deploy・secret露出・権限拡大を防ぐため採用した。

## 5. 不採用とした判断

- PRレビュー承認を必須化すること。
- 自己承認できないためにPRを停止すること。
- `--no-frozen-lockfile`でlockfile不整合を回避すること。
- branch名やtag名を手動入力として許可すること。
- Workflow内でVercel / Netlify deployを実行すること。
- 本番環境変数やsecretを読み取ってSummaryへ出力すること。
- Workflow成功だけでDeploy-Goと判定すること。
- OCR / DB / auth / payload仕様を同時変更すること。

## 6. 安全性確認

- `permissions: contents: read`
- `persist-credentials: false`
- secret参照なし
- 本番deployなし
- 本番環境変更なし
- 個人情報保存なし
- 公式素材追加なし
- 非公式ファンツール表記維持

## 7. 既知の限界

- Workflowの実動作はPRマージ後の`main` pushで最終確認する必要がある。
- GitHub Actions runnerや外部レジストリ障害は品質不具合と切り分けが必要。
- Workflow成功後も、役割分担・本番環境確認・rollback準備・Deploy-Go判定は人間対応として残る。
- `main`への直接書き込み誤操作により履歴が進んだため、deploy対象SHAはIssue #191マージ後に改めて確定する。

## 8. 期待する完了状態

- PRの既存3 Workflowが成功している。
- 承認レビューなしで安全にマージできる。
- マージ後の`main` HEADに対して`release-preflight`が成功する。
- 成功Run URLと対象SHAをGate A記録へ反映できる。
