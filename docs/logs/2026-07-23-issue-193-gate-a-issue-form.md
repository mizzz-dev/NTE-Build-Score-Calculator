# Issue #193 作業ログ: Gate A Deploy-Go判定Issue Form

- 日付: 2026-07-23 (JST)
- 対象Issue: #193
- 対象ブランチ: `add-gate-a-issue-form`

## 1. 目的

初回本番deploy前のGate Aに残る人間確認を、自由記述ではなくGitHub Issue Formへ統一し、必須項目の欠落と機密情報の誤記録を防止する。

## 2. 前提確認

- Issue #187 / PR #188: Deploy-GoとRelease-Goの分離済み。
- Issue #189 / PR #190: Gate A機械確認済み証跡の同期済み。
- Issue #191 / PR #192: `release-preflight` Workflow追加済み。
- PRレビュー承認はマージ必須条件としない。
- Deploy-Go人間判定はPRレビュー承認とは別のリリース判断として維持する。
- Gate Aは`Deploy-No-Go`、Gate Bは`未開始`。

## 3. 実施内容

### 3.1 Issue Form

`.github/ISSUE_TEMPLATE/gate-a-deploy-go.yml`を追加した。

必須入力:

- deploy対象コミットSHA
- release-preflight Workflow Run URL
- 品質確認時刻・確認者
- deploy実施者 / 実施責任者 / 記録責任者
- 本番環境変数設定済み確認者・確認時刻
- rollback参照コミット・手順
- deploy後確認担当者・確認期限
- Deploy-Go判定・理由・判定者・判定時刻

必須確認:

- secret・環境変数値・非公開管理画面情報を記載していない。
- PRレビュー承認とDeploy-Goは別手続きである。
- Gate AがGoでもGate B完了前は正式公開完了ではない。
- Gate AがNo-Goなら本番deployを実施しない。
- deploy後は指定期限内にGate Bを実施する。

### 3.2 Runbook

`docs/runbooks/gate-a-deploy-go-issue-form.md`を追加し、起票前提、入力方法、Go / No-Go判定、Gate B引継ぎ、保存禁止情報を定義した。

### 3.3 Context Bootstrap / 公開実行Runbook

以下を更新した。

- `docs/current-status.md`
- `docs/active-issues.md`
- `docs/runbooks/issue-179-official-release-execution-issue.md`

Issue #191 / PR #192を完了状態へ同期し、Issue #193を現在作業として記録した。

Gate Aの人間入力は、Issue Formから生成したIssueをSource of Truthとし、静的Runbookへの重複転記を必須としない方針へ変更した。

## 4. 技術・運用判断

### 4.1 構造化Issue Formを採用

自由記述テンプレートでは、担当者・時刻・Run URL・rollback・判定理由の欠落を機械的に防止できない。GitHub Issue Formの必須フィールドと必須チェックで入力漏れを抑制する。

### 4.2 自動Deploy-Go判定は行わない

Workflow成功だけでは、本番環境変数設定、担当者、rollback準備、運用責任を確認できない。Deploy-Goは人間判断として維持する。

### 4.3 PR承認とDeploy-Goを分離

PRレビュー承認はコードマージの手続きであり、Deploy-Goは本番deployの許可判断である。このRepositoryではPR承認をマージ必須条件としないが、Deploy-Go判定は省略しない。

### 4.4 Issueを人間入力のSource of Truthとする

同じ担当者・時刻・判定を複数ファイルへ転記すると不整合が生じる。Gate A Issue URLを根拠として参照し、静的Runbookには構造と現在判定だけを残す。

## 5. セキュリティ・プライバシー

- Workflow権限、Vercel設定、Netlify設定、secretを変更していない。
- Issue Formは環境変数の値ではなく「設定済み確認者・確認時刻」だけを要求する。
- APIキー、トークン、パスワード、Cookie、環境変数値、非公開管理画面情報の記録禁止を必須チェックにした。
- 個人情報や非公開スクリーンショット原本を保存しない。

## 6. 作業中の誤操作と復旧

Issue #193の作業開始時、ツール操作の誤りにより次のIssueを誤作成した。

- #194
- #195
- #196
- #197
- #198
- #199
- #200
- #201

すべてタイトルを`誤作成Issue（作業対象外）`へ変更し、正式な作業対象が#193であることを記載した上で、`closed / not_planned`へ移行した。

影響:

- アプリコード変更なし
- Workflow変更なし
- 本番設定変更なし
- secret操作なし
- 本番deployなし
- Issue番号の履歴のみ残る

再発防止:

- 本作業では新規Issue作成を終了する。
- 以降は既存Issue #193、作業ブランチ、PRだけを使用する。
- ファイル書き込み時は必ず`branch: add-gate-a-issue-form`を明示する。

## 7. 影響範囲

変更あり:

- GitHub Issue Form
- Gate A人間確認運用
- Context Bootstrap docs
- 公開実行Runbook
- 作業ログ / AIプロンプトログ

変更なし:

- アプリコード
- OCRアルゴリズム / OCR信頼度計算
- DB / auth / payload仕様
- GitHub Branch Protection
- Vercel / Netlify設定
- 本番環境変数
- 本番deploy処理

## 8. テスト観点

- Issue Form YAMLがGitHubで認識されること。
- 必須フィールドがすべて定義されていること。
- secret入力を要求する文言がないこと。
- Go / No-Go判定と理由を記録できること。
- PRレビュー承認とDeploy-Goを混同していないこと。
- Gate B引継ぎが明示されていること。
- `CI` / `app-quality` / `docs-validation`が成功すること。

## 9. Rollback

問題がある場合は本変更PRをrevertするか、Issue Formと専用Runbookを削除・修正する。

既存の公開実行Runbookは残るため、Issue Formが利用不能な場合もGate A判定を省略せず、必要事項をRunbookへ手動記録する。

## 10. 次アクション

1. PRを作成する。
2. CI結果と競合有無を確認する。
3. レビュー承認を必須とせず、必要なCI成功後にマージする。
4. マージ後の`main` HEADへrelease-preflightを実行する。
5. Gate A Issue Formを起票し、人間確認とDeploy-Go判定を行う。
