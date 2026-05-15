# Issue #127 作業ログ（/compare OCR 正式展開後の監視運用定常化）

- 作成日: 2026-05-15
- 対象Issue: #127
- 関連Issue/PR: #125, #126
- 参照: `docs/runbooks/compare-ocr-release-runbook.md`, `docs/logs/compare-ocr-release-decision.md`

## 1. 実施概要

Issue #125 / PR #126 で確定した「条件付き正式展開可」判定を前提に、正式展開後の監視運用を定常化するドキュメント整備を実施した。
本Issueでは実装変更を行わず、監査ログ観点・しきい値超過時の改善Issue化方針・互換性継続確認観点・残リスク改善方針を整理した。

## 2. 監査ログ項目（正式展開後に記録）

以下を 1営業日単位で集計し、しきい値超過時は当日追記する。

1. 計測メタ
   - 計測日（JST）
   - 対象画面（`/compare`）
   - 対象導線（OCR有効/無効）
2. KPI実測値
   - OCR処理時間 p95（全体/低/中/高性能端末）
   - A/B取り違え誤反映率
   - 未確定項目残存率（比較直前）
   - 比較前確認離脱率
   - fallback率
   - 手動補正率
3. しきい値判定
   - 通常/警戒/rollback の判定区分
   - 連続超過日数
4. 要因内訳（`compareOcrObservability` 分類に合わせる）
   - fallback要因
   - 比較前確認離脱要因
5. 互換性確認結果
   - 保存payload非混入（`confidence` 等OCRメタ）
   - 共有URLキー構造・エンコード互換
   - ランキングpayload構造・型・必須項目互換
6. 運用アクション
   - 実施アクション（監視継続 / 改善Issue起票 / rollback検討 / rollback実施）
   - 担当者・実施時刻

## 3. しきい値超過時の改善Issueテンプレート方針

改善Issueは運用Runbook 3章に従い、2営業日連続で警戒しきい値を超過した場合に起票する。

### 3.1 テンプレート必須項目

- タイトル: `[compare-ocr][ops] KPI超過改善: <KPI名> (<YYYY-MM-DD>)`
- 背景: どのしきい値を、何日連続で超過したか
- 影響: 対象端末カテゴリ、ユーザー影響（離脱/fallback/誤反映リスク）
- 観測データ: 直近5営業日の推移（表）
- 互換性確認: payload/共有URL/ランキングの継続互換結果
- 暫定対応: 即日対応済み内容
- 恒久対応候補: 次Issueで扱う改善案（本Issueでは実装しない）
- DoD: KPI再収束条件、再計測期間、rollback回避条件
- 非変更宣言: OCRアルゴリズム・DB/auth/infra/deployment・保存payload・ランキング仕様を変更しない

### 3.2 優先度付け

- P0: A/B取り違え誤反映率 > 0.0% または未確認OCR値混入
- P1: rollbackしきい値超過（p95低性能端末 / fallback率 / 離脱率 / 未確定残存率）
- P2: 警戒しきい値の連続超過（rollback未満）

## 4. payload非混入・共有URL互換・ランキング互換の継続確認観点

1. 保存payload
   - OCR利用有無に関わらず、永続payloadへ `confidence` `matchType` `raw text` `candidates` を含めない。
2. 共有URL
   - キー構造・順序・エンコード仕様を固定し、OCRメタキーを追加しない。
3. ランキングpayload
   - 既存フィールド構造・型・必須項目を変更しない。
4. 確認タイミング
   - しきい値超過時の改善Issue起票時
   - rollback実施時と再開前
   - 月次監査ログ締め時（最低1回）

## 5. 残リスク改善方針（実装は次Issueへ分離）

## 5.1 `unresolved_items_remaining` 起因

- 目的: 比較前確認で未確定が残ることによる離脱率上振れを抑制する。
- 改善方針:
  1. 未確定項目の優先確認順（影響度順）のUI文言設計を強化。
  2. 未確定0件までの残タスク可視化（件数・系統A/B）を改善。
  3. 離脱要因ログを週次でレビューし、上位要因に限定して文言AB改善案を作成。
- 次Issue候補:
  - 候補A（P1）: 「未確定項目解消フローのUX文言改善（アルゴリズム非変更）」
  - 候補B（P2）: 「未確定項目の確認順ガイド最適化と効果測定設計」

## 5.2 `image_quality_low` 起因

- 目的: 低品質画像起因のfallback/手動補正増加を抑制する。
- 改善方針:
  1. OCR実行前チェックの撮影ガイド文言（明るさ・ブレ・枠内収まり）を明確化。
  2. 低品質判定時の再撮影推奨導線を簡潔化し、手動fallback判断を早める。
  3. 低性能端末向けに待機/再試行/手動入力の判断基準を固定文言で提示。
- 次Issue候補:
  - 候補C（P1）: 「image_quality_low低減の事前ガイド改善（OCR実行前UX）」
  - 候補D（P2）: 「低品質判定時の再試行・手動fallback分岐文言の最適化」

## 6. ADR要否判断

- 結論: **ADR不要**
- 理由:
  1. 本対応は運用監視の定常化であり、アーキテクチャ変更を伴わない。
  2. OCRアルゴリズム、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は未変更。
  3. 判断根拠は本ログおよびRunbookへ追記可能で、設計原則の恒久変更がない。

## 7. 変更禁止領域の遵守記録

本Issueでは以下を変更していない。

- OCRアルゴリズム
- DB migration
- auth / infra / deployment 設定
- 保存payload仕様
- ランキング仕様
- 画像保存方式
- 外部OCR API連携
- `/card` 既存OCR導線

## 8. テスト・検証コマンド

- `pnpm lint`: 実行失敗（環境要因: corepack経由のpnpm取得時にProxy 403）
- `pnpm test`: 実行失敗（環境要因: corepack経由のpnpm取得時にProxy 403）
- `pnpm build`: 実行失敗（環境要因: corepack経由のpnpm取得時にProxy 403）

