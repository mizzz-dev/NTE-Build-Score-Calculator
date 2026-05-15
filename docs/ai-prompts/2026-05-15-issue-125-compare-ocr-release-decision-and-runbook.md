# AIプロンプトログ（Issue #125）

- 記録日: 2026-05-15
- 対象Issue: #125
- 目的: `/compare` OCR正式展開可否を最終判定し、監視条件・rollback条件・運用Runbookを文書化する。

## 入力プロンプト（要約）

- `docs/ai-protocol/PROMPT.txt` を最優先遵守。
- 第1〜第3サイクルKPI推移を整理。
- 判定区分（正式展開可 / 条件付き正式展開可 / 追加改善後に再判定 / rollback候補）で最終判定。
- 判定理由、前提、制約、残リスク、監視KPI、閾値、超過時対応、rollback条件/手順を整理。
- `/compare` OCR導線無効化時の確認手順、payload/URL/ランキング互換の最低回帰確認手順を整備。
- `docs/runbooks/compare-ocr-release-runbook.md` と `docs/logs/compare-ocr-release-decision.md` を作成。
- `docs/current-status.md` と `docs/active-issues.md` を更新。
- ADR要否を判断し、不要時も理由を記録。

## 出力・実施結果（要約）

1. 判定を「条件付き正式展開可」として決定。
2. 第1〜第3サイクルKPI推移表を記録。
3. 監視KPI、警戒しきい値、rollbackしきい値を定義。
4. 閾値超過時の運用対応、rollback条件、rollback手順を明文化。
5. OCR導線無効化確認手順と互換性最低回帰確認手順をRunbook化。
6. ADR不要判断（運用判断ドキュメント化のみで設計変更なし）を記録。

## 備考

- OCRアルゴリズム、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は未変更。
- テストコマンドは環境要因（Proxy 403）で未実行。
