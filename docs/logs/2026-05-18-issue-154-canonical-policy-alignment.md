# 2026-05-18 Issue #154 作業ログ（canonical方針整合）

## 1. 対応概要
- PR #153のレビュー指摘（主要機能ページcanonical coverage不整合）への対応。
- `/score` `/card` `/compare` にページ単位の自己canonical metadataを追加。
- Go判定レポートのcanonical記載を実装状態へ同期。
- `docs/current-status.md` と `docs/active-issues.md` を更新。

## 2. 変更ファイル
- `src/app/score/page.tsx`
- `src/app/card/page.tsx`
- `src/app/compare/page.tsx`
- `docs/reports/2026-05-18-issue-152-go-no-go-final-readiness.md`
- `docs/current-status.md`
- `docs/active-issues.md`

## 3. 技術判断
- root layout (`src/app/layout.tsx`) にはcanonicalを設定せず、ページ単位で自己canonicalを定義する既存方針を維持。
- 規約系ページ（`/terms` `/privacy` `/disclaimer`）の自己canonical方針は変更なし。
- SEO方針とGo判定レポート根拠の整合を優先。

## 4. 非実施確認
- 本番deploy未実施。
- 本番環境変数未変更。
- 法務判断確定なし（要確認維持）。
- OCR/DB/auth/infra/deployment/payload/ランキング仕様の変更なし。
