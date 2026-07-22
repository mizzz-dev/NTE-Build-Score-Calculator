# Issue #175 本番deploy準備と公開実行手順（Gate分離版）

- 初版作成日: 2026-05-21 (UTC)
- 判定構造更新日: 2026-07-22 (JST)
- 関連Issue: #175 / #187
- 目的: 初回本番deployの許可判定と、deploy後の公開継続判定を分離し、安全に正式リリースへ進める。
- 注意: 本Runbookは準備・確認手順の定義のみを対象とし、実際の本番deployや本番設定変更は実施しない。

## 1. deploy対象環境

- deploy対象環境: **Production（Vercel本番環境）**
- 本番URL（想定）: `https://nte-build-score-calculator.vercel.app`
- 補足: Preview / Development環境は本Runbookのdeploy対象外。

## 2. deploy対象ブランチ / 対象コミット

- deploy対象ブランチ: `main`
- deploy対象コミット: **Deploy-Go判定時点の`main` HEAD（実SHAを人間が記録）**
- 記録ルール:
  - 実deploy時はIssueコメントまたは運用ログに対象コミットSHAを必ず保存する。
  - SHA未記録のdeployは実施しない。
  - PRマージ等で`main` HEADが変わった場合は、Deploy-Go判定を再確認する。

## 3. 役割と責任

- Deploy-Go判定責任者: リポジトリ管理者（人間）
- deploy実行者: 本番権限を持つ運用担当者（人間）
- 実施責任者: 正式リリース責任者（人間）
- 記録責任者: 公開実行Issue担当者（人間）
- deploy後確認担当者: Gate Bの本番実測を担当する人間
- Release-Go判定責任者: 公開継続またはrollbackを決定する人間
- AIの役割: 手順整理、記録雛形、提出証跡の整合確認まで。承認・本番操作・最終判断は行わない。

## 4. Gate A: Deploy-Go（初回本番deploy前）

以下がすべて満たされるまで初回本番deployを実施しない。

1. deploy対象ブランチと対象コミットSHAが確定している。
2. `CI` / `pnpm lint` / `pnpm test` / `pnpm build`の結果、または実行不能理由が記録されている。
3. deploy実施者 / 実施責任者 / 記録責任者が確定している。
4. 本番環境変数が設定済みであることを、権限を持つ人間が確認している。
5. 環境変数値、secret、非公開管理画面情報をRepositoryへ保存していない。
6. rollback参照コミットとrollback手順を確認している。
7. deploy後確認担当者と確認期限を確定している。
8. 初回本番deployを実施してよいという人間のDeploy-Go承認が記録されている。

### 4.1 Gate Aに含めない本番実測項目

以下はdeploy後でなければ取得できないため、Gate Aの必須条件にしない。

- 本番URLへの到達確認
- `robots.txt` / `sitemap.xml`の本番実測
- `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力確認
- canonical / metadata / OGPの本番実測
- 主要導線の本番動作確認
- deploy実行ログURL

### 4.2 Deploy-No-Go条件

- 対象コミットSHAが未確定
- 品質確認結果または実行不能理由が未記録
- 役割分担が未確定
- 本番環境変数設定済みの人間確認がない
- rollback準備が未確認
- deploy後確認担当者または確認期限が未確定
- Deploy-Go承認が未提出
- secretや非公開情報の保存が確認された

## 5. Gate B: Release-Go（初回本番deploy後）

deploy完了後、確認担当者は原則30分以内に以下を確認し、公開継続またはrollbackを判定する。

1. deploy実行ログURL、実施者、対象コミットSHA、結果を保存する。
2. build/deployログの失敗有無を確認する。
3. 本番トップへのアクセス可否とHTTPエラー有無を確認する。
4. 想定本番URLと実際の公開URLが一致することを確認する。
5. `robots.txt` / `sitemap.xml`の公開状態を確認する。
6. `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力を確認する。
7. 主要導線（`/` `/score` `/card` `/compare` `/contact` `/terms` `/privacy` `/disclaimer` `/updates`）を確認する。
8. canonical / metadata / OGPの本番反映を確認する。
9. 重大不具合の有無を判定する。
10. rollback要否を人間が判定する。
11. 公開継続またはrollbackのRelease-Go最終判断を記録する。

### 5.1 Gate Bでrollback判定へ移行する条件

- 主要導線アクセス不能、5xx継続、白画面などのP1障害
- `robots.txt` / `sitemap.xml` / canonicalの重大誤設定
- 規約導線（`/terms` `/privacy` `/disclaimer`）の欠落
- 想定外のnoindex、公開URL不一致、別アプリ表示
- 重大なセキュリティ・プライバシー問題
- deploy失敗または結果不明
- 確認期限内にGate B必須項目を確認できない

## 6. rollback参照コミット / rollback方針

- rollback参照コミット（直前安定版候補）: `e5220c18704ca0185ad257b2f72c4c3809a60648`
- rollback方針:
  - `git revert <release_commit>`または直前安定版再deployで切り戻す。
  - 必要時のみ`NEXT_PUBLIC_ROBOTS_NOINDEX=true`による一時noindex化を人間判断で検討する。
  - 実施者、時刻、対象コミット、判定理由、公開可能なログURLを保存する。

## 7. 非公開情報をRepositoryへ保存しないルール

Repositoryへ保存しない:
- APIキー、トークン、秘密鍵、パスワード、Cookie、セッション情報
- Supabase service role keyを含む秘匿環境変数
- 環境変数値、`.env.local`
- 個人情報
- 非公開管理画面情報、端末固有パス、個人スクリーンショット原本

Repositoryへ保存してよい:
- Issue / PR / Runbook等の公開URL
- Deploy-Go / Release-Go判定結果
- 役割名または公開可能な識別名
- UTC時刻
- 対象コミットSHA
- 本番実測の判定結果
- 公開可能なdeployログURL

## 8. Issue #158公開手順との整合

本Runbookは`docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md`のdeploy前 / 中 / 後確認とrollback方針を維持しつつ、承認を以下に明確化する。

- deploy前: Gate A（Deploy-Go）
- deploy後: Gate B（Release-Go）
- Gate A通過を正式公開完了と扱わない。
- Gate B完了前に公開継続承認を記録しない。
- 法務判断確定は本Issue対象外とする。
