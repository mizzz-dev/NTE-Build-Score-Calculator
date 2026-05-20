# Issue #169 作業ログ（deploy前Go判定条件とdeploy後確認項目の分離）

- 作業日: 2026-05-20 (UTC)
- 対象Issue: #169
- 関連PR: （この作業PR）
- 実施者: Codex（AI補助）

## 1. 実施内容

1. `docs/runbooks/official-release-approval-and-evidence-submission-template.md` を修正し、公開実行前Go判定条件から `deploy実行ログURL` を除外。
2. deploy前必須条件を以下4点に整理。
   - 人間最終Go承認
   - 本番公開URL一致証跡
   - 検索公開設定証跡
   - rollback参照コミット / rollback方針の確認
3. `deploy実行ログURL` 記録を「公開実行後確認」文脈へ移動。
4. 最終判定チェックを2段階へ分離。
   - 公開実行前Go判定チェック
   - 公開実行後確認チェック
5. 保存可/保存不可情報の方針は変更なし。
6. `docs/current-status.md` と `docs/active-issues.md` を更新。

## 2. Issue #158 との整合

- Issue #158 の `8.1 deploy前確認` と `8.2 deploy中確認` / `8.3 deploy後確認` の区分に合わせ、
  deploy未実施時点で存在しないログURLを公開前必須条件から除外した。
- これにより、公開前No-Go解除不能となる運用矛盾を解消した。

## 3. 非実施項目

- 実deploy / 本番設定変更
- 法務判断の確定
- OCR / DB / auth / infra / deployment 設定変更

## 4. テスト・確認結果

- `pnpm lint`: 未実行（本対応はドキュメント変更のみのため）
- `pnpm test`: 未実行（同上）
- `pnpm build`: 未実行（同上）
- 変更差分の目視確認: 実施済み

## 5. 要確認

- PR #168 レビューコメント本文は、ローカル環境で `gh` コマンド未導入のためCLI取得不可。GitHub UI上の指摘趣旨（deploy前後条件分離）に基づき修正。
