# NTE-Build-Score-Calculator

NTE Build Score Calculator の開発用リポジトリです。

## 非公式ファンツール表記
本リポジトリの成果物は非公式ファンツールです。公式素材の利用可否は「要確認」です。

## デザインシステム（Issue #12）
- `src/app/globals.css` にダーク・ネオン基調のカラートークンを定義しています。
- 共通UI（`SectionHeader` `NeonPanel` `FeatureCard` `StatusBadge` `PrimaryCTA`）を基準に、主要10画面の空状態を統一しています。
- レイアウトは `AppShell` を基準に、PCはサイドナビ、スマホはドロワーナビで遷移できる構成です。

## 開発環境
- Node.js 22 以上
- pnpm 10 以上

## セットアップ
```bash
pnpm install
```

## 開発サーバー起動
```bash
pnpm dev
```

## Lint
```bash
pnpm lint
```

## Build
```bash
pnpm build
```

## Supabase Auth設定（Issue #27）
1. Supabaseプロジェクトを作成し、AuthenticationでGoogleプロバイダを有効化します。
2. プロジェクトのURLとAnon Keyを確認します。
3. `.env.local` に以下を設定します（secret/service role keyは設定しない）。

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- 環境変数が未設定の場合、UI上のログイン機能は「未設定」と表示され、アプリのビルドは継続可能です。
