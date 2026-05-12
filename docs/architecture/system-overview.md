# システム全体概要（System Overview）

## 1. 目的
本書は、NTE Build Score Calculator の主要機能境界と依存関係を整理し、実装時の責務逸脱を防ぐための正本です。

## 2. 機能境界
- 公開マスタ層: ステータス/装備等の正規キー・表示名・別名の管理
- ScoreConfig層: キャラクター/ロール/入力値に基づく計算設定生成
- スコア計算層: ScoreConfigを使った評価ロジック
- OCR層: 画像からの候補抽出・正規化・公開マスタマッピング（入力補助限定）
- 保存層: payloadBuilderを介した保存/共有データ構築
- ランキング層: 保存済み互換payloadを前提とした集計・表示
- UI層: 入力、候補提示、確認、確定操作（Business Logicは保持しない）

## 3. 依存関係（公開マスタ / ScoreConfig / OCR / 保存 / ランキング）
1. 公開マスタ → OCRマッピング（候補解決）
2. 公開マスタ + 入力値 → ScoreConfig
3. ScoreConfig → スコア計算
4. スコア計算結果 + フォーム確定値 → 保存payload
5. 保存payload → ランキング集計/表示

補足:
- OCR由来の confidence / matchType / raw text は保存payloadへ渡さない。
- OCRは入力補助層で完結し、保存・ランキングの契約を変更しない。

## 4. 単方向依存の方針
- UI層 → アプリケーション層（ユースケース） → ドメイン層（計算/判定） → データ層（保存）
- 逆方向依存は禁止。
- OCR層は「入力補助アプリケーション層」に配置し、計算ドメインへ副作用を持ち込まない。

## 5. UI層にBusiness Logicを混ぜない方針
- UIコンポーネントは表示・イベント通知に専念する。
- 判定ロジック（適用可否、候補選定、警告条件）はlib/usecaseへ隔離する。
- 画面はContainerが状態管理し、Presentational/Panelが描画責務を担う。

## 6. OCR責務分離後の構成
- OCR UIパネル: 画像選択、候補表示、警告表示、適用操作
- OCR実行アダプタ: Tesseract.js遅延読み込み、実行状態管理
- OCR補助ロジック: 文字列正規化、公開マスタ候補生成、適用可否判定
- スコア画面Container: OCR結果を既存フォームへ橋渡し（確定時のみ）

## 7. 変更ガードレール
- OCR導入中もScoreConfig計算契約は不変。
- payloadBuilder契約（保存/共有/ランキング互換）は不変。
- DB schema / migration / auth / infra / deploymentは本機能で変更しない。
