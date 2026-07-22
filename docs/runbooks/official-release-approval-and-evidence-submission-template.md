# 正式リリース承認・公開条件証跡 提出テンプレート（Deploy-Go / Release-Go分離版）

- 初版対象Issue: #166
- 判定構造更新Issue: #187
- 用途: 初回本番deployの許可判定と、deploy後の公開継続判定を安全に記録する。
- 注意: 本テンプレートは記録専用です。**公開実行や本番設定変更は行いません。**

---

## 0. 記入ルール（必読）

1. 未確認項目を推測で埋めない。
   - 不明な項目は`未確認`とし、担当者・再確認条件を記載する。
2. 最終承認、環境設定確認、deploy実行、rollback判断は人間のみが行う。
3. 法務判断は本テンプレートで確定せず、`要確認`を維持する。
4. APIキー、トークン、秘密鍵、個人情報、`.env.local`、環境変数値、非公開管理画面情報を記録しない。
5. URL・時刻は可能な限り一次情報へリンクし、時刻はUTCで記録する。
6. Gate A通過を公開継続承認として扱わない。
7. Gate B完了前に正式公開完了と記録しない。

---

## 1. Gate A: Deploy-Go承認記録（初回本番deploy前）

### 1.1 deploy対象

- deploy対象環境: `Production（Vercel本番）`
- deploy対象ブランチ: `main`
- deploy対象コミットSHA:
- 記録者（人間）:
- 記録時刻（UTC）:

### 1.2 品質確認

- CI結果:
- `pnpm lint`結果または実行不能理由:
- `pnpm test`結果または実行不能理由:
- `pnpm build`結果または実行不能理由:
- release-checklist確認結果:
- 確認根拠URL:

### 1.3 役割分担

- deploy実施者（人間）:
- 実施責任者（人間）:
- 記録責任者（人間）:
- deploy後確認担当者（人間）:
- deploy後確認期限: `deploy完了から30分以内` / その他:
- 代理時の引き継ぎ先:

### 1.4 本番環境準備確認

- 本番環境変数設定済み確認: `確認済み` / `未確認`
- 確認者（人間）:
- 確認時刻（UTC）:
- 公開可能な確認根拠URL:
- 値やsecretをRepositoryへ保存していないこと: `確認済み` / `未確認`

### 1.5 rollback準備

- rollback参照コミットSHA（既定候補）: `e5220c18704ca0185ad257b2f72c4c3809a60648`
- rollback手順確認: `確認済み` / `未確認`
- 確認者（人間）:
- 確認時刻（UTC）:
- 補足:

### 1.6 Deploy-Go最終判定

- 判定日（UTC）:
- 判定結果: `Deploy-Go` / `Deploy-No-Go` / `保留`
- 承認者（人間）:
- 承認時刻（UTC）:
- 承認根拠URL:
- 承認コメント（事実のみ）:
- 未充足条件（あれば）:

### 1.7 Gate Aチェック

以下がすべて確認済みなら初回本番deployへ進行できる。

1. deploy対象コミットSHA
2. CI / lint / test / build結果、または実行不能理由
3. deploy実施者 / 実施責任者 / 記録責任者
4. 本番環境変数設定済みの人間確認
5. rollback参照コミットとrollback手順
6. deploy後確認担当者と確認期限
7. 人間のDeploy-Go承認
8. secret・環境変数値・非公開情報を保存していないこと

- Gate A総合判定: `Deploy-Go` / `Deploy-No-Go` / `保留`
- 判定コメント:

### 1.8 Gate Aの必須条件に含めない項目

- 本番URLへの到達確認
- 本番`robots.txt` / `sitemap.xml`の実測
- `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力確認
- canonical / metadata / OGPの本番実測
- 主要導線の本番確認
- deploy実行ログURL

---

## 2. Gate B: deploy実行記録（初回本番deploy後）

- deploy実施有無: `実施` / `未実施`
- 実施者（人間）:
- 実施時刻（UTC）:
- 対象コミットSHA:
- deploy実行ログURL:
- 結果: `成功` / `失敗` / `不明`
- build/deployログ確認結果:
- 補足:

---

## 3. Gate B: 本番公開URL確認

- 確認対象本番URL（想定）: `https://nte-build-score-calculator.vercel.app`
- 実環境で確認したURL:
- 一致判定: `一致` / `不一致` / `未確認`
- HTTPエラー確認結果:
- 確認者（人間）:
- 確認時刻（UTC）:
- 証跡URL:
- 補足:

---

## 4. Gate B: 検索公開・metadata確認

- `robots.txt`確認結果:
- `sitemap.xml`確認結果:
- `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力確認結果:
- canonical確認結果:
- metadata / OGP確認結果:
- 確認者（人間）:
- 確認時刻（UTC）:
- 証跡URL:
- 補足:

---

## 5. Gate B: 主要導線・重大不具合確認

- 確認対象:
  - `/`
  - `/score`
  - `/card`
  - `/compare`
  - `/contact`
  - `/terms`
  - `/privacy`
  - `/disclaimer`
  - `/updates`
- 主要導線確認結果:
- 重大不具合: `なし` / `あり` / `未判定`
- 確認者（人間）:
- 確認時刻（UTC）:
- 証跡URL:
- 補足:

---

## 6. Gate B: rollback / Release-Go最終判断

- rollback要否: `要` / `不要` / `未判定`
- rollback判定理由（事実のみ）:
- rollback判定者（人間）:
- rollback判定時刻（UTC）:
- rollback実施時のログURL（実施時のみ）:
- Release-Go判定: `公開継続` / `rollback` / `要追加確認`
- Release-Go判定者（人間）:
- Release-Go判定時刻（UTC）:
- Release-Go根拠URL:
- 判定コメント:

---

## 7. Gate B最終チェック

以下がすべて確認済みなら、公開継続またはrollbackを最終判断する。

1. deploy実行ログURL、対象コミットSHA、結果
2. 本番URL一致確認
3. `robots.txt` / `sitemap.xml`確認
4. `NEXT_PUBLIC_ROBOTS_NOINDEX=false`相当の本番出力確認
5. canonical / metadata / OGP確認
6. 主要導線確認
7. 重大不具合の有無
8. rollback要否判定
9. 人間のRelease-Go最終判断

- Gate B総合判定: `公開継続` / `rollback` / `要追加確認`
- 判定コメント:

---

## 8. rollback判定へ移行する条件

- 主要導線アクセス不能、5xx継続、白画面などのP1障害
- `robots.txt` / `sitemap.xml` / canonicalの重大誤設定
- 規約導線の欠落
- 想定外のnoindex、公開URL不一致、別アプリ表示
- 重大なセキュリティ・プライバシー問題
- deploy失敗または結果不明
- 確認期限内にGate B必須項目を確認できない

---

## 9. 保存してよい情報 / 保存禁止情報

### 保存してよい情報

- Issue / PR / Discussion / Runbook / 公開可能な運用ログURL
- Deploy-Go / Release-Go判定結果
- 役割名または公開可能な識別名
- UTC時刻
- 対象コミットSHA
- 本番URL一致可否、robots / sitemap / metadata等の公開状態
- 公開可能なdeployログURL
- rollback要否判定と理由

### 保存禁止情報

- APIキー、トークン、秘密鍵、パスワード、Cookie、セッション情報
- Supabase service role key
- `.env.local`、環境変数値
- 個人情報
- 非公開管理画面情報、端末固有パス、個人スクリーンショット原本
- 未確認の法務判断を確定した表現
