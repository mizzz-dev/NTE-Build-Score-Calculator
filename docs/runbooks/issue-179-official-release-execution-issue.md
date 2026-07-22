# Issue #179 公開実行Issue（Deploy-Go / Release-Go分離版）

- 初版作成日: 2026-05-22 (UTC)
- 判定構造更新日: 2026-07-22 (JST)
- 関連Issue: #179 / #187
- 現在ステータス: `Gate A: Deploy-Go判定待ち（本番未deploy）`
- 目的: 初回本番deployを許可する判定と、deploy後に公開を継続する判定を分離し、未deployでは取得できない証跡による循環待ちを防止する。
- 注意: 本ドキュメント更新では、実際の本番deploy、本番設定変更、secret操作は行わない。

---

## 0. 判定構造

正式リリースの承認を、以下の2段階に分離する。

1. **Gate A: Deploy-Go**
   - 初回本番deployを実施してよいかを判断する。
   - deploy前に確認可能な情報のみを必須条件とする。
2. **Gate B: Release-Go**
   - deploy後の本番実測結果を確認し、公開継続またはrollbackを判断する。
   - 本番URL、robots、sitemap、主要導線などの実測証跡を必須条件とする。

> Gate A通過は「公開継続承認」ではない。Gate B完了前に正式リリース完了と記録しない。

---

## 1. 基本情報

- 対象リポジトリ: `mizzz-dev/NTE-Build-Score-Calculator`
- deploy対象環境: `Production（Vercel本番）`
- deploy対象ブランチ: `main`
- 想定本番URL: `https://nte-build-score-calculator.vercel.app`
- 参照Runbook:
  - `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
  - `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md`
- 参照テンプレート:
  - `docs/runbooks/issue-177-official-release-execution-issue-template.md`
  - `docs/runbooks/official-release-approval-and-evidence-submission-template.md`

---

## 2. Gate A: Deploy-Go（初回本番deploy前）

### 2.1 必須条件

以下がすべて確認済みになるまで、初回本番deployへ進めない。

- [ ] deploy対象ブランチが`main`である。
- [ ] deploy対象コミットSHA、記録時刻、記録者が確定している。
- [ ] `CI` / `pnpm lint` / `pnpm test` / `pnpm build`の結果、または実行不能理由が記録されている。
- [ ] deploy実施者 / 実施責任者 / 記録責任者が確定している。
- [ ] 本番環境変数が設定済みであることを、権限を持つ人間が確認している。
- [ ] 環境変数値、secret、非公開管理画面情報をRepositoryへ保存していない。
- [ ] rollback参照コミットとrollback手順が確認されている。
- [ ] deploy後確認担当者と確認期限が確定している。
- [ ] 初回本番deployを実施してよいという人間のDeploy-Go承認が記録されている。

### 2.2 Gate Aの必須条件に含めない項目

以下は未deploy状態では一次情報として取得できないため、Gate Aの必須条件に含めない。

- 本番URLへの到達確認
- `robots.txt`の本番実測
- `sitemap.xml`の本番実測
- `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力確認
- canonical / metadata / OGPの本番実測
- 主要導線の本番動作確認
- deploy実行ログURL

### 2.3 Gate A記録欄（人間入力）

- deploy対象コミットSHA: `未確認`
- deploy対象コミット記録時刻（UTC）: `未確認`
- deploy対象コミット記録者: `未確認`
- CI / lint / test / build確認結果: `未確認`
- deploy実施者: `未確認`
- 実施責任者: `未確認`
- 記録責任者: `未確認`
- 本番環境変数設定済み確認者: `未確認`
- 本番環境変数確認時刻（UTC）: `未確認`
- rollback参照コミットSHA（既定候補）: `e5220c18704ca0185ad257b2f72c4c3809a60648`
- rollback手順確認結果: `未確認`
- deploy後確認担当者: `未確認`
- deploy後確認期限: `deploy完了から30分以内`（要人間確認）
- Deploy-Go判定: `No-Go`
- Deploy-Go承認者: `未確認`
- Deploy-Go承認時刻（UTC）: `未確認`
- Deploy-Go承認根拠URL: `未確認`
- Deploy-Go承認コメント: `未確認`

### 2.4 Gate AでNo-Goとなる条件

以下のいずれかに該当する場合は`Deploy-No-Go`とする。

- deploy対象コミットSHAが未確定
- CI / lint / test / build結果または実行不能理由が未記録
- 役割分担が未確定
- 本番環境変数設定済みの人間確認がない
- rollback参照コミットまたはrollback手順が未確認
- deploy後確認担当者または確認期限が未確定
- Deploy-Go承認者・時刻・根拠URLが未確認
- secretや非公開情報の保存が確認された

---

## 3. Gate B: Release-Go（初回本番deploy後）

### 3.1 必須条件

初回本番deploy後、確認担当者は原則30分以内に以下を確認する。

- [ ] deploy実行ログURL、実施者、対象コミットSHA、結果が記録されている。
- [ ] build/deployログに失敗がない、または失敗内容と対応方針が記録されている。
- [ ] 想定本番URLへアクセスでき、対象アプリであることを確認している。
- [ ] `robots.txt` / `sitemap.xml`の公開状態を確認している。
- [ ] `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力を確認している。
- [ ] 主要導線（`/` `/score` `/card` `/compare` `/contact` `/terms` `/privacy` `/disclaimer` `/updates`）を確認している。
- [ ] canonical / metadata / OGPの本番反映を確認している。
- [ ] 重大不具合の有無を判定している。
- [ ] rollback要否を人間が判定している。
- [ ] 公開継続またはrollbackのRelease-Go最終判断が記録されている。

### 3.2 Gate B記録欄（deploy後に人間入力）

- deploy実施有無: `未実施`
- deploy実行ログURL: `未実施`
- deploy結果: `未実施`
- 本番URL一致確認: `未実施`
- `robots.txt`確認: `未実施`
- `sitemap.xml`確認: `未実施`
- `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力確認: `未実施`
- 主要導線確認: `未実施`
- canonical / metadata / OGP確認: `未実施`
- 重大不具合: `未判定`
- rollback要否: `未判定`
- Release-Go判定: `未判定`
- Release-Go判定者: `未確認`
- Release-Go判定時刻（UTC）: `未確認`
- Release-Go根拠URL: `未確認`

### 3.3 rollback判定へ移行する条件

以下のいずれかに該当する場合は、公開継続ではなくrollback判定へ移行する。

- 主要導線が利用不能、5xx継続、白画面などのP1障害
- `robots.txt` / `sitemap.xml` / canonicalの重大誤設定
- 規約導線（`/terms` `/privacy` `/disclaimer`）の欠落
- 想定外のnoindex、公開URL不一致、別アプリ表示
- 重大なセキュリティ・プライバシー問題
- deploy結果が失敗または不明
- 確認期限内にGate B必須項目を確認できない

---

## 4. rollback方針

- rollback参照コミット（直前安定版候補）: `e5220c18704ca0185ad257b2f72c4c3809a60648`
- 基本方針:
  - `git revert <release_commit>`または直前安定版の再deployで切り戻す。
  - 必要時のみ`NEXT_PUBLIC_ROBOTS_NOINDEX=true`による一時noindex化を人間判断で検討する。
  - rollback実施者、時刻、対象コミット、理由、公開可能なログURLを保存する。

---

## 5. 記録ポリシー

### Repositoryへ保存してよい情報

- Issue / PR / Runbook / 公開可能な運用ログURL
- Gate A / Gate Bの判定結果と根拠
- 役割名または公開可能な識別名
- UTC時刻
- 対象コミットSHA
- 本番URL一致可否、robots / sitemap / metadata等の公開状態
- 公開可能なdeployログURL
- rollback要否判定と理由

### Repositoryへ保存してはいけない情報

- APIキー、トークン、秘密鍵、パスワード、Cookie、セッション情報
- Supabase service role key
- `.env.local`や環境変数値
- 個人情報
- 非公開管理画面情報、端末固有パス、個人スクリーンショット原本
- 未確認の法務判断を確定した表現

---

## 6. AI運用ルール

- AIは未確認項目を推測で埋めない。
- 人間承認、環境設定確認、deploy実行、rollback判断は人間のみが確定する。
- Gate A通過をRelease-Go承認として扱わない。
- Gate B完了前に正式リリース完了と記録しない。
- deploy実行ログURLをGate Aの必須条件に戻さない。
- OCRアルゴリズム、DB、auth、infra、deployment workflow、保存payload仕様を変更しない。

---

## 7. 現時点の判定（Issue #187）

- Gate A: `Deploy-No-Go`
- Gate B: `未開始`
- Gate AがNo-Goの理由:
  - deploy対象コミットSHAが未確定
  - CI / lint / test / buildの最終記録が未確定
  - deploy実施者 / 実施責任者 / 記録責任者が未確定
  - 本番環境変数設定済みの人間確認が未提出
  - rollback手順確認が未提出
  - deploy後確認担当者と確認期限が未確定
  - 人間のDeploy-Go承認が未提出
- Gate AのNo-Go理由には、本番URL・robots・sitemap・canonical等の未実測を含めない。

---

## 8. 経緯

- Issue #169: deploy実行ログURLをdeploy後確認へ分離。
- Issue #179: 公開実行Issue記録を作成。
- Issue #181 / #183 / #185: 未deployでは取得不能な本番実測証跡がPre-deploy条件に残り、No-Go継続が反復。
- Issue #187: Deploy-GoとRelease-Goを分離し、初回deploy前後の責任と証跡を再定義。
