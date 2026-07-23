# Active Issues（Context Bootstrap）

最終更新: 2026-07-23（Issue #189 Gate A機械確認済み証跡の同期）

## 1. 現在Open Issue

- #189: Gate Aの機械確認済み証跡を同期し人間承認待ち項目を明確化（open / 実装中）

完了済み:
- #187: 初回本番deploy承認と公開継続Go判定の分離（closed / completed）
- PR #188: `main`へマージ済み

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #189: Gate A機械確認済み証跡の同期（P1）
2. Gate Aの最終品質証跡確認（P1 / 人間対応）
3. Gate Aの役割分担・本番環境変数設定済み確認・rollback準備（P1 / 人間対応）
4. Deploy-Go人間承認（P1 / 人間対応）
5. Gate A通過時の初回本番deploy（P1）
6. Gate Bの本番実測確認（P1）
7. 公開継続またはrollback判断（P1）
8. post-release実測結果への更新（P1）
9. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
10. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: GitHub上で確認可能なGate A証跡を正本へ同期する
- P1: PR headとdeploy対象merge commitの品質証跡を混同しない
- P1: 人間対応が必要なGate A項目を明確化する
- P1: Gate A通過前に本番deployへ進めない
- P1: Gate B完了前に正式公開完了として扱わない
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Issue #189 対応内容

### 4.1 機械確認済み

- Issue #187: `closed / completed`
- PR #188: `merged`
- deploy対象ブランチ候補: `main`
- deploy対象コミット候補: `676eb4babbf456c272e7608843acd23489bd9a2e`
- PR #188 head: `decd83ac87e1f5640980d1cbffa3ec6472fd3c54`
- PR #188 headのWorkflow:
  - `CI`: success
  - `app-quality`: success
  - `docs-validation`: success
- Netlify Project検索: `NTE`に一致するProjectなし
- Repository正本のdeploy対象: `Production（Vercel本番）`

### 4.2 未確認として残す項目

- `main`のdeploy対象merge commitに対する最終品質証跡
- deploy実施者 / 実施責任者 / 記録責任者
- 本番環境変数設定済みの人間確認
- rollback参照コミットとrollback手順の人間確認
- deploy後確認担当者と確認期限
- 人間のDeploy-Go承認

### 4.3 対象外

- 実際の本番deploy
- Vercel設定変更
- Netlify Project新規作成
- VercelからNetlifyへの移行
- secret・環境変数値の確認または保存
- OCR / DB / auth / infra / deployment workflow変更
- アプリコード変更

## 5. 現在の判定 / Blocker

- Gate A: `Deploy-No-Go`
- Gate B: `未開始`

Gate AのBlocker:
- deploy対象merge commitの最終品質証跡未確認
- deploy実施者 / 実施責任者 / 記録責任者未確定
- 本番環境変数設定済みの人間確認未提出
- rollback手順確認未提出
- deploy後確認担当者と確認期限未確定
- Deploy-Go人間承認未提出

運用ルール:
- PR headのWorkflow成功をmerge commitの成功として推測補完しない。
- 本番URLやrobots等の未実測はGate AのNo-Go理由に含めない。
- Gate A通過前に初回本番deployへ進めない。
- Gate A通過を公開継続承認として扱わない。
- Gate B完了前に正式公開完了と記録しない。
- AIは人間承認・環境設定・本番実測を推測補完しない。
- secret・環境変数値・非公開管理画面情報をRepositoryへ保存しない。
- OCR、DB、auth、infra、deployment workflow、payload仕様は変更しない。

## 6. Handoff情報

- まず`docs/current-status.md`と`docs/ai-protocol/PROMPT.txt`を読む。
- 公開実行Issue記録は`docs/runbooks/issue-179-official-release-execution-issue.md`を参照する。
- 公開実行Issueテンプレートは`docs/runbooks/issue-177-official-release-execution-issue-template.md`を参照する。
- deploy準備手順は`docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`を参照する。
- 証跡提出テンプレートは`docs/runbooks/official-release-approval-and-evidence-submission-template.md`を参照する。
- Issue #189では実際の本番deploy、Vercel設定変更、Netlify Project作成を行わない。
- 評価画像、個人情報、アカウント情報、secretをRepositoryへ保存しない。
