# Issue #179 公開実行Issue（Deploy-Go / Release-Go分離版）

- 初版作成日: 2026-05-22 (UTC)
- 判定構造更新日: 2026-07-22 (JST)
- Issue Form同期日: 2026-07-23 (JST)
- 関連Issue: #179 / #187 / #189 / #191 / #193
- 現在ステータス: `Gate A: Deploy-No-Go（品質確認基盤あり / 人間確認・判定待ち）`
- 注意: 本ドキュメント更新では、本番deploy、本番設定変更、secret操作を行わない。

---

## 0. 判定構造

正式リリースの判断を次の2段階へ分離する。

1. **Gate A: Deploy-Go**
   - 初回本番deployを実施してよいかを判断する。
   - deploy前に確認可能な品質証跡、役割、環境準備、rollback準備、人間判断を必須とする。
2. **Gate B: Release-Go**
   - deploy後の本番実測結果に基づき、公開継続またはrollbackを判断する。

> Gate A通過は公開継続承認ではない。Gate B完了前に正式リリース完了と記録しない。

---

## 1. 基本情報

- 対象Repository: `mizzz-ivr/NTE-Build-Score-Calculator`
- deploy対象環境: `Production（Vercel本番）`
- deploy対象ブランチ: `main`
- Issue #193着手時の`main` HEAD候補: `29670c6171e8476f8a1a94b4351ed6c6ceb2a6d3`
- 最終deploy対象SHA: Issue #193のPRマージ後に改めて確定する。
- 想定本番URL: `https://nte-build-score-calculator.vercel.app`
- ホスティング方針: Vercelを維持し、Netlify移行は別Issueで扱う。

参照:

- `docs/runbooks/release-preflight-workflow.md`
- `docs/runbooks/gate-a-deploy-go-issue-form.md`
- `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
- `docs/runbooks/issue-177-official-release-execution-issue-template.md`
- `docs/runbooks/official-release-approval-and-evidence-submission-template.md`

---

## 2. Gate A: Deploy-Go

### 2.1 必須条件

以下がすべて確認済みになるまで、初回本番deployへ進めない。

- [x] deploy対象ブランチが`main`である。
- [ ] deploy対象コミットSHA、記録時刻、記録者が確定している。
- [ ] 対象SHAに対する`release-preflight`が成功している。
- [ ] Workflow Run URLが記録されている。
- [ ] deploy実施者 / 実施責任者 / 記録責任者が確定している。
- [ ] 本番環境変数が設定済みであることを、権限を持つ人間が確認している。
- [x] 環境変数値、secret、非公開管理画面情報をRepositoryへ保存していない。
- [ ] rollback参照コミットとrollback手順が確認されている。
- [ ] deploy後確認担当者と確認期限が確定している。
- [ ] 初回本番deployを実施してよいという人間のDeploy-Go判定が記録されている。

### 2.2 Gate Aの必須条件に含めない項目

未deploy状態では一次情報を取得できないため、次はGate Bで確認する。

- 本番URLへの到達確認
- `robots.txt` / `sitemap.xml`の本番実測
- `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力確認
- canonical / metadata / OGPの本番実測
- 主要導線の本番動作確認
- deploy実行ログURL

### 2.3 品質確認

Gate A品質確認は`.github/workflows/release-preflight.yml`を使用する。

確認内容:

- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

対象SHA、実行者、UTC時刻、Workflow Run URL、各結果をGitHub Actions Summaryへ保存する。

PR headのCI成功と、最終deploy対象SHAの`release-preflight`成功を混同しない。

### 2.4 人間確認・判定のSource of Truth

Issue #193以降、Gate Aの人間入力は次のIssue Formから生成したIssueをSource of Truthとする。

- `.github/ISSUE_TEMPLATE/gate-a-deploy-go.yml`

Issue Formには次を必須入力する。

- deploy対象SHAとrelease-preflight Run URL
- 品質確認時刻・確認者
- deploy実施者 / 実施責任者 / 記録責任者
- 本番環境変数設定済み確認者・確認時刻
- rollback参照コミット・手順
- deploy後確認担当者・確認期限
- Deploy-Go判定・理由・判定者・判定時刻

静的Runbookへ同じ値を重複転記することは必須としない。判定根拠URLとして、起票したGate A IssueのURLを記録する。

### 2.5 判定ルール

次のいずれかに該当する場合は`Deploy-No-Go`とする。

- deploy対象SHAが未確定
- release-preflightが未実行、失敗、または結果不明
- Workflow Run URLが未記録
- 役割分担が未確定
- 本番環境変数設定済みの人間確認がない
- rollback参照コミットまたは手順が未確認
- deploy後確認担当者または確認期限が未確定
- Deploy-Go判定者、判定時刻、理由が未確認
- secretや非公開情報の保存が確認された

Pull Requestのレビュー承認はマージ必須条件としない。Deploy-GoはPR承認とは別の本番リリース判断である。

---

## 3. Gate B: Release-Go

### 3.1 必須条件

初回本番deploy後、確認担当者はIssue Formで定めた期限内に次を確認する。

- [ ] deploy実行ログURL、実施者、対象SHA、結果が記録されている。
- [ ] build / deployログに失敗がない、または失敗内容と対応方針が記録されている。
- [ ] 想定本番URLへアクセスでき、対象アプリである。
- [ ] `robots.txt` / `sitemap.xml`の公開状態が正しい。
- [ ] `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力を確認している。
- [ ] 主要導線（`/` `/score` `/card` `/compare` `/contact` `/terms` `/privacy` `/disclaimer` `/updates`）が利用できる。
- [ ] canonical / metadata / OGPが本番へ反映されている。
- [ ] 重大不具合の有無を判定している。
- [ ] rollback要否を人間が判定している。
- [ ] 公開継続またはrollbackのRelease-Go最終判断が記録されている。

### 3.2 現在の記録

- deploy実施有無: `未実施`
- deploy実行ログURL: `未実施`
- 本番URL一致確認: `未実施`
- robots / sitemap確認: `未実施`
- 主要導線確認: `未実施`
- canonical / metadata / OGP確認: `未実施`
- 重大不具合: `未判定`
- rollback要否: `未判定`
- Release-Go判定: `未判定`

### 3.3 rollback判定へ移行する条件

次のいずれかに該当する場合は、公開継続ではなくrollback判定へ移行する。

- 主要導線が利用不能、5xx継続、白画面などのP1障害
- robots / sitemap / canonicalの重大誤設定
- 規約導線の欠落
- 想定外のnoindex、公開URL不一致、別アプリ表示
- 重大なセキュリティ・プライバシー問題
- deploy結果が失敗または不明
- 確認期限内にGate B必須項目を確認できない

---

## 4. rollback方針

- 既存の直前安定版候補: `e5220c18704ca0185ad257b2f72c4c3809a60648`
- 最終rollback参照SHAはGate A Issueで人間が確定する。
- 基本方針:
  - `git revert <release_commit>`または直前安定版の再deployで切り戻す。
  - 必要時のみ、一時noindex化を人間判断で検討する。
  - rollback実施者、時刻、対象SHA、理由、公開可能なログURLを保存する。

---

## 5. 記録ポリシー

Repositoryへ保存してよい情報:

- Issue / PR / Runbook / 公開可能なWorkflow・deployログURL
- Gate A / Gate Bの判定結果と根拠
- 公開可能な担当者識別名
- UTC時刻
- コミットSHA
- 公開状態の確認結果
- rollback要否と理由

Repositoryへ保存してはいけない情報:

- APIキー、トークン、秘密鍵、パスワード
- Cookie、セッション情報
- Supabase service role key
- `.env.local`、環境変数値
- 個人情報
- 非公開管理画面情報、端末固有パス、スクリーンショット原本
- 未確認の法務判断を確定した表現

---

## 6. AI運用ルール

- AIは未確認項目を推測で埋めない。
- 人間承認、環境設定確認、deploy実行、rollback判断は人間のみが確定する。
- PR headのCI成功を最終deploy対象SHAのPreflight成功として扱わない。
- Gate A通過をRelease-Go承認として扱わない。
- Gate B完了前に正式リリース完了と記録しない。
- deploy実行ログURLをGate Aの必須条件に戻さない。
- OCR、DB、auth、payload仕様、本番設定を本Issueで変更しない。

---

## 7. 現時点の判定（Issue #193）

- Gate A: `Deploy-No-Go`
- Gate B: `未開始`

No-Goの理由:

- Issue #193のPRマージ後の最終deploy対象SHAが未確定
- 最終対象SHAのrelease-preflight成功Run URLが未記録
- 役割分担が未確定
- 本番環境変数設定済みの人間確認が未提出
- rollback手順確認が未提出
- deploy後確認担当者と確認期限が未確定
- Deploy-Go人間判定が未提出

---

## 8. 経緯

- Issue #169: deploy実行ログURLをdeploy後確認へ分離。
- Issue #179: 公開実行Issue記録を作成。
- Issue #181 / #183 / #185: 未deployで取得不能な本番実測証跡によりNo-Go継続。
- Issue #187 / PR #188: Deploy-GoとRelease-Goを分離。
- Issue #189 / PR #190: Repository一次情報をGate Aへ同期。
- Issue #191 / PR #192: 対象SHA単位の`release-preflight`を追加。
- Issue #193: 人間確認とDeploy-Go判定を構造化Issue Formへ統一。
