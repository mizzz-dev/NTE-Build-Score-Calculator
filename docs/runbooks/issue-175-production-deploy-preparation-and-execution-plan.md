# Issue #175 本番deploy準備と公開実行手順

- 作成日: 2026-05-21 (UTC)
- 対象Issue: #175
- 目的: 公開実行前Go承認に進む前段として、本番deploy準備と公開実行手順を整理する。
- 注意: 本Runbookは準備・確認手順の定義のみを対象とし、実際の本番deployや本番設定変更は実施しない。

## 1. deploy対象環境

- deploy対象環境: **Production（Vercel本番環境）**
- 本番URL（想定）: `https://nte-build-score-calculator.vercel.app`
- 補足: Preview/Development環境は本Issueのdeploy対象外。

## 2. deploy対象ブランチ / 対象コミット

- deploy対象ブランチ: `main`
- deploy対象コミット: **公開実行Issue起票時点の `main` HEAD（実SHAを人間が記録）**
- 記録ルール:
  - 実deploy時はIssueコメントまたは運用ログに対象コミットSHAを必ず保存する。
  - SHA未記録のdeployは実施しない。

## 3. deploy実施者 / 実施責任者

- 最終公開判断責任者: リポジトリ管理者（人間）
- deploy実行者: 本番権限を持つ運用担当者（人間）
- 記録責任者: 公開実行Issue担当者（人間）
- AIの役割: 事前手順整理・ログ雛形整備まで（最終承認/最終実行は人間のみ）

## 4. deploy実施前確認項目（Pre-deploy）

以下が全て満たされるまで公開実行しない。

1. 人間最終Go承認（承認者・時刻・根拠URL）が提出済み。
2. 本番公開URL一致証跡（`NEXT_PUBLIC_SITE_URL` と本番URL一致）が提出済み。
3. 検索公開設定証跡（`NEXT_PUBLIC_ROBOTS_NOINDEX=false`）が提出済み。
4. rollback参照コミットとrollback要否の人間判定（判定者・時刻・理由）が提出済み。
5. `pnpm lint` / `pnpm test` / `pnpm build` の結果が記録済み（実行不能時は理由を明記）。
6. release-checklist必須項目の再確認が完了。
7. 非公開情報（トークン・鍵・個人情報）をRepositoryへ保存しないことを関係者で再確認。

## 5. deploy実施後確認項目（Post-deploy）

deploy実行後に以下を確認し、公開継続可否を判定する。

1. deploy実行ログURL（実施者・対象コミット・結果）を保存。
2. build/deployログの失敗有無を確認。
3. 本番トップへのアクセス可否とHTTPエラー有無を確認。
4. `robots.txt` / `sitemap.xml` の公開状態を確認。
5. 主要導線（`/` `/score` `/card` `/compare` `/contact` `/terms` `/privacy` `/disclaimer` `/updates`）を確認。
6. canonical/metadata/robots/sitemapの反映を確認。
7. 重大不具合有無を30分以内に一次判定し、継続公開またはrollback判定へ移行。

## 6. rollback参照コミット / rollback方針再確認

- rollback参照コミット（直前安定版候補）: `e5220c18704ca0185ad257b2f72c4c3809a60648`
- rollback実施条件（いずれか）:
  1. 主要導線アクセス不能（5xx継続・白画面）
  2. `robots` / `sitemap` / canonical の重大誤設定
  3. 規約導線欠落（`/terms` `/privacy` `/disclaimer`）
  4. 公開直後のP1障害
- rollback方針:
  - `git revert <release_commit>` または直前安定版再deployで切り戻す。
  - 必要時のみ `NEXT_PUBLIC_ROBOTS_NOINDEX=true` による一時noindex化を検討（人間判断）。
  - 実施後は実施者・時刻・判定理由・ログURLを保存する。

## 7. 非公開情報をRepositoryへ保存しないルール

Repositoryへ保存しない:
- APIキー、トークン、秘密鍵、パスワード、Cookie、セッション情報
- `service role key` を含む秘匿環境変数
- 個人情報
- `.env.local` や端末固有パス
- 公開不可な内部管理情報

Repositoryへ保存してよい:
- Issue/PR/Runbook等の公開URL
- Go/No-Go判定結果
- 役割名ベースの実施者情報
- UTC時刻
- 対象コミットSHA
- 公開可能なdeployログURL

## 8. Issue #158 公開手順との整合

本Runbookは `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md` と整合する。

- deploy前/中/後確認の区分を維持。
- rollback条件・rollback手順の方針を維持。
- 「本Issueでは実deployを行わない」方針を維持。
- 法務判断確定を本Issue対象外とする方針を維持。

