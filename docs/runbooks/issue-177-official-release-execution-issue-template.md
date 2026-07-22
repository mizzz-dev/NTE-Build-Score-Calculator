# Issue #177 公開実行Issueテンプレート（Deploy-Go / Release-Go分離版）

- 初版作成日: 2026-05-21 (UTC)
- 判定構造更新日: 2026-07-22 (JST)
- 関連Issue: #177 / #187
- 用途: 初回本番deployの許可判定と、deploy後の公開継続判定を分離して記録する。
- 注意: 本テンプレートは記録項目定義です。**本番deploy実行や本番設定変更は行いません。**

---

## 0. 判定構造

- **Gate A: Deploy-Go**
  - 初回本番deployを実施してよいかを判断する。
  - deploy前に確認可能な事実のみを必須条件とする。
- **Gate B: Release-Go**
  - deploy後の本番実測結果に基づき、公開継続またはrollbackを判断する。

> Gate A通過は公開継続承認ではない。Gate B完了前に正式公開完了と扱わない。

---

## 1. 公開実行Issue 基本情報

- 公開実行Issue名:
- 対象リポジトリ:
- deploy対象環境: `Production（Vercel本番）`
- deploy対象ブランチ: `main`
- 想定本番URL: `https://nte-build-score-calculator.vercel.app`
- 参照Runbook:
  - `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
  - `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md`
- 参照テンプレート:
  - `docs/runbooks/official-release-approval-and-evidence-submission-template.md`

---

## 2. Gate A: Deploy-Go記録欄（初回本番deploy前）

### 2.1 deploy対象

- deploy対象コミットSHA:
- deploy対象コミット記録時刻（UTC）:
- 記録者（人間）:

### 2.2 品質確認

- CI結果:
- `pnpm lint`結果または実行不能理由:
- `pnpm test`結果または実行不能理由:
- `pnpm build`結果または実行不能理由:
- release-checklist確認結果:

### 2.3 役割と責任分担

- deploy実施者（人間）:
- 実施責任者（人間）:
- 記録責任者（人間）:
- deploy後確認担当者（人間）:
- deploy後確認期限: `deploy完了から30分以内` / その他:
- 代理時の引き継ぎ先:

### 2.4 本番環境準備確認

- 本番環境変数設定済み確認: `確認済み` / `未確認`
- 確認者（人間）:
- 確認時刻（UTC）:
- 確認根拠URL（公開可能な範囲）:
- 値やsecretをRepositoryへ保存していないこと: `確認済み` / `未確認`

### 2.5 rollback準備

- rollback参照コミットSHA（既定候補）: `e5220c18704ca0185ad257b2f72c4c3809a60648`
- rollback手順確認: `確認済み` / `未確認`
- 確認者（人間）:
- 確認時刻（UTC）:
- 補足:

### 2.6 Deploy-Go承認

- 判定結果: `Deploy-Go` / `Deploy-No-Go` / `保留`
- 承認者（人間）:
- 承認時刻（UTC）:
- 承認根拠URL:
- 承認コメント（事実のみ）:
- 未充足条件（あれば）:

### 2.7 Gate Aチェックリスト

- [ ] deploy対象コミットSHAが確定している。
- [ ] CI / lint / test / build結果、または実行不能理由が記録されている。
- [ ] deploy実施者 / 実施責任者 / 記録責任者が確定している。
- [ ] 本番環境変数設定済みを人間が確認している。
- [ ] secretや環境変数値をRepositoryへ保存していない。
- [ ] rollback参照コミットとrollback手順が確認されている。
- [ ] deploy後確認担当者と確認期限が確定している。
- [ ] 人間のDeploy-Go承認が記録されている。

### 2.8 Gate Aの必須条件に含めない項目

- 本番URLへの到達確認
- 本番`robots.txt` / `sitemap.xml`の実測
- `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力確認
- canonical / metadata / OGPの本番実測
- 主要導線の本番確認
- deploy実行ログURL

---

## 3. Gate B: Release-Go記録欄（初回本番deploy後）

### 3.1 deploy実行記録

- deploy実施有無: `実施` / `未実施`
- 実施者（人間）:
- 実施時刻（UTC）:
- 対象コミットSHA:
- deploy実行ログURL:
- deploy結果: `成功` / `失敗` / `不明`

### 3.2 本番実測確認

- 本番URL一致確認: `一致` / `不一致` / `未確認`
- 本番URL確認者:
- 本番URL確認時刻（UTC）:
- `robots.txt`確認結果:
- `sitemap.xml`確認結果:
- `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力確認結果:
- canonical確認結果:
- metadata / OGP確認結果:
- 主要導線確認結果:
- 重大不具合: `なし` / `あり` / `未判定`
- 確認証跡URL:

### 3.3 rollback / 公開継続判定

- rollback要否: `要` / `不要` / `未判定`
- rollback判定理由（事実のみ）:
- rollback判定者（人間）:
- rollback判定時刻（UTC）:
- Release-Go判定: `公開継続` / `rollback` / `要追加確認`
- Release-Go判定者（人間）:
- Release-Go判定時刻（UTC）:
- Release-Go根拠URL:
- 判定コメント:

### 3.4 Gate Bチェックリスト

- [ ] deploy実行ログURL、対象コミットSHA、結果が記録されている。
- [ ] 本番URL一致を確認している。
- [ ] `robots.txt` / `sitemap.xml`を確認している。
- [ ] `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力を確認している。
- [ ] 主要導線を確認している。
- [ ] canonical / metadata / OGPを確認している。
- [ ] 重大不具合の有無を判定している。
- [ ] rollback要否とRelease-Go最終判断を人間が記録している。

---

## 4. rollback判定へ移行する条件

- 主要導線が利用不能、5xx継続、白画面などのP1障害
- `robots.txt` / `sitemap.xml` / canonicalの重大誤設定
- 規約導線の欠落
- 想定外のnoindex、公開URL不一致、別アプリ表示
- 重大なセキュリティ・プライバシー問題
- deploy結果が失敗または不明
- 確認期限内にGate B必須項目を確認できない

---

## 5. 記録ポリシー

- 保存可: 公開URL、判定結果、役割名、UTC時刻、コミットSHA、公開可能なdeployログURL、本番実測結果
- 保存禁止: APIキー、トークン、秘密鍵、パスワード、個人情報、`.env.local`、環境変数値、非公開管理画面情報
- AIは未確認項目を推測で補完しない。
- 法務判断確定は本Issue対象外（`要確認`維持）。
