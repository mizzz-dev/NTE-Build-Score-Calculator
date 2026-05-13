# ADR-0001: Level 3 AI開発プロトコル導入
- Status: Accepted

## Context
本Repositoryは非公式ファンツールであり、商用運用を見据えると権利・セキュリティ・プライバシー・運用統制が必要。

## Decision
Level 3としてAI開発プロトコルを導入し、作業ログ/AIプロンプトログ/ADRをRepositoryへ保存する。

## Alternatives
- Level 1/2導入: 商用統制が不足するため却下。
- 個別ルール散在: 監査困難のため却下。

## Consequences
運用負荷は増えるが、監査可能性・再現性・商用品質が向上する。

## Risks
非公式ファンツール由来の権利リスク、Supabase認証・環境変数管理不備リスク。

## References
- docs/ai-protocol/adoption-guide.md
- docs/ai-protocol/nte-commercial-policy.md
- docs/risks/risks.md
