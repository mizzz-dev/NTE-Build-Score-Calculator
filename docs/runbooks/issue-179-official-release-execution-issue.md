# Issue #179 公開実行Issue（人間Go承認待ち）

- 作成日: 2026-05-22 (UTC)
- 対象Issue: #179
- ステータス: `人間Go承認待ち（未実行）`
- 起票目的: Issue #177で整備した公開実行Issueテンプレートを実運用に適用し、Go承認待ち状態をRepository上で明確化する。
- 参照テンプレート: `docs/runbooks/issue-177-official-release-execution-issue-template.md`
- 注意: **本ドキュメント作成時点で本番deployは未実施**。本番設定変更も未実施。

---

## 0. 起票前提（人間承認フロー開始条件）

以下が満たされるまで、公開実行Issueを「実行待ち」に進めない。

1. 人間最終Go承認の事前記録欄（承認者・時刻・根拠URL）が未確認ではない。
2. 本番URL一致確認欄と検索公開設定確認欄の担当者が割り当て済み。
3. rollback参照コミットとrollback要否人間判定欄の担当者が割り当て済み。
4. deploy実施者 / 実施責任者 / 記録責任者が明示済み。
5. 機微情報を保存しないルールに合意済み。

> 明示ルール: **人間最終Go承認完了前はdeploy実行へ進めない。**

---

## 1. 公開実行Issue 基本情報

- 公開実行Issue名: `Issue #179 正式リリース公開実行（人間Go承認待ち）`
- 対象リポジトリ: `mizzz-dev/NTE-Build-Score-Calculator`
- 参照Runbook:
  - `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
  - `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md`
- 参照テンプレート:
  - `docs/runbooks/official-release-approval-and-evidence-submission-template.md`

---

## 2. deploy対象の記録欄（必須 / 人間入力）

- deploy対象環境: `Production（Vercel本番）`
- deploy対象ブランチ: `main`
- deploy対象コミットSHA: `未確認`（人間入力必須）
- deploy対象コミット記録時刻（UTC）: `未確認`（人間入力必須）
- 記録者（人間）: `未確認`（人間入力必須）

---

## 3. 人間最終Go承認 記録欄（必須 / 人間入力）

- 判定結果: `保留`（Go承認待ち）
- 承認者（人間）: `未確認`
- 承認時刻（UTC）: `未確認`
- 承認根拠URL: `未確認`
- 承認コメント（事実のみ）: `未確認`
- 未充足条件（あれば）:
  - `Go承認者・承認時刻・承認根拠URLが未提出`
  - `本番URL一致証跡が未提出`
  - `NEXT_PUBLIC_ROBOTS_NOINDEX=false 証跡が未提出`
  - `rollback要否の人間判定（判定者・時刻・理由）が未提出`

---

## 4. 役割と責任分担 記録欄（必須 / 人間入力）

- deploy実施者（人間）: `未確認`
- 実施責任者（人間）: `未確認`
- 記録責任者（人間）: `未確認`
- 代理時の引き継ぎ先: `未確認`

---

## 5. rollback 記録欄（必須 / 人間入力）

- rollback参照コミットSHA（既定候補）: `e5220c18704ca0185ad257b2f72c4c3809a60648`
- rollback要否判定: `未判定`
- 判定者（人間）: `未確認`
- 判定時刻（UTC）: `未確認`
- 判定理由（推測禁止・事実のみ）: `未確認`

---

## 6. deploy前確認項目（Pre-deploy）

> 方針: 以下がすべて確認済みになるまで、deploy実行へ進めない。

- [ ] 人間最終Go承認（承認者・時刻・根拠URL）
- [ ] `NEXT_PUBLIC_SITE_URL` と本番URL一致証跡
- [ ] `NEXT_PUBLIC_ROBOTS_NOINDEX=false` 証跡
- [ ] rollback参照コミット確認とrollback要否人間判定
- [ ] `pnpm lint` / `pnpm test` / `pnpm build` 結果記録（不能時は理由）
- [ ] release-checklist必須項目の再確認
- [ ] 非公開情報をRepositoryへ保存しないことを確認

### 6.1 未充足項目（2026-05-22 UTC時点）

- 人間最終Go承認: `未確認`
- 本番URL一致証跡: `未確認`
- 検索公開設定証跡（`NEXT_PUBLIC_ROBOTS_NOINDEX=false`）: `未確認`
- rollback要否人間判定: `未確認`

---

## 7. deploy後確認項目（Post-deploy）

> 注意: 本項目は公開実行後にのみ記入する。現時点はすべて `未実施`。

- [ ] deploy実行ログURL（実施者・対象コミット・結果）を保存
- [ ] build/deployログの失敗有無を確認
- [ ] 本番トップのHTTPエラー有無を確認
- [ ] `robots.txt` / `sitemap.xml` 公開状態を確認
- [ ] 主要導線（`/` `/score` `/card` `/compare` `/contact` `/terms` `/privacy` `/disclaimer` `/updates`）を確認
- [ ] canonical/metadata/robots/sitemap反映を確認
- [ ] 重大不具合有無を30分以内に一次判定

### 7.1 現在状態（2026-05-22 UTC時点）

- deploy実施有無: `未実施`
- deploy後確認: `未実施`

---

## 8. 人間入力が必要な欄（明示）

以下は**人間のみ入力・確定可能**（AIによる推測補完禁止）。

1. Go承認（承認者・時刻・根拠URL）
2. deploy対象コミットSHA（実deploy対象）
3. deploy実施者 / 実施責任者 / 記録責任者
4. rollback要否判定（判定者・時刻・理由）
5. deploy実行ログURLと実行結果

---

## 9. AI運用ルール（証跡推測補完禁止）

- AIは未確認項目を推測で埋めない。
- 不明項目は `未確認` のまま記録する。
- 人間Go承認・本番公開条件証跡は、人間が一次情報URL付きで記録する。
- deploy実行ログURLは公開実行**後**確認項目として扱い、公開実行前Go判定条件へ戻さない。

---

## 10. 現時点の総合判定（2026-05-22 UTC）

- 判定: `No-Go継続（人間Go承認待ち）`
- 理由（事実のみ）:
  - Go承認者・承認時刻・承認根拠URLが未確認
  - 本番URL一致証跡が未確認
  - `NEXT_PUBLIC_ROBOTS_NOINDEX=false` 証跡が未確認
  - rollback要否の人間判定が未確認



---

## 11. Issue #181 受領確認反映（2026-05-22 UTC）

Issue #181 対応として、公開実行前Go判定に必要な人間提出証跡の受領有無をRepository上の一次情報で再確認した。

- 人間最終Go承認（承認者・時刻・根拠URL）: `未確認`
- deploy対象コミットSHA: `未確認`
- 本番URL一致証跡: `未確認`
- 検索公開設定証跡（`NEXT_PUBLIC_ROBOTS_NOINDEX=false`）: `未確認`
- rollback要否判定（判定者・時刻・理由）: `未確認`
- deploy実施者 / 実施責任者 / 記録責任者: `未確認`

### 11.1 公開実行前判定

- 判定: `No-Go継続`
- 根拠: Pre-deploy必須証跡が未提出のため。
- 運用制御: 人間最終Go承認完了前はdeploy実行へ進めない。


---

## 12. Issue #183 受領確認反映（2026-05-22 UTC）

Issue #183 対応として、公開実行前Go判定に必要な人間提出証跡の受領有無をRepository上の一次情報で再確認した。

- 人間最終Go承認（承認者・時刻・根拠URL）: `未確認`
- deploy対象コミットSHA: `未確認`
- 本番URL一致証跡: `未確認`
- 検索公開設定証跡（`NEXT_PUBLIC_ROBOTS_NOINDEX=false`）: `未確認`
- rollback要否判定（判定者・時刻・理由）: `未確認`
- deploy実施者 / 実施責任者 / 記録責任者: `未確認`

### 12.1 公開実行前判定

- 判定: `No-Go継続`
- 根拠: Issue #179 のPre-deploy必須6項目がRepository上で未確認のため。
- 運用制御: 人間最終Go承認完了前はdeploy実行へ進めない。
