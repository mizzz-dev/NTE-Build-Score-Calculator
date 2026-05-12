# プロジェクト概要（Repository Memory）

## 1. サービス概要
NTE Build Score Calculator は、Neverness to Everness（NTE）向けの**非公式ファンツール**です。ユーザーが装備・ステータス情報を入力し、ビルド評価（スコア計算）・比較・保存・共有を行うことを目的とします。

## 2. 対象ユーザー
- 主対象: 日本語ユーザー
- 副対象: 英語ユーザー・韓国語ユーザー
- 利用シーン: 日々のビルド検討、装備更新判断、他ユーザーとの比較共有

## 3. 技術スタック（現行）
- フロントエンド: Next.js（App Router）+ TypeScript
- UI: React コンポーネント分割（Container / Presentational）
- データ・認証: Supabase（設計方針は `docs/data-design.md`）
- 品質管理: pnpm ベースの lint / build / test
- OCR（入力補助）: ブラウザ内OCR（Tesseract.js 遅延読み込み接続済み、`/score` 限定）

## 4. 主要機能（現時点の対象）
- `/score` でのビルドスコア計算
- 公開マスタ + ScoreConfig に基づく評価
- 保存/共有/ランキング連携（既存payload互換維持）
- OCR入力補助（`/score` のみ、最終確定は手動確認前提）

## 5. 非公式ファンツールとしての前提
- 本サービスは公式サービスではありません。
- 公式素材（画像・ロゴ・キャラクター素材等）の利用は規約確認完了まで**要確認**扱いです。
- 利用規約・著作権・ガイドラインを尊重し、違反リスクを回避する運用を継続します。

## 6. Source of Truth 方針
本ドキュメント群（`docs/`）を Repository Memory の正本とし、会話ログやPR本文は補助情報として扱います。
- 要件: `docs/requirements.md`
- スコア仕様: `docs/scoring-spec.md`
- OCR要件: `docs/ocr-requirements.md`
- 現在地: `docs/current-status.md`
- 稼働中課題: `docs/active-issues.md`
- 全体アーキテクチャ: `docs/architecture/system-overview.md`
