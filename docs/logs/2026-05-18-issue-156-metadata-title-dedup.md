# Issue #156 作業ログ（metadata title重複解消）

- 日付: 2026-05-18
- 対象Issue: #156
- 関連PR: （この作業で作成）

## 背景
PR #155 のレビューで、`/score` `/card` `/compare` の `metadata.title` にサイト名を含めているため、root layoutの `title.template`（`%s | NTE Build Score Calculator`）と組み合わさった際に、title重複リスクがあると指摘された。

## 実施内容
1. `src/app/layout.tsx` の `title.template` は維持。
2. `src/app/score/page.tsx` の `metadata.title` を `スコア計算` に変更。
3. `src/app/card/page.tsx` の `metadata.title` を `カード管理` に変更。
4. `src/app/compare/page.tsx` の `metadata.title` を `比較` に変更。
5. 各ページの `alternates.canonical` を維持。
6. `docs/current-status.md` と `docs/active-issues.md` を更新。

## 確認結果
- title.template方針とページtitleが整合。
- canonicalは `/score` `/card` `/compare` で維持。

## 非対応（意図的に未実施）
- 本番deploy
- 本番環境変数変更
- 法務判断の確定
- OCR/DB/auth/infra/deployment/ランキング仕様変更

## 実行コマンド
- `pnpm lint`
- `pnpm test`
- `pnpm build`
