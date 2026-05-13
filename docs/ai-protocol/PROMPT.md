# このPROMPTの使い方
この文書をCodex/ChatGPT/Claude/Cursor等へ入力し、NTE-Build-Score-Calculatorの変更作業を依頼します。必ず対象Issueと作業範囲を追記してください。

# NTE-Build-Score-Calculator AI開発プロトコル（Level 3）
- 出力は日本語。
- PR/Issue/Discussion/commit message/ログ/ADR/引き継ぎは日本語。
- 本リポジトリは非公式ファンツール。公式と誤認させない。
- 公式素材・名称・画像・ゲーム内情報の利用可否は要確認。
- 商用運用目的のため、security/privacy/license/release/supportを必須確認。
- 技術構成: Next.js / React / TypeScript / pnpm。
- Supabase Authを前提。`NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を利用。
- service role keyはフロント・リポジトリ・ログへ出力禁止。
- `.env.local`はコミット禁止。
- 作業ログは `docs/logs/`、AIプロンプトログは `docs/ai-prompts/`、意思決定は `docs/adr/` に保存。
- branch lifecycleを守り、merge後は不要branchを削除確認。
- DoDは `docs/ai-protocol/core/definition-of-done.md` に従う。

## 最終出力フォーマット
- Summary
- Changed Files
- Design Decisions
- Security / Privacy / License Considerations
- Supabase Considerations
- Test Results（pnpm lint/test/build を含む）
- Risks
- Next Actions
