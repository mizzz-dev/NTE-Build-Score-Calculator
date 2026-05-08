# コンポーネント基本設計（Next.js App Router 前提）

## 1. 目的
- 本書は Issue #8 の成果物として、NTE Build Score Calculator の実装開始前に、Next.js App Router 前提のコンポーネント構成・ディレクトリ構成・責務分離を定義する。
- PR #1（要件定義）/ PR #5（画面・ルーティング設計）/ PR #6（スコア計算仕様）/ PR #7（DB・認証・権限設計）を前提とする。
- ウォーターフォール型開発を遵守し、未確定事項は「要確認」として分離し、仮実装しない。

## 2. スコープ
- 対象: フロントエンド（Next.js App Router）の基本設計。
- 非対象: 実装コード、依存導入、Next.js セットアップ、DB migration、RLS 実装。

## 3. 推奨ディレクトリ構成

```text
src/
  app/
    (public)/
      layout.tsx
      page.tsx                # /
      score/page.tsx          # /score
      compare/page.tsx        # /compare
      card/page.tsx           # /card
      presets/page.tsx
      statuses/page.tsx
      guide/page.tsx
      faq/page.tsx
      updates/page.tsx
      contact/page.tsx
    (auth)/
      login/page.tsx          # 要確認: 認証導線の最終URL
    api/
      health/route.ts         # 要確認: API境界の最終仕様
    layout.tsx
    global-error.tsx
    not-found.tsx
  components/
    layout/
    navigation/
    feedback/
    forms/
    charts/
    card/
  features/
    score/
      components/
      hooks/
      services/
      mappers/
      schemas/
      __tests__/
    compare/
      components/
      hooks/
      services/
      mappers/
      __tests__/
    card/
      components/
      hooks/
      services/
      mappers/
      __tests__/
    auth/
      components/
      hooks/
      services/
      __tests__/
    build/
      services/
      mappers/
      __tests__/
  lib/
    score/
    supabase/
    repositories/
    auth/
    validation/
    logger/
    utils/
  hooks/
  config/
  types/
```

### 3.1 設計意図
- `app/` は **ルーティングと画面合成** のみを担当し、業務ロジックを置かない。
- `features/` は **機能単位のUI/ユースケース境界** とし、画面ごとの実装起点にする。
- `lib/` は **外部依存やドメイン共通処理** を集約し、UI層から分離する。
- `components/` は **再利用UI** を管理し、`features` 配下の機能特化UIと分離する。

## 4. 各レイヤーの責務定義

### 4.1 `app`
- 責務:
  - App Router のページ・レイアウト定義。
  - Server Component / Client Component の境界宣言。
  - URLパラメータ・検索クエリ受け取りと `features` への橋渡し。
- 非責務:
  - スコア計算式の実装。
  - Supabase クエリの直接記述（例外: 最小限の初期セッション取得は要確認）。

### 4.2 `components`
- 責務:
  - 複数画面で再利用する表示コンポーネント。
  - 純粋UI（見た目・アクセシビリティ・イベント受け渡し）。
- 非責務:
  - ビジネスルール判定。
  - データ永続化。

### 4.3 `features`
- 責務:
  - 画面ユースケース単位での状態管理・UI構成。
  - `lib` のサービス呼び出しと表示用データ整形。
  - 入力バリデーションの適用（schema利用）。
- 非責務:
  - 外部サービスSDK初期化。
  - グローバルなアプリ設定定義。

### 4.4 `lib`
- 責務:
  - スコア計算コアロジック（純関数中心）。
  - Supabase クライアント生成と repository 層。
  - 認証セッション取得、RLS前提のデータアクセス抽象。
  - 共通バリデーション、ロガー、ユーティリティ。
- 非責務:
  - JSXによる画面描画。

### 4.5 `hooks`
- 責務:
  - 複数 feature で再利用するカスタムフック。
  - UI関心の共通状態（例: メディアクエリ、トースト制御）。
- 非責務:
  - 特定画面専用の重い業務ロジック（各 feature に配置）。

### 4.6 `config`
- 責務:
  - 環境別設定の取得窓口。
  - 表示定数、機能フラグ、デフォルト値。
- 非責務:
  - リクエスト時に変化するユーザーデータ保持。

### 4.7 `types`
- 責務:
  - 共有型（DTO、ViewModel、Entity、Form値）。
  - 外部I/O型と内部ドメイン型の分離。
- 非責務:
  - 型に紐づく実行ロジック。

## 5. 共通レイアウトコンポーネント構成

### 5.1 構成
- `components/layout/AppShell`
  - ヘッダー・ナビ・メイン・フッターの骨組みを提供。
- `components/layout/AppHeader`
  - ブランド、現在地補助、ログイン導線、言語切替（要確認）領域。
- `components/navigation/GlobalNav`
  - 主要10画面への遷移。
- `components/navigation/MobileDrawerNav`
  - モバイル用ドロワーナビ。
- `components/layout/AppFooter`
  - 非公式ファンツール表記、補助リンク、権利表記（要確認文言）。

### 5.2 配置方針
- `app/layout.tsx`: HTML骨格とグローバルProviderのみ。
- `app/(public)/layout.tsx`: 公開画面向けに `AppShell` を適用。
- 管理画面導入時は route group 分離（例: `app/(admin)/...`）でレイアウトを分岐。

## 6. `/score`（スコア計算画面）のコンポーネント構成

### 6.1 ページ構成
- `app/(public)/score/page.tsx`
  - `features/score/components/ScorePageContainer` を呼び出す。

### 6.2 機能コンポーネント
- `ScorePageContainer`
  - 画面全体の状態統合（入力、計算結果、エラー、警告）。
- `ScoreInputPanel`
  - キャラ/ロール/装備/ステータス入力。
- `ScoreResultPanel`
  - 総合スコア、ランク、内訳表示。
- `ScoreBreakdown`
  - メイン・サブ・セット効果の寄与率表示。
- `ScoreActionBar`
  - 比較へ追加、カード生成へ送る、保存導線。
- `ScoreWarningList`
  - `要確認` や計算時warningの表示。

### 6.3 ロジック分離
- 入力値 → `features/score/mappers` で計算入力DTOへ変換。
- 計算処理 → `lib/score` の純関数を呼び出し。
- 出力DTO → `features/score/mappers` で表示ViewModel化。

## 7. `/compare`（ビルド比較画面）のコンポーネント構成

### 7.1 ページ構成
- `app/(public)/compare/page.tsx`
  - `ComparePageContainer` を呼び出す。

### 7.2 機能コンポーネント
- `ComparePageContainer`
- `CompareTargetSelector`（比較対象の選択/並び替え）
- `CompareSummaryCards`（総合比較）
- `CompareDiffTable`（指標別差分）
- `CompareHighlightLegend`（優勢/劣勢の色分け説明）
- `CompareActionBar`（共有、カード生成、再計算）

### 7.3 ロジック分離
- 比較計算（差分、順位、優勢判定）は `features/compare/services` または `lib/score` の比較ユーティリティで実施。
- 表示整形は `mappers` に限定し、Table本体は表示責務のみ。

## 8. `/card`（ビルドカード生成画面）のコンポーネント構成

### 8.1 ページ構成
- `app/(public)/card/page.tsx`
  - `CardPageContainer` を呼び出す。

### 8.2 機能コンポーネント
- `CardPageContainer`
- `CardSourceBuildSelector`（元ビルド選択）
- `CardThemeSelector`（テーマ・表示項目選択）
- `CardPreviewCanvas`（プレビュー領域）
- `CardExportPanel`（保存形式選択、出力）
- `CardShareActions`（SNS共有、URL共有）

### 8.3 ロジック分離
- カード描画用データ生成は `features/card/mappers`。
- 画像出力処理は `features/card/services` に閉じ込め、UIは進捗表示のみ担当。

## 9. 認証・Supabase・データアクセス層の責務境界

### 9.1 境界定義
- `lib/supabase`
  - Supabase クライアント生成（server/clientの生成関数分離）。
- `lib/repositories`
  - テーブル単位のデータアクセス。
  - 戻り値は DB Row ではなくアプリ内DTOへマッピング。
- `lib/auth`
  - セッション取得、ユーザー識別、ロール判定用ヘルパー。
- `features/*/services`
  - ユースケース単位で repository を合成（例: ビルド保存、比較対象取得）。

### 9.2 禁止ルール
- `components` と `app` から Supabase SDK を直接呼ばない。
- 画面固有コンポーネントに SQL 相当の条件分岐を書かない。
- `service role` 権限をクライアント実行コードに持ち込まない。

## 10. スコア計算ロジックとUIの分離方針

### 10.1 分離原則
- 計算コアは `lib/score` 配下の純関数で構成し、React/DOM依存を禁止。
- UIは入力取得と表示に専念し、計算式・閾値判定を保持しない。
- 計算設定（重み、閾値、優先順位）は `config` またはDBマスタ経由のデータ入力とし、ハードコードしない。

### 10.2 依存方向
`app/components/features(UI) -> features/services -> lib/score + lib/repositories`

- 逆方向依存（`lib/score` から UI import）は禁止。

## 11. テスト対象にしやすい単位

### 11.1 単体テスト
- `lib/score`: 正規化、重み計算、閾値判定、優先順位マージ。
- `features/*/mappers`: DTO⇔ViewModel変換。
- `lib/repositories`: 入出力のマッピング（モックDB/fixture前提）。

### 11.2 コンポーネントテスト
- `components/layout/*`: ナビ表示、レスポンシブ分岐、導線。
- `features/score/components/*`: 入力変更時の表示更新、warning表示。
- `features/compare/components/*`: 差分ハイライトの表示条件。
- `features/card/components/*`: テーマ選択とプレビュー反映。

### 11.3 結合テスト
- `/score -> /compare -> /card` の導線とデータ受け渡し。
- 認証状態（ゲスト/ログイン）ごとの保存導線。

## 12. 命名・配置ルール（Codex実装時の迷い防止）

### 12.1 命名規則
- Reactコンポーネント: `PascalCase.tsx`。
- hooks: `useXxx.ts`。
- service: `xxxService.ts`（機能単位）。
- repository: `xxxRepository.ts`（テーブル/集約単位）。
- mapper: `xxxMapper.ts`。
- schema: `xxxSchema.ts`。
- 型定義: `xxxTypes.ts`（または `types.ts` に集約）。

### 12.2 配置規則
- その画面でしか使わないUIは `features/<feature>/components`。
- 2画面以上で再利用するUIは `components/`。
- ビジネスルールは `lib/` へ配置し、`features/components` に置かない。
- 外部依存（Supabase, Storage, 将来API）は `lib` の adapter/repository 層へ閉じ込める。

### 12.3 import規則
- 相対パス深掘り（`../../../`）を避けるため、実装時は path alias を導入する前提で設計する（要確認）。
- `features` 間の直接参照は最小化し、共通化が必要なら `lib` か `components` へ昇格する。

## 13. 初期セットアップIssueへ展開する作業単位
1. `src` 配下の基本ディレクトリ雛形作成。
2. App Router の route group（`(public)`）と 10 画面の空ページ作成。
3. 共通レイアウト骨組み（AppShell, Header, Nav, Footer）作成。
4. `features/score|compare|card` の最小コンテナとダミー表示作成。
5. `lib/score` の純関数インターフェース作成（実計算は別Issue）。
6. `lib/supabase` / `lib/repositories` のインターフェース作成（接続実装は別Issue）。
7. テスト土台（unit/component/integration の配置のみ）作成。

## 14. 要確認事項
1. 認証ページURL（`/login` か modal導線か）の最終決定。
2. 共有URLデータ受け渡し形式（query/hash/短縮ID）。
3. カード生成の実画像化方式（Canvas/SVG/サーバー生成）。
4. i18n実装方式と辞書配置（`config` or `features`）。
5. path alias の命名（`@/` の採用可否）。
