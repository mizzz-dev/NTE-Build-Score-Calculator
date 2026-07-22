# Active Issues（Context Bootstrap）

最終更新: 2026-07-22（PR #186 merge後処理 / Issue #187 作成反映）

## 1. 現在Open Issue

- #187: 初回本番deploy承認と公開継続Go判定の分離（open）

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
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Issue #185 / PR #186 完了結果

- Issue #185: closed / completed
- PR #186: merged
- 公開実行前判定: `No-Go継続`
- 本番deploy: `未実施`
- 人間最終Go承認: `未実施`
- deploy対象コミットSHA: `未確定`
- 本番URL一致証跡: `未確認`
- 検索公開設定証跡: `未確認`
- rollback要否判定: `未判定`
- deploy実施者 / 実施責任者 / 記録責任者: `未提出`

保存先:
- `docs/logs/2026-07-22-issue-185-predeploy-no-go.md`
- `docs/ai-prompts/2026-07-22-issue-185-predeploy-no-go.md`
- `docs/runbooks/issue-179-official-release-execution-issue.md`

## 5. 現在のBlocker

- 現行Runbookでは、未deployでは取得不能な本番URL・robots等の実測証跡がdeploy前条件に残っている。
- 証跡がないためdeployできず、deployしないため証跡を取得できない循環待ちが発生している。
- Issue #187完了前に、現行条件を根拠として初回本番deployへ進めない。
- 人間Go承認や本番公開条件証跡を推測で補完しない。
- secret・環境変数値・非公開管理画面情報をRepositoryへ保存しない。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は変更しない。

## 6. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- Issue #187の本文を確認し、Gate A / Gate Bの責務と完了条件を維持する。
- 公開実行Issue記録は `docs/runbooks/issue-179-official-release-execution-issue.md` を参照する。
- Issue #185確認ログは `docs/logs/2026-07-22-issue-185-predeploy-no-go.md` を参照する。
- 提出テンプレートは `docs/runbooks/official-release-approval-and-evidence-submission-template.md` を参照する。
- Issue #187では実際の本番deployやVercel設定変更を行わず、承認フローとRunbookのみを修正する。
- 評価画像・個人情報・アカウント情報・secretをRepositoryへ保存しない。
