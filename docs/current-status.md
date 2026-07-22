# 現在ステータス（Context Bootstrap）

最終更新: 2026-07-22（Issue #187 Deploy-Go / Release-Go分離対応）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1として metadata / OGP / canonical / robots / sitemap の最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

正式リリース準備では、公開前チェックリスト、リリースノート案、Go / No-Go判定、公開手順、rollback条件、証跡提出テンプレート、公開実行Issue記録をRepositoryへ保存済みです。

Issue #181 / #183 / #185では、本番未deployのため本番URL・robots・sitemap・canonical等の実測証跡を取得できず、Pre-deploy条件が未充足としてNo-Go継続が繰り返されました。Issue #187では、この循環待ちを解消するため、初回本番deploy前の **Gate A: Deploy-Go** と、deploy後の公開継続判断である **Gate B: Release-Go** を分離しています。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。
- 月次監査Runbookと月次監査ログテンプレートを整備済み。
- 利用規約・免責・プライバシー方針ページを追加済み。
- metadata / OGP / canonical / robots / sitemap の公開前整備を実施済み。
- 商用利用前の権利・法務確認観点を整理済み（最終判断は要確認）。
- 正式リリース前チェックリスト、候補ノート、公開手順、rollback方針を文書化済み。
- 公開実行Issueテンプレート、証跡提出テンプレート、公開実行Issue記録を整備済み。
- Issue #185で、本番deploy未実施・公開URL未確認・人間Go承認未実施という一次情報を保存済み。

## 3. 現在の対応（Issue #187）

Issue #187で、承認フローを以下の2段階へ是正しています。

### Gate A: Deploy-Go（初回本番deploy前）

必須条件:
- deploy対象ブランチと対象コミットSHA
- CI / lint / test / build結果、または実行不能理由
- deploy実施者 / 実施責任者 / 記録責任者
- 本番環境変数設定済みの人間確認（値やsecretは保存しない）
- rollback参照コミットとrollback手順
- deploy後確認担当者と確認期限
- 初回本番deployを実施してよいという人間承認

Gate Aの必須条件に含めない項目:
- 本番URL到達確認
- 本番robots / sitemap / canonical / metadata / OGPの実測
- 主要導線の本番確認
- deploy実行ログURL

### Gate B: Release-Go（初回本番deploy後）

必須条件:
- deploy実行ログURLと結果
- 本番URL一致確認
- `robots.txt` / `sitemap.xml`確認
- `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力確認
- 主要導線確認
- canonical / metadata / OGP確認
- 重大不具合の有無
- rollback要否判定
- 公開継続またはrollbackの人間最終判断

## 4. 現在の判定

- Gate A: `Deploy-No-Go`
- Gate B: `未開始`

Gate AがNo-Goの理由:
- deploy対象コミットSHAが未確定
- CI / lint / test / buildの最終記録が未確定
- deploy実施者 / 実施責任者 / 記録責任者が未確定
- 本番環境変数設定済みの人間確認が未提出
- rollback手順確認が未提出
- deploy後確認担当者と確認期限が未確定
- 人間のDeploy-Go承認が未提出

本番URL・robots・sitemap・canonical等が未実測であることは、Gate AのNo-Go理由には含めません。

## 5. 変更対象ドキュメント

- `docs/runbooks/issue-179-official-release-execution-issue.md`
- `docs/runbooks/issue-177-official-release-execution-issue-template.md`
- `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
- `docs/runbooks/official-release-approval-and-evidence-submission-template.md`
- `docs/adr/2026-07-22-separate-deploy-go-and-release-go.md`
- `docs/logs/2026-07-22-issue-187-separate-deploy-go-and-release-go.md`
- `docs/ai-prompts/2026-07-22-issue-187-separate-deploy-go-and-release-go.md`

## 6. 次に必要な対応

1. Issue #187の変更をレビュー・マージする。
2. マージ後の`main` HEADをdeploy対象候補として記録する。
3. deploy実施者 / 実施責任者 / 記録責任者を確定する。
4. 本番環境変数設定済みを、権限を持つ人間が確認する。
5. rollback手順、deploy後確認担当者、確認期限を確定する。
6. 人間のDeploy-Go承認を記録する。
7. Gate A通過後のみ初回本番deployへ進む。
8. deploy後30分以内を目安にGate Bを確認し、公開継続またはrollbackを判断する。

## 7. 注意すべき変更禁止領域

本フェーズでは以下を変更しない。

- OCRアルゴリズム
- OCR信頼度計算
- DB migration
- auth / infra / deployment workflow
- 保存payload仕様
- 共有URL仕様
- ランキング仕様
- 画像保存方式
- 外部OCR API連携
- 低信頼度候補の自動確定
- 法務判断の確定
- 公式素材・ゲーム画像の追加
- secret、環境変数値、非公開情報の保存

## 8. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/runbooks/issue-179-official-release-execution-issue.md`
- `docs/runbooks/issue-177-official-release-execution-issue-template.md`
- `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
- `docs/runbooks/official-release-approval-and-evidence-submission-template.md`
- `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md`
- `docs/risks/risks.md`
- `docs/active-issues.md`
