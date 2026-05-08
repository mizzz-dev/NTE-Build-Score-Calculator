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
