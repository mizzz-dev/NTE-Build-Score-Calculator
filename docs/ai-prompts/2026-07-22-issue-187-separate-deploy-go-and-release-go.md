# AIプロンプトログ: Issue #187 Deploy-Go / Release-Go判定の分離

- 記録日: 2026-07-22 (JST)
- 対象Issue: #187
- 使用目的: 初回本番deploy承認とdeploy後の公開継続判定を分離し、循環待ちを解消する。
- 適用プロトコル: `docs/ai-protocol/PROMPT.txt`

## 1. 入力要約

- RepositoryをSource of Truthとして次タスクを実装する。
- 本番未deployのため本番URLやrobots等を確認できず、No-Go継続が反復している。
- 初回本番deploy前のDeploy-Goと、deploy後のRelease-Goを分離する。
- 実際の本番deployやVercel設定変更は行わない。
- secret、環境変数値、個人情報をRepositoryへ保存しない。
- OCR、DB、auth、infra、deployment workflow、payload仕様を変更しない。

## 2. 採用した判断

- Gate A（Deploy-Go）はdeploy前に確認可能な事実だけを必須条件とする。
- Gate B（Release-Go）は本番deploy後の実測証跡を必須条件とする。
- Gate Aから本番URL、robots、sitemap、canonical、metadata、OGP、主要導線、deployログURLの実測を除外する。
- Gate Bに本番実測、rollback要否、公開継続またはrollbackの人間判断を集約する。
- deploy後確認期限を原則30分以内とする。
- Gate A通過を正式公開完了として扱わない。
- 重要な運用判断のためADRを作成する。

## 3. 不採用とした判断

- 本番実測証跡を引き続きdeploy前必須とする案。
  - 未deployでは取得できず、循環待ちが解消しないため不採用。
- Gate A通過のみで正式公開完了とする案。
  - deploy後の不具合や公開設定誤りを統制できないため不採用。
- AIが本番設定や証跡を推測補完する案。
  - 一次情報に基づかず、セキュリティ・運用上不適切なため不採用。
- 実際の本番deployやVercel設定を変更する案。
  - Issue #187の対象外であり、人間承認・本番権限が必要なため不採用。

## 4. 変更対象

- `docs/runbooks/issue-179-official-release-execution-issue.md`
- `docs/runbooks/issue-177-official-release-execution-issue-template.md`
- `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
- `docs/runbooks/official-release-approval-and-evidence-submission-template.md`
- `docs/current-status.md`
- `docs/active-issues.md`
- `docs/adr/2026-07-22-separate-deploy-go-and-release-go.md`
- `docs/logs/2026-07-22-issue-187-separate-deploy-go-and-release-go.md`

## 5. 既知の限界

- 本番環境変数が設定済みかはAIから確認できない。
- deploy対象コミットSHAはPRマージ後に変わるため、人間が最終記録する必要がある。
- deploy実施者、責任者、記録責任者、確認担当者は人間が確定する必要がある。
- Gate Bの本番実測は初回本番deploy後でなければ実施できない。
- 法務・権利判断は未確定であり、要確認を維持する。

## 6. 完了確認

- Gate A / Gate Bが明確に分離されている。
- 本番deploy前に取得不能な証跡がGate A必須条件から除外されている。
- Gate A / Gate Bの記録欄、判定者、判定結果、根拠欄が定義されている。
- Gate Bの確認期限、確認担当者、rollback条件が定義されている。
- Context Bootstrap、作業ログ、ADRが更新されている。
- アプリコード、OCR、DB、auth、infra、deployment workflow、payload仕様に変更がない。
