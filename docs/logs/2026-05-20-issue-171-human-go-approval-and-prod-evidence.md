# Issue #171 人間最終Go承認と本番公開条件証跡の提出ログ

- 作成日: 2026-05-20 (UTC)
- 対象Issue: #171
- 関連Issue/PR: #169 / PR #170
- 記録者: Codex（AI補助、最終承認/実行は人間のみ）

## 1. 判定サマリ

- 公開実行前Go判定: **No-Go継続**
- 判定時刻 (UTC): 2026-05-20T00:00:00Z
- 判定理由（deploy実行ログURLは判定条件に含めない）:
  1. 人間最終Go承認（承認者・承認日時・承認記録URL/Issueコメント・承認範囲）のRepository保存を確認できない。
  2. 本番公開URL一致証跡（`NEXT_PUBLIC_SITE_URL` と本番URL一致）のRepository保存を確認できない。
  3. 検索公開設定証跡（`NEXT_PUBLIC_ROBOTS_NOINDEX=false`）のRepository保存を確認できない。
  4. rollback参照コミット / rollback方針のうち、方針は既存文書で確認できるが、人間判定付きの最新記録が未充足。

## 2. Issue #171 要求項目ごとの記録

前提: 推測補完を行わず、Repository上の一次記録のみを根拠とする。

### 2.1 人間最終Go承認

- 承認者: **未確認**
- 承認日時 (UTC): **未確認**
- 承認記録URLまたはIssueコメント: **未確認**
- 承認範囲: **未確認**
- 充足判定: **未充足**

### 2.2 本番公開URL一致証跡

- 確認対象本番URL: `https://nte-build-score-calculator.vercel.app`
- 実環境で確認したURL証跡: **未確認**
- 一致判定: **未確認**
- 充足判定: **未充足**

### 2.3 検索公開設定証跡

- 確認対象: `NEXT_PUBLIC_ROBOTS_NOINDEX=false`
- 実環境確認証跡: **未確認**
- 判定: **未確認**
- 充足判定: **未充足**

### 2.4 rollback参照コミット / rollback方針

- rollback参照コミット（既存記録）: `e5220c18704ca0185ad257b2f72c4c3809a60648`
- rollback方針参照先: `docs/reports/2026-05-18-issue-158-official-release-go-no-go-and-deploy-plan.md` の「9. rollback条件とrollback手順」
- 人間判定（要否・判定者・時刻）: **未確認**
- 充足判定: **一部充足（参照コミット/方針は記録済み、最新の人間判定記録は未充足）**

## 3. 公開実行前Go判定（Issue #171 結論）

- 判定: **No-Go継続**
- 判定根拠:
  - 公開実行前Go判定に必要な4条件（人間最終Go承認 / 本番公開URL一致証跡 / 検索公開設定証跡 / rollback参照コミット・方針）のうち、3条件が未充足、1条件が一部充足。
  - deploy実行ログURLは公開実行後確認項目であり、本判定条件には含めていない。

## 4. 不足項目と再開条件

### 不足項目

1. 人間最終Go承認（承認者・日時・URL/Issueコメント・承認範囲）
2. 本番公開URL一致証跡
3. `NEXT_PUBLIC_ROBOTS_NOINDEX=false` の検索公開設定証跡
4. rollback要否の人間判定（判定者・日時・判定理由）

### 再開条件

- 上記4項目がRepositoryに保存され、公開実行前Go判定4条件がすべて確認済みになること。
- 充足後に公開実行Issueを作成、または既存の公開実行Issueへ進行すること。

## 5. 非実施項目

- 実際の公開作業（deploy実行）
- 本番設定変更
- deploy実行ログURLの公開実行前Go判定条件への再追加
- 法務判断の確定
- OCR / DB / auth / infra / deployment / 保存payload / ランキング仕様の変更

## 6. テスト実行記録

- `pnpm lint`: **未実行（環境制約）**
- `pnpm test`: **未実行（環境制約）**
- `pnpm build`: **未実行（環境制約）**

環境制約詳細:
- `corepack` が `https://registry.npmjs.org/pnpm/-/pnpm-10.1.0.tgz` 取得時に `Proxy response (403) !== 200 when HTTP Tunneling` で失敗し、pnpmコマンドを実行できない。
