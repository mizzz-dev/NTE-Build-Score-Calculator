# Active Issues（Context Bootstrap）

最終更新: 2026-07-22（Issue #187 Deploy-Go / Release-Go分離対応）

## 1. 現在Open Issue

- #187: 初回本番deploy承認と公開継続Go判定の分離（open / 実装中）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #187: Deploy-Go / Release-Go判定フローの分離（P1）
2. Gate A必須項目の人間提出（P1）
3. Gate A通過時の初回本番deploy（P1）
4. Gate Bの本番実測確認（P1）
5. 公開継続またはrollback判断（P1）
6. post-release実測結果への更新（P1）
7. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
8. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: #187 Gate A（Deploy-Go）の必須条件を未deploy状態で判定可能にする
- P1: #187 Gate B（Release-Go）へ本番実測証跡を集約する
- P1: #187 Gate A通過を正式公開完了として扱わないルールを明記する
- P1: #187 Gate Bの確認期限・確認担当者・rollback条件を定義する
- P1: #187 承認テンプレートと公開実行Runbookの記録欄を同期する
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Issue #187 対応内容

### Gate A: Deploy-Go（初回本番deploy前）

必須:
- deploy対象コミットSHA
- CI / lint / test / build結果または実行不能理由
- deploy実施者 / 実施責任者 / 記録責任者
- 本番環境変数設定済みの人間確認
- rollback参照コミットとrollback手順
- deploy後確認担当者と確認期限
- 人間のDeploy-Go承認

Gate Aの必須条件から除外:
- 本番URL到達確認
- 本番robots / sitemap / canonical / metadata / OGP実測
- 主要導線の本番確認
- deploy実行ログURL

### Gate B: Release-Go（初回本番deploy後）

必須:
- deploy実行ログURLと結果
- 本番URL一致確認
- `robots.txt` / `sitemap.xml`確認
- `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力確認
- 主要導線確認
- canonical / metadata / OGP確認
- 重大不具合の有無
- rollback要否判定
- 公開継続またはrollbackの人間最終判断

## 5. 現在の判定 / Blocker

- Gate A: `Deploy-No-Go`
- Gate B: `未開始`

Gate AのBlocker:
- deploy対象コミットSHA未確定
- 品質確認の最終記録未確定
- deploy実施者 / 実施責任者 / 記録責任者未確定
- 本番環境変数設定済みの人間確認未提出
- rollback手順確認未提出
- deploy後確認担当者と確認期限未確定
- Deploy-Go人間承認未提出

運用ルール:
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
- Issue #187では実際の本番deployやVercel設定変更を行わない。
- 評価画像、個人情報、アカウント情報、secretをRepositoryへ保存しない。
