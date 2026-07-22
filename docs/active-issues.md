# Active Issues（Context Bootstrap）

最終更新: 2026-07-22（Issue #185 No-Go継続判定反映）

## 1. 現在Open Issue

- #185: 公開実行前Go承認とPre-deploy必須証跡提出（open / No-Go継続 / 人間対応待ち）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #185: Pre-deploy必須6項目の人間提出（P1）
2. 条件充足時のdeploy実行（P1）
3. deploy実施ログ保存（P1）
4. post-release実測結果への更新（P1）
5. 商用化前の専門確認（名称・素材・免責文言・収益化導線）（P1）
6. rollback運用監査（P2）

## 3. 優先順位（暫定）

- P1: #185 deploy対象となる`main`コミットSHAの確定
- P1: #185 deploy実施者 / 実施責任者 / 記録責任者の確定
- P1: #185 本番環境準備と環境変数確認
- P1: #185 本番URL一致証跡の提出
- P1: #185 検索公開設定証跡の提出
- P1: #185 rollback要否判定の提出
- P1: #185 人間最終Go承認の提出
- P1: 商用化前の専門確認（要確認維持）
- P2: rollback運用監査

## 4. Issue #185 確認結果

人間申告として以下をRepositoryへ記録済み。

- 本番deploy: `未実施`
- 想定公開URL: `https://nte-build-score-calculator.vercel.app`
- 公開URLへのアクセス確認: `未確認`（未deployのためアクセス不可）
- 人間最終Go承認: `未実施`
- Go承認できない理由: 本番環境へdeployされておらず、公開URL・本番環境変数・robots設定・公開後挙動を確認できないため

根拠:
- `https://github.com/mizzz-dev/NTE-Build-Score-Calculator/issues/185#issuecomment-5041601934`

Pre-deploy必須6項目:
- 人間最終Go承認: `未実施`
- deploy対象コミットSHA: `未確定`
- 本番URL一致証跡: `未確認`
- 検索公開設定証跡（`NEXT_PUBLIC_ROBOTS_NOINDEX=false`）: `未確認`
- rollback要否判定: `未判定`
- deploy実施者 / 実施責任者 / 記録責任者: `未提出`

公開実行前判定:
- `No-Go継続`

## 5. Blocker

- 本番deployが未実施であり、想定公開URLへアクセスできない。
- 人間最終Go承認が未実施。
- deploy対象コミットSHAが未確定。
- 本番URL一致証跡が未確認。
- 検索公開設定証跡が未確認。
- rollback要否判定が未判定。
- deploy実施者 / 実施責任者 / 記録責任者が未提出。
- Go承認前にdeploy実行へ進めない。
- 人間Go承認や本番公開条件証跡を推測で補完しない。
- deploy実行ログURLは公開実行後確認項目として扱い、公開実行前Go判定条件には含めない。
- 法務判断の確定は引き続き対象外（要確認）。
- 公式素材・ゲーム画像は追加しない。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。

## 6. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- 公開実行Issue記録は `docs/runbooks/issue-179-official-release-execution-issue.md` を参照。
- Issue #185確認ログは `docs/logs/2026-07-22-issue-185-predeploy-no-go.md` を参照。
- 提出テンプレートは `docs/runbooks/official-release-approval-and-evidence-submission-template.md` を参照。
- Issue #185では、人間担当者が提出した一次情報のみを扱う。
- 非公開情報をRepositoryへ保存しない。
- 公式素材・ゲーム画像は追加しない。
- 評価画像や個人情報をRepositoryへ保存しない。
