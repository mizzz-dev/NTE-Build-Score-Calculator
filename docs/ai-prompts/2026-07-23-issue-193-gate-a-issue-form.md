# Issue #193 AIプロンプトログ: Gate A Deploy-Go判定Issue Form

## 1. 使用目的

Issue #191 / PR #192で追加した`release-preflight`の後続として、Gate Aに残る人間確認とDeploy-Go判定をGitHub Issue Formへ統一する。

## 2. 入力要約

- Repository: `mizzz-ivr/NTE-Build-Score-Calculator`
- PRレビュー承認は必須にしない。
- Deploy-Go人間判定はPR承認とは別に維持する。
- Gate Aは`Deploy-No-Go`、Gate Bは`未開始`。
- secret・環境変数値・非公開管理画面情報を保存しない。
- 本番deploy、ホスティング設定変更、アプリコード変更は行わない。

## 3. AIへの指示

- `docs/ai-protocol/PROMPT.txt`を優先する。
- 日本語でIssue Form、Runbook、ログ、PRを作成する。
- Gate A必須項目を構造化フィールドとして定義する。
- deploy対象SHA、Preflight Run URL、役割、環境確認、rollback、Gate B担当、Deploy-Go判定を必須化する。
- 環境変数値やsecretを入力させない。
- PRレビュー承認とDeploy-Go判定を混同しない。
- Gate AのGoを正式公開完了として扱わない。
- 不足項目がある場合はNo-Goとする。
- 変更差分をIssue Formと関連docsへ限定する。
- CI成功後、レビュー承認を必須とせずマージ可能な状態へする。

## 4. 採用判断

- GitHub Issue FormをGate A人間入力のSource of Truthとする。
- 入力漏れ防止のため主要項目を`required: true`とする。
- 機密情報の非記録を必須checkboxにする。
- Go / No-Goをdropdownで一意に選択する。
- 判定理由、判定者、判定時刻を必須とする。
- Gate Bへの引継ぎ確認を必須checkboxにする。
- 静的Runbookへの値の重複転記は必須としない。

## 5. 不採用判断

- Workflow結果だけでDeploy-Goを自動確定しない。
- GitHub Branch Protectionを変更しない。
- PRレビュー承認を再び必須化しない。
- 環境変数名や値の一覧をIssueへ保存しない。
- 管理画面スクリーンショットを証跡必須にしない。
- VercelからNetlifyへ移行しない。
- 本番deployを実行しない。

## 6. 既知の限界

- Issue Formは入力形式を補助するが、入力内容の真偽を自動検証しない。
- GitHub Issue Formの`input`は完全SHAやISO 8601形式を正規表現で強制できないため、人間確認が必要。
- `Go`選択時の条件分岐による追加必須化は行わないため、判定理由と必須checkboxで運用を補完する。
- 本番環境変数設定済み確認は権限を持つ人間のみが確定できる。
- Gate Bの本番実測はdeploy後に別途必要。

## 7. 誤操作記録

作業開始時のツール操作ミスによりIssue #194〜#201を誤作成した。すべて`誤作成Issue（作業対象外）`へ変更し、`closed / not_planned`とした。正式な作業対象はIssue #193のみである。

## 8. 出力対象

- `.github/ISSUE_TEMPLATE/gate-a-deploy-go.yml`
- `docs/runbooks/gate-a-deploy-go-issue-form.md`
- `docs/current-status.md`
- `docs/active-issues.md`
- `docs/runbooks/issue-179-official-release-execution-issue.md`
- `docs/logs/2026-07-23-issue-193-gate-a-issue-form.md`
- 本ファイル
