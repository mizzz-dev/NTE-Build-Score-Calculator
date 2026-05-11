# スコア計算仕様（詳細設計・Issue #3）

## 1. 目的
NTE Build Score Calculator における評価ロジックを、実装可能な粒度で定義する。  
本仕様は PR #1 の要件定義および PR #5 のルーティング・画面設計を前提とし、実装前の詳細設計として扱う。

## 2. 適用範囲
- 計算対象: 装備1個単位 / キャラ全体ビルド
- 評価軸: ロール別評価 / キャラ別評価
- スコア構成: メインステータス一致、サブステータス重み、セット効果・装備効果
- ランク化: 10段階（最大 SS）
- 設定管理: 重み・閾値・優先順位・保存方針

## 3. 用語定義
- **装備カテゴリ**: Cartridge / Module / Gear / Console
- **メインステータス**: 装備に1つ設定される主要ステータス
- **サブステータス**: 装備に複数付与される補助ステータス
- **評価プロファイル**: ロール別・キャラ別の重みセット
- **正規化値 (Normalized Value)**: 入力値を 0.0〜1.0 に圧縮した値
- **有効重み和 (Active Weight Sum)**: 評価対象になったステータス重み合計

## 4. 前提ルール（入力・バリデーション）
1. ステータスは `%` と固定値を別キーで管理する。  
2. 同一装備内の同一サブステータス重複は不可。  
3. 入力値の最小値/最大値/小数桁はマスタ設定で管理し、計算時にクランプする。  
4. 小数演算は内部で `number` を利用し、表示は別途フォーマット層で丸める。  
5. 未登録ステータスはスコア計算対象外（warning を返す）。

## 5. 装備1個単位のスコア計算モデル

### 5.1 スコア構成
装備スコアは以下の合計で算出する。

`equipmentScoreRaw = mainScore + subScore + setBonusScore + equipmentEffectScore`

- `mainScore`: メインステータス一致ボーナス + メイン値評価
- `subScore`: サブステータス重み評価
- `setBonusScore`: セット効果による加点
- `equipmentEffectScore`: 個別装備効果による加点

### 5.2 正規化関数
各ステータス値を以下で正規化する。

`normalize(value, min, max) = clamp((value - min) / (max - min), 0, 1)`

- `min == max` の場合は `0` を返し、設定異常として warning を返す。
- `%` と固定値で `min/max` は別管理する。

### 5.3 メインステータス一致ボーナス

`mainScore = mainMatchBonus + mainValueScore`

- `mainMatchBonus`:
  - 一致: `profile.mainStat.matchBonus`
  - 不一致: `profile.mainStat.mismatchBonus`（通常 0 想定）
- `mainValueScore`:
  - `profile.mainStat.valueWeight * normalize(mainValue, range.min, range.max)`

> 補足: 一致判定は「そのスロットに対して許容される推奨メインステータス群」に含まれるかで判定する。

### 5.4 サブステータス重み付け

各サブステータスについて:

`subContribution = subWeight * normalize(subValue, subRange.min, subRange.max)`

`subScore = (Σ subContribution / ActiveWeightSum) * profile.subStat.scale`

- `subWeight`: 評価プロファイルのステータス重み
- `ActiveWeightSum`: 入力に存在したサブステータスの重み合計
- 対象サブステータスが 0 件の場合は `subScore = 0`
- 入力に存在しても重み未定義なら 0 として扱い warning を返す

### 5.5 セット効果・装備効果

`setBonusScore = Σ matchedSetRule.score`

`equipmentEffectScore = Σ matchedEffectRule.score`

- マッチ条件は設定データ（効果ID・必要部位数・閾値）で定義
- 同一ルール多重加点は `stackPolicy` に従う
  - `none`: 重複加点なし
  - `additive`: 加算
  - `maxOnly`: 最大値のみ採用

## 6. キャラ全体ビルドの合算仕様

### 6.1 基本式

`buildScoreRaw = Σ(slotWeight[slot] * equipmentScoreRaw[slot]) + buildSynergyScore`

- `slotWeight`: 装備カテゴリごとの重み
- `buildSynergyScore`: 全体シナジー（セット成立数など）の加点

### 6.2 欠損スロット
- 未装備スロットは `equipmentScoreRaw = 0` で扱う
- `missingSlotPenalty` を設定可能（デフォルト 0）

### 6.3 スケーリング
- UI比較用に 0〜100 へ変換した `buildScoreNormalized` を持つ
- 変換式:

`buildScoreNormalized = clamp((buildScoreRaw / profile.referenceMaxScore) * 100, 0, 100)`

## 7. ロール別評価とキャラ別評価の優先順位

### 7.1 適用順
1. キャラ別プロファイル（存在する場合）
2. ロール別プロファイル
3. グローバルデフォルト

### 7.2 マージポリシー
- 基本は「上位優先の上書き」
- `mergeMode = deep-merge`
- 未定義キーは下位プロファイル値を継承

### 7.3 理由
- キャラ固有の最適化を優先しつつ、未設定キャラでもロール評価を成立させるため

## 8. 10段階ランク（最大 SS）

## 8.1 ランク一覧
低い順に以下の10段階。

`D, C, C+, B, B+, A, A+, S, S+, SS`

### 8.2 閾値評価式
`buildScoreNormalized` に対して閾値を適用する。

```text
if score >= threshold["SS"] then "SS"
else if score >= threshold["S+"] then "S+"
...
else "D"
```

### 8.3 初期閾値（暫定・運用で調整）
- SS: 95
- S+: 90
- S: 85
- A+: 78
- A: 70
- B+: 62
- B: 54
- C+: 46
- C: 38
- D: 0

> 注記: 上記はサービス内比較用の初期案。実データ分布検証後に管理画面から調整する。

## 9. カスタム重み付けの保存・適用方針

### 9.1 保存単位
- 保存対象: `subStatWeights`, `mainStat.matchBonus`, `slotWeights`（必要最小限）
- 保存スコープ:
  - ログインユーザー: サーバー保存
  - ゲスト: ローカル保存

### 9.2 適用優先順位
1. セッションで明示選択したカスタム
2. ユーザーデフォルトカスタム
3. システム標準プロファイル

### 9.3 バージョニング
- `configVersion` を保持し、適用時に不一致なら再計算 warning を表示

## 10. 設定データ構造（TypeScript 型イメージ）
```ts
export type StatKey = string;
export type SlotType = "cartridge" | "module" | "gear" | "console";

export interface StatRange {
  min: number;
  max: number;
  valueType: "flat" | "percent";
}

export interface MainStatRule {
  allowedMainStatsBySlot: Record<SlotType, StatKey[]>;
  matchBonus: number;
  mismatchBonus: number;
  valueWeight: number;
}

export interface SubStatRule {
  weights: Record<StatKey, number>;
  scale: number;
}

export interface SetBonusRule {
  ruleId: string;
  setId: string;
  requiredPieces: number;
  score: number;
  stackPolicy: "none" | "additive" | "maxOnly";
}

export interface EquipmentEffectRule {
  ruleId: string;
  effectId: string;
  score: number;
  stackPolicy: "none" | "additive" | "maxOnly";
}

export interface RankThreshold {
  rank: "D" | "C" | "C+" | "B" | "B+" | "A" | "A+" | "S" | "S+" | "SS";
  minScore: number;
}

export interface ScoreProfile {
  profileId: string;
  roleId?: string;
  characterId?: string;
  mainStat: MainStatRule;
  subStat: SubStatRule;
  slotWeights: Record<SlotType, number>;
  missingSlotPenalty: number;
  referenceMaxScore: number;
  setBonusRules: SetBonusRule[];
  equipmentEffectRules: EquipmentEffectRule[];
  rankThresholds: RankThreshold[];
  configVersion: string;
}

export interface CustomWeightPreset {
  presetId: string;
  ownerUserId?: string;
  name: string;
  baseProfileId: string;
  overrides: Partial<Pick<ScoreProfile, "mainStat" | "subStat" | "slotWeights">>;
  updatedAt: string;
}
```

## 11. 要確認事項（未確定仕様の分離）
1. 正式ダメージ計算式との整合が必要か（現時点は独立スコアとして設計）
2. キャラ別推奨メイン/サブステータスの公式根拠
3. セット効果・装備効果IDの命名規則とデータ取得元
4. ステータス上下限・丸め規則（ゲーム実値ベース）
5. 同一効果重複時の実ゲーム挙動（stackPolicy 初期値の妥当性）

## 12. 単体テスト観点（計算ロジック）
1. `normalize` の境界値（min未満 / min / max / max超過 / min=max）
2. メイン一致・不一致で `mainMatchBonus` が切り替わること
3. サブステータス0件時に `subScore=0` となること
4. 重み未定義サブステータスが warning となり計算継続すること
5. `stackPolicy` ごとの加点結果が仕様どおりであること
6. 欠損スロット時の `missingSlotPenalty` 適用
7. プロファイル優先順位（キャラ > ロール > デフォルト）
8. ランク閾値境界（例: 89.99 と 90.00）
9. `configVersion` 不一致時の再計算警告
10. 同一入力で決定論的に同一出力となること

## 13. 実装引き継ぎメモ
- 先行実装は本仕様の型・式・優先順位をそのままトレースする。
- 未確定項目は「要確認」解決後に値を確定し、先に仮実装しない。

## 計算ロジックのテスト方針（Issue #14）
- `src/lib/score` の純関数に対して単体テストを追加し、境界値・一致判定・優先順位・ランク閾値・警告出力を検証する。
- UIコンポーネントには計算ロジックを置かず、`lib/score` を呼び出す構成を維持する。

## 12. Issue #53: 公開マスタ接続前の設計整理（実装前提）

### 12.1 対象と非対象
- 対象: スコア計算ロジックへ公開マスタ・スコア重みを接続するための設計整理、影響範囲整理、移行手順整理。
- 非対象: `calculateBuildScore` への接続実装、計算結果変更、DB migration、管理画面 CRUD 変更。

### 12.2 `sampleScoreConfig` 利用箇所（現状）
`sampleScoreConfig` は「計算本体の入力設定」と「UI/共有入力バリデーションの暫定キー集合」の両方で使われている。主な利用箇所は以下。

- 計算実行（`calculateBuildScore` の第2引数）
  - `src/features/score/components/ScorePageContainer.tsx`
  - `src/features/card/components/CardPageContainer.tsx`
  - `src/features/compare/lib/compareCalculator.ts`
- 画面入力・共有データの `StatKey` 制約
  - `src/features/score/components/ScorePageContainer.tsx`
  - `src/features/card/components/CardPageContainer.tsx`
  - `src/features/compare/components/ComparePageContainer.tsx`
  - `src/features/score/share/mapper.ts`
- 公開マスタ取得失敗時のフォールバック生成
  - `src/features/public-master/api.ts`
- テスト基準設定
  - `src/lib/score/index.test.ts`

設計上の問題は「計算用設定の責務」と「UI入力のキー集合定義」が同一オブジェクトに混在している点である。

### 12.3 公開マスタ → 計算用設定への変換方針
`ScoreConfig` を直接 UI で保持せず、公開マスタの生データから「計算実行直前に生成」する方針とする。

- 新規責務（設計）
  - `ScoreConfigFactory`（仮名）を追加し、入力を `PublicMasterBundle`、出力を `ScoreConfig` とする。
  - 変換は純関数化し、副作用（I/O）を持たせない。
- 変換対象
  - `statRanges`
  - `defaultProfile`
  - `roleProfiles`
  - `characterProfiles`
  - `expectedConfigVersion`
- バリデーション
  - 必須キー欠落時は warning を返し、欠落フィールド単位で fallback 補完する。
  - 変換結果は `configVersion` を付与し、`expectedConfigVersion` と比較可能にする。

### 12.4 スコア重み profile 設計方針
プロファイルは「継承 + 上書き」を維持する。

1. グローバルデフォルト
2. ロール別
3. キャラクター別

重みは以下を独立フィールドで管理し、変換時に `ScoreProfile` へ畳み込む。

- メインステータス重み
  - `allowedMainStatsBySlot`, `matchBonus`, `mismatchBonus`, `valueWeight`
- サブステータス重み
  - `weights`, `scale`
- セット効果重み
  - `setBonusRules[]`
- 装備効果重み
  - `equipmentEffectRules[]`
- ロール別重み
  - `roleProfiles[]`（`roleId` 必須）
- キャラクター別重み
  - `characterProfiles[]`（`characterId` 必須）

### 12.5 公開マスタ不足時の fallback 方針
ユーザー向け計算結果の急変を避けるため、段階的 fallback を採用する。

1. 公開マスタ由来の値
2. リポジトリ内の `sampleScoreConfig`（暫定安全網）
3. 最小計算可能デフォルト（最終防御。0点固定ではなく計算継続）

- 方針決定: 当面 `sampleScoreConfig` は**完全置換しない**。実装フェーズでは fallback として残し、公開マスタの運用安定後に削除可否を再評価する。
- warning ルール
  - fallback 発生時は warning code を返却し、ログ/監視対象にする。

### 12.6 `calculateBuildScore` の責務整理
- 維持する責務
  - 与えられた `ScoreConfig` を用いた純粋な計算。
  - profile 解決、スロット集計、rank 判定、warning 集約。
- 追加しない責務
  - 公開マスタ取得、整形、fallback 判定。

結論として、`calculateBuildScore` は維持し、前段に「設定生成層（Factory/Resolver）」を追加する。

### 12.7 結果変動リスクの影響範囲
設定値ソースが切り替わることで、以下に結果差分が出る可能性がある。

- `/score`: 単体計算結果・rank
- `/compare`: 並列比較時の相対順位
- `/card`: 表示用スコア/ランク
- ランキング投稿: 保存時スコア値
- クラウド保存: 保存済み build の再計算結果
- ゲスト履歴: ローカル再表示時の再計算結果
- URL共有: 復元後再計算時の値

対策:
- 初期フェーズは `scoreConfigVersion` をレスポンス/保存データに併記し、同一 version 前提で比較する。
- version 不一致時は再計算 warning を表示（既存仕様踏襲）。

### 12.8 既存保存データとの互換性方針
- 既存データ形式（入力ステータス値、部位、効果ID等）は変更しない。
- 保存データに `scoreConfigVersion` が無い過去データは `legacy` 扱いで読み込み可能にする。
- 互換モードでは以下を実施:
  - 計算時は最新公開マスタ + fallback で再計算
  - 旧スコア値を保持している場合は「参考値」として扱い、再計算値を優先表示
- 共有 URL はクエリ構造を維持し、サーバー/クライアント側で version 補完する。

### 12.9 実装PR分割案
1. **PR-A: 設定生成層追加（非接続）**
   - `ScoreConfigFactory` 実装 + 単体テスト
   - 公開マスタ不足時 fallback/warning 実装
2. **PR-B: 計算呼び出し経路の差し替え**
   - `/score` `/compare` `/card` の `sampleScoreConfig` 直参照を Factory 経由へ変更
   - 既存結果維持の回帰テスト
3. **PR-C: 永続化・共有の version 互換対応**
   - ランキング投稿、クラウド保存、ゲスト履歴、URL共有に `scoreConfigVersion` 連携
4. **PR-D: fallback 縮退計画（任意）**
   - 公開マスタ運用安定後、`sampleScoreConfig` 依存の段階的削除



### 12.9.1 PR-A 実装対応（Issue #55）
- 変換層: `src/lib/score/factory.ts` に `createScoreConfigFromPublicMaster` を追加。
- fallback 条件: ロール不足 / ステータス不足 / スコア重み不足 / 不正重み値で `sampleScoreConfig` へフォールバック。
- mapper 方針: `statCode` を `main.*` / `sub` / `set.*` / `effect.*` / ロール別 / キャラ別へマップして `ScoreProfile` へ反映。
- 今回は非接続実装とし、`/score` `/card` `/compare` の計算呼び出しは変更しない。

### 12.10 移行手順（運用）
1. 設定生成層を導入し、まだ `sampleScoreConfig` と同等値を返す状態でリリース。
2. 公開マスタ値を Factory 入力に接続し、差分検証（ステージング）。
3. `scoreConfigVersion` を保存・比較に反映。
4. warning 監視で欠落マスタ率/ fallback 率を観測。
5. fallback 発生率が許容範囲内で安定後、`sampleScoreConfig` の縮退計画を判断。

### 12.11 要確認
- 公開マスタに `referenceMaxScore` を持たせるか、Factory 側導出にするか。
- キャラ別重み未設定時の role 継承を管理画面にどこまで明示するか。
- ランキングで「計算version混在」を許可するか（表示上の分離要否）。


## 13. 公開マスタ由来 ScoreConfig の段階適用状況
- PR #58: `/score` に公開マスタ由来 ScoreConfig を試験適用。
- Issue #59 対応: `/card` と `/compare` へ適用を拡大し、主要計算画面で同一の設定解決（公開マスタ優先 / 不足・不正時は `sampleScoreConfig` フォールバック）を利用する。
