# Adoption Guide

## このガイドの目的
NTE-Build-Score-Calculator へ Level 3 のAIネイティブ開発運用を導入し、商用・本番運用に必要な統制を実施するための手順を示します。

## 導入レベル
**Level 3: 商用・本番運用向け**

## まず確認すること
- 非公式ファンツールである
- 公式素材利用可否は要確認
- Supabase設定方針（Anon Keyのみ公開、service role key禁止）
- 環境変数管理（`.env.local`非コミット）
- Node.js / pnpm / Next.js構成
- `pnpm lint` / `pnpm test` / `pnpm build`
- 商用運用時の権利・プライバシー・セキュリティ

## 導入後の基本運用
Issue → Discussion → ADR → 実装PR → lint/test/build → security/privacy/license確認 → release readiness確認 → merge → branch cleanup → handoff保存

## AIに作業を依頼する方法
以下のNTE-Build-Score-Calculator開発プロトコルに従って作業してください。
参照:
- docs/ai-protocol/PROMPT.md
- docs/ai-protocol/nte-commercial-policy.md
- docs/ai-protocol/core/definition-of-done.md
対象Issue:
{{ISSUE_URL}}
作業内容:
{{TASK_DESCRIPTION}}
必須:
- PR本文は日本語
- commit messageは日本語
- 作業ログを保存
- AIプロンプトログを保存
- 必要な判断はADRへ保存
- 非公式ファンツールとしての権利リスクを確認
- Supabaseや環境変数に関するsecret漏洩を防止
- pnpm lint / pnpm test / pnpm build を確認

## Level 3 チェックリスト
- security
- privacy
- license
- commercial readiness
- release readiness
- incident response
- support readiness
- rollback
- monitoring
- cost

## 導入後に最初に作るIssue
「商用運用に向けた権利・利用規約・公式素材利用可否を整理する」

## 導入後に最初に作るADR
ADR-0001: Level 3 AI開発プロトコルを導入する

## 日常運用
- Issue起票
- AIプロンプト保存
- 作業ログ保存
- PR作成
- 商用チェック
- merge後branch cleanup
- handoff保存
