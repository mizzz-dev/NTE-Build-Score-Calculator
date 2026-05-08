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
