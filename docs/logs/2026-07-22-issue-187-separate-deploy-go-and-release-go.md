# Issue #187 作業ログ: Deploy-Go / Release-Go判定の分離

- 日付: 2026-07-22 (JST)
- 対象Issue: #187
- 対象ブランチ: `separate-deploy-go-and-release-go`

## 1. 目的

初回本番deploy前に取得不能な本番実測証跡がPre-deploy必須条件として残り、No-Go継続が反復していた問題を解消するため、承認フローをGate A（Deploy-Go）とGate B（Release-Go）へ分離する。

## 2. 確認した正本

- `docs/ai-protocol/PROMPT.txt`
- `docs/current-status.md`
- `docs/active-issues.md`
- `docs/runbooks/issue-179-official-release-execution-issue.md`
- `docs/runbooks/issue-177-official-release-execution-issue-template.md`
- `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
- `docs/runbooks/official-release-approval-and-evidence-submission-template.md`
- Issue #187

## 3. 実施内容

- 公開実行Issue記録をGate A / Gate B構造へ変更した。
- 公開実行IssueテンプレートをGate A / Gate B構造へ変更した。
- deploy準備RunbookをGate A / Gate B構造へ変更した。
- 証跡提出テンプレートをGate A / Gate B構造へ変更した。
- Gate Aから、本番URL、robots、sitemap、canonical、metadata、OGP、主要導線、deployログURLの実測を除外した。
- Gate Bへ本番実測、rollback要否、公開継続判断を集約した。
- Gate A / Gate Bの判定責任者、記録欄、No-Go / rollback条件を定義した。
- deploy後確認期限を原則30分以内として記録した。
- Context Bootstrapドキュメントを同期した。
- 重要判断をADRへ保存した。

## 4. 技術判断

### Gate A: Deploy-Go

初回本番deployを実施するための許可判定とする。deploy前に確認可能な事実だけを必須条件とする。

### Gate B: Release-Go

初回本番deploy後の一次情報に基づく公開継続判定とする。本番実測証跡とrollback要否を必須とする。

### 現在判定

- Gate A: `Deploy-No-Go`
- Gate B: `未開始`

Gate Aの未充足項目:
- deploy対象コミットSHA
- CI / lint / test / buildの最終記録
- deploy実施者 / 実施責任者 / 記録責任者
- 本番環境変数設定済みの人間確認
- rollback手順確認
- deploy後確認担当者と確認期限
- 人間のDeploy-Go承認

本番URLやrobots等の未実測は、Gate AのNo-Go理由に含めない。

## 5. 影響範囲

変更あり:
- リリース承認フロー
- 公開実行Runbook
- 証跡提出テンプレート
- Context Bootstrap docs
- ADR / 作業ログ / AIプロンプトログ

変更なし:
- アプリコード
- OCRアルゴリズム / OCR信頼度計算
- DB / auth / infra
- deployment workflow
- 保存payload / 共有URL / ランキングpayload
- 本番設定
- secret

## 6. テスト観点

- 未deploy状態でGate Aを判定できること。
- 本番実測項目がGate A必須条件に残っていないこと。
- Gate A通過を正式公開完了として扱っていないこと。
- Gate B完了前に公開継続承認と記録しないこと。
- deploy実行ログURLがGate A必須条件へ戻っていないこと。
- Gate Bに確認期限、確認担当者、rollback条件があること。
- secretや環境変数値を保存していないこと。
- OCR / DB / auth / infra / payload仕様に変更がないこと。

## 7. テスト結果

本変更はdocsのみ。

- `pnpm lint`: 未実行（アプリコード変更なし）
- `pnpm test`: 未実行（アプリコード変更なし）
- `pnpm build`: 未実行（アプリコード変更なし）
- GitHub Actions: PR作成後に`CI` / `app-quality` / `docs-validation`を確認する。

## 8. リスク

- Gate A通過を公開継続承認と誤認するリスク。
- Gate B確認が期限内に実施されず、未検証状態が継続するリスク。
- 本番環境変数設定済み確認を、値のRepository保存と誤解するリスク。
- rollback担当・手順が曖昧なまま初回deployするリスク。

## 9. Rollback

本変更はdocsのみ。問題がある場合は対象PRをrevertするか、変更したRunbook・テンプレート・Context Bootstrap docsを戻す修正PRで対応する。

## 10. 次アクション

1. PRをレビュー・マージする。
2. マージ後の`main` HEADをdeploy対象候補として記録する。
3. Gate Aの役割分担・環境確認・rollback準備・確認期限を人間が入力する。
4. 人間がDeploy-Goを判定する。
5. Deploy-Go時のみ初回本番deployへ進む。
6. deploy後にGate Bを実施し、公開継続またはrollbackを判断する。
