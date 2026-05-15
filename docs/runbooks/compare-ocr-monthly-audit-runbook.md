# `/compare` OCR 月次監査 Runbook（Issue #135）

- 作成日: 2026-05-15
- 対象Issue: #135
- 関連: #125, #127, #129, #131, #133
- 対象: 条件付き正式展開後の `/compare` OCR 監視運用（月次サイクル）
- 前提: OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、共有URL仕様、ランキング仕様は変更しない
- 方針: 本Repositoryは非公式ファンツール。公式素材利用可否は「要確認」

## 1. 目的

条件付き正式展開後の `/compare` OCR 運用を、日次断面の監視から月次監査サイクルへ移行し、以下を継続管理する。

1. KPIのしきい値判定（通常/警戒/rollback）
2. payload互換・共有URL互換・ランキングpayload互換
3. 改善Issueの起票判断
4. rollback要否判断

## 2. 月次サイクル（実施タイミング）

1. **月初第1営業日**: 前月分の監査ログを集計開始。
2. **月初第2営業日まで**: `docs/logs/compare-ocr-monthly-audit-template.md` を複製して月次ログを作成。
3. **月初第3営業日まで**: しきい値判定、改善Issue起票、rollback要否を確定。
4. **確定当日**: `docs/current-status.md` / `docs/active-issues.md` / 必要なIssueリンクを更新。

> しきい値超過が月中に発生した場合は、月次締めを待たずに運用Runbook（`docs/runbooks/compare-ocr-release-runbook.md`）3章・5章に従って即時対応する。

## 3. 監査データの取り扱い

- 記録は**匿名・集計値のみ**を扱う。
- 画像、個人情報、アカウント情報、原文OCRテキストはRepositoryへ保存しない。
- 永続payloadへ `confidence` `matchType` `raw text` `candidates` などOCRメタを混入させない。

## 4. 月次監査で必須確認する項目

1. 対象期間
2. 計測対象画面
3. fallback率
4. 手動補正率
5. 比較前確認離脱率
6. A/B取り違え誤反映率
7. 未確認OCR値の比較計算混入有無
8. 保存payload・共有URL・ランキングpayload互換確認
9. しきい値判定（通常/警戒/rollback）
10. 発生した改善Issue
11. rollback要否
12. 次月アクション

## 5. 警戒しきい値超過時の対応（rollback未満）

1. 当日中に月次ログの「イベント」欄へ超過記録（日時、KPI、端末傾向、想定要因）を追記。
2. 翌営業日までに暫定対処（文言調整、導線再案内、監視強化）を記録。
3. 2営業日連続超過で改善Issueを起票（ラベル例: `ocr`, `compare`, `ops`）。
4. 改善Issue起票時点で payload/共有URL/ランキングpayload の互換再確認を実施。

## 6. rollbackしきい値超過時の対応

1. `docs/runbooks/compare-ocr-release-runbook.md` 5章に従い、`/compare` OCR導線の停止可否を即時判定。
2. A/B取り違え誤反映または未確認OCR値混入を1件でも検知した場合は、同日中にrollback判定会を実施。
3. rollback実施時は、停止理由・影響範囲・再開条件・互換確認結果を月次ログへ追記。
4. 再開前に保存payload/共有URL/ランキングpayload互換を再確認。

## 7. 改善Issue起票基準

### 7.1 P0（即日起票）
- A/B取り違え誤反映率 > 0.0%（1件でも発生）
- 未確認OCR値の比較計算混入を1件でも検知
- 保存payload / 共有URL / ランキングpayloadの互換破壊を検知

### 7.2 P1（2営業日連続で起票）
- rollbackしきい値超過（低性能端末p95、fallback率、比較前確認離脱率、未確定項目残存率）

### 7.3 P2（2営業日連続で起票）
- 警戒しきい値超過（rollback未満）

## 8. payload互換確認の実施タイミング

1. **月次締め時（必須）**: 毎月最低1回。
2. **警戒しきい値2営業日連続超過時**: 改善Issue起票と同時。
3. **rollback実施時**: 停止判断時と再開前の2回。

## 9. ロールバック手順（参照）

- 実操作は `docs/runbooks/compare-ocr-release-runbook.md` の5章・6章・7章を正本とする。
- 月次Runbookでは「判断・記録・Issue化」の運用統制を担当する。
