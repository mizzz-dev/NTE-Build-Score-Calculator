# AIプロンプトログ: Issue #137 正式リリース前 品質・SEO・規約表示確認

- 作成日: 2026-05-15
- 対象Issue: #137
- 実行者: Codex

## 1. 入力プロンプト（要約）

- `docs/ai-protocol/PROMPT.txt` を最優先で遵守。
- `/score` `/card` `/compare` の主要導線、OCR使用/未使用導線、OCRメタ非混入、低信頼度自動確定禁止を確認。
- 非公式ファンツール表記、規約/免責/プライバシー、SEO/metadata、secret管理、`.env.local` 未コミットを確認。
- 不足があれば優先度付き改善Issue候補を整理。
- `docs/current-status.md` `docs/active-issues.md` 更新、作業ログ・AIログ保存。

## 2. 判断方針

1. 監査・可視化を主目的とし、禁止領域（OCRアルゴリズム、信頼度計算、DB/auth/infra/deployment、payload仕様、ランキング仕様）へ変更を加えない。
2. 法務判断は確定せず「要確認」として整理。
3. 実装修正が必要な項目は別Issue/小PR候補として分離。

## 3. 実行コマンド

1. `cat AGENTS.md`
2. `cat docs/ai-protocol/PROMPT.txt`
3. `cat docs/current-status.md`
4. `cat docs/active-issues.md`
5. `cat docs/runbooks/compare-ocr-release-runbook.md`
6. `cat docs/runbooks/compare-ocr-monthly-audit-runbook.md`
7. `cat docs/logs/compare-ocr-monthly-audit-template.md`
8. `rg --files | rg "(page|layout)\.tsx$|metadata|robots|sitemap|manifest|contact|terms|privacy|disclaimer"`
9. `cat src/app/layout.tsx`
10. `cat src/app/score/page.tsx`
11. `cat src/app/card/page.tsx`
12. `cat src/app/compare/page.tsx`
13. `cat src/components/layout/AppHeader.tsx`
14. `cat src/components/layout/AppFooter.tsx`
15. `rg -n "payload|shared|ranking|confidence|matchType|rawText|candidates|reviewAcknowledged|requiresManual|OCR" src/features src/lib`
16. `pnpm lint`
17. `pnpm test`
18. `pnpm build`
19. `git ls-files | rg "\.env\.local$|\.env$|\.env\..*"`

## 4. 実行結果サマリ

- 主要導線/OCR補助導線の存在、手動入力fallback、未解決項目の自動反映禁止、確認済みチェック要求を確認。
- payload builderテスト実装およびUI文言から、OCRメタ非混入方針を確認。
- 非公式表記はヘッダー/フッターで確認。
- metadata/OGP/規約ページ群は公開前整備余地ありと判定。
- `.env.local` 未コミット、Supabase Anon Key前提実装を確認。
- `pnpm lint/test/build` は環境要因（corepackのpnpm取得失敗: 403）で実行不能。
