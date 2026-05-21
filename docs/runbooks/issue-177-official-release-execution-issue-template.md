# Issue #177 公開実行Issueテンプレート（起票用）

- 作成日: 2026-05-21 (UTC)
- 対象Issue: #177
- 用途: 正式リリースの「公開実行Issue」を安全に起票するための記録テンプレート
- 注意: 本テンプレートは記録項目定義です。**本番deploy実行や本番設定変更は行いません。**

---

## 0. 起票前提（人間承認フロー開始条件）

以下が満たされるまで、公開実行Issueを「実行待ち」に進めない。

1. 人間最終Go承認の事前記録欄（承認者・時刻・根拠URL）が未確認ではない。
2. 本番URL一致確認欄と検索公開設定確認欄の担当者が割り当て済み。
3. rollback参照コミットとrollback要否人間判定欄の担当者が割り当て済み。
4. deploy実施者 / 実施責任者 / 記録責任者が明示済み。
5. 機微情報を保存しないルールに合意済み。

> 補足: Go承認そのものは人間が実施する。AIは記録整備のみ補助する。

---

## 1. 公開実行Issue 基本情報

- 公開実行Issue名:
- 対象リポジトリ:
- 参照Runbook:
  - `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
  - `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md`
- 参照テンプレート:
  - `docs/runbooks/official-release-approval-and-evidence-submission-template.md`

---

## 2. deploy対象の記録欄（必須）

- deploy対象環境: `Production（Vercel本番）`
- deploy対象ブランチ: `main`
- deploy対象コミットSHA: 
- deploy対象コミット記録時刻（UTC）:
- 記録者（人間）:

---

## 3. 人間最終Go承認 記録欄（必須）

- 判定結果: `Go` / `No-Go` / `保留`
- 承認者（人間）:
- 承認時刻（UTC）:
- 承認根拠URL:
- 承認コメント（事実のみ）:
- 未充足条件（あれば）:

---

## 4. 役割と責任分担 記録欄（必須）

- deploy実施者（人間）:
- 実施責任者（人間）:
- 記録責任者（人間）:
- 代理時の引き継ぎ先:

---

## 5. rollback 記録欄（必須）

- rollback参照コミットSHA（既定候補）: `e5220c18704ca0185ad257b2f72c4c3809a60648`
- rollback要否判定: `要` / `不要` / `未判定`
- 判定者（人間）:
- 判定時刻（UTC）:
- 判定理由（推測禁止・事実のみ）:

---

## 6. deploy前確認項目（Pre-deploy）

- [ ] 人間最終Go承認（承認者・時刻・根拠URL）
- [ ] `NEXT_PUBLIC_SITE_URL` と本番URL一致証跡
- [ ] `NEXT_PUBLIC_ROBOTS_NOINDEX=false` 証跡
- [ ] rollback参照コミット確認とrollback要否人間判定
- [ ] `pnpm lint` / `pnpm test` / `pnpm build` 結果記録（不能時は理由）
- [ ] release-checklist必須項目の再確認
- [ ] 非公開情報をRepositoryへ保存しないことを確認

---

## 7. deploy後確認項目（Post-deploy）

- [ ] deploy実行ログURL（実施者・対象コミット・結果）を保存
- [ ] build/deployログの失敗有無を確認
- [ ] 本番トップのHTTPエラー有無を確認
- [ ] `robots.txt` / `sitemap.xml` 公開状態を確認
- [ ] 主要導線（`/` `/score` `/card` `/compare` `/contact` `/terms` `/privacy` `/disclaimer` `/updates`）を確認
- [ ] canonical/metadata/robots/sitemap反映を確認
- [ ] 重大不具合有無を30分以内に一次判定

---

## 8. 記録ポリシー

- 保存可: 公開URL、判定結果、役割名、UTC時刻、コミットSHA、公開可能なdeployログURL
- 保存禁止: APIキー/トークン/秘密鍵/個人情報/`.env.local`/秘匿内部情報
- 法務判断確定は本Issue対象外（`要確認`維持）

