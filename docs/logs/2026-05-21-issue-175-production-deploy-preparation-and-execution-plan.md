# Issue #175 本番deploy準備と公開実行手順 作業ログ

- 作成日: 2026-05-21 (UTC)
- 対象Issue: #175
- 記録者: Codex（AI補助。最終承認/最終実行は人間のみ）

## 1. 実施概要

Issue #173フォローアップ（PR #174）でNo-Go継続となった背景を受け、公開実行前Go承認に進む前段として本番deploy準備を文書化した。

実施内容:
1. deploy対象環境をProduction（Vercel本番）として明確化
2. deploy対象ブランチを`main`、対象コミットを「公開実行時点の`main` HEAD SHA（人間記録必須）」として明確化
3. deploy実施者/責任者/記録責任者を役割で明確化
4. deploy前確認項目とdeploy後確認項目を分離
5. rollback参照コミットとrollback方針を再確認
6. 非公開情報をRepositoryへ保存しないルールを明文化
7. Issue #158公開手順との整合確認

## 2. 成果物

- Runbook追加:
  - `docs/runbooks/issue-175-production-deploy-preparation-and-execution-plan.md`
- 状態更新:
  - `docs/current-status.md`
  - `docs/active-issues.md`

## 3. 技術判断

- deploy実行ログURLは公開実行後確認項目として扱い、公開実行前Go判定条件へ戻さない。
- 実deployや本番設定変更は実施しない。
- rollback参照コミットは既存記録 `e5220c18704ca0185ad257b2f72c4c3809a60648` を踏襲し、運用一貫性を優先する。

## 4. 禁止事項の遵守確認

以下はいずれも未実施:
- 実際の本番deploy
- 本番設定変更
- 非公開情報の保存
- 法務判断の確定
- OCR/DB/auth/infra/deployment/保存payload/共有URL/ランキング仕様変更

## 5. テスト実行記録

- `pnpm lint`: 未実行（環境制約）
- `pnpm test`: 未実行（環境制約）
- `pnpm build`: 未実行（環境制約）

環境制約詳細:
- pnpm実行に必要なレジストリ取得制約により、当該環境では再現実行不可。
- 代替として、Issue #175の文書更新内容は差分レビューで整合確認した。

## 6. deploy準備判定

- 判定: **準備完了（公開実行前Go承認の前段資料として利用可能）**
- 補足: Go承認自体は人間証跡4条件の提出完了後に別Issue/記録で実施する。

## 7. 残課題

1. 人間最終Go承認（承認者・時刻・URL）
2. 本番公開URL一致証跡
3. `NEXT_PUBLIC_ROBOTS_NOINDEX=false` 証跡
4. rollback要否の人間判定記録
5. 条件充足後の公開実行Issue作成とdeploy実行ログ保存

