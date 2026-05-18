# Issue #150 作業ログ（正式リリース準備ドキュメント整備）

- 作成日: 2026-05-18
- 対象Issue: #150
- 目的: 正式公開判断に必要なチェックリストとリリースノートをRepositoryへ保存し、人間とAIで同一前提を参照できる状態を作る。

## 1. 実施内容

1. `docs/release-checklist.md` を正式リリース前向けに全面更新。  
   - security / privacy / license / release / support 観点を明記。  
   - 本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` の確認項目を追加。  
   - 利用規約/免責/プライバシー方針導線確認、rollback手順、post-release確認を追加。
2. `docs/release-notes/2026-05-18-official-release-candidate.md` を新規作成。  
   - 主要機能、公開範囲、既知制限、非公式ファンツール表記、サポート範囲、rollback方針を記録。  
   - Breaking change なしを明記。  
   - 商用利用前の専門確認未完了を残課題として明記。
3. `docs/current-status.md` / `docs/active-issues.md` を更新し、Issue #150 のドキュメント整備反映と次アクションを明確化。
4. 作業ログ（本ファイル）とAIプロンプトログを追加。

## 2. 技術判断

- 今回は公開準備ドキュメント整備に限定し、アプリ機能やインフラ設定は変更しない。
- 法務判断は確定しない方針を維持し、「要確認」を継続。
- OCR関連のガードレール（画像非保存、低信頼度自動確定禁止、OCRメタ非混入）をチェック項目として固定化した。

## 3. 非変更確認

以下は未変更。

- OCRアルゴリズム
- OCR信頼度計算
- DB migration
- auth / infra / deployment 設定
- 保存payload仕様
- 共有URL仕様
- ランキング仕様
- 外部OCR API連携
- 公式素材・ゲーム画像
- 実際の本番deploy

## 4. テスト結果

- `pnpm lint`（docs中心作業のため未実行）
- `pnpm test`（docs中心作業のため未実行）
- `pnpm build`（docs中心作業のため未実行）

## 5. 残課題

1. 本番URLの最終確定と `NEXT_PUBLIC_SITE_URL` 一致確認。
2. `NEXT_PUBLIC_ROBOTS_NOINDEX=false` の本番設定最終確認。
3. Go / No-Go 判定会議での最終判断記録。
4. 商用利用前の専門確認（名称・素材・免責文言・収益化導線）。

## 6. Rollback方法

本対応はドキュメント変更のみ。問題発生時は以下で復旧可能。

1. `git revert <Issue #150対応コミットSHA>` を実行。
2. `docs/release-checklist.md` と `docs/release-notes/2026-05-18-official-release-candidate.md` を直前状態へ戻す。
3. `docs/current-status.md` `docs/active-issues.md` `docs/logs/...` `docs/ai-prompts/...` を必要に応じて差し戻す。

## 7. PR本文案

### タイトル
Issue #150: 正式リリース準備ドキュメント（チェックリスト/リリースノート）を整備

### 本文（案）
- Issue: #150

#### 実施内容
- 正式リリース前チェックリストを更新（security/privacy/license/release/support）
- 本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` の確認項目を追加
- 利用規約・免責・プライバシー方針導線確認、rollback/post-release確認を追加
- 正式リリース候補リリースノートを新規作成
- Breaking change なしを明記
- 商用利用前の専門確認未完了を残課題として明記
- `docs/current-status.md` `docs/active-issues.md` を更新
- 作業ログ/AIプロンプトログを追加

#### 非変更
- OCRアルゴリズム
- OCR信頼度計算
- DB / auth / infra / deployment
- 保存payload仕様 / 共有URL仕様 / ランキング仕様
- 公式素材・ゲーム画像追加
- 本番deploy

#### テスト
- `pnpm lint`（docs中心作業のため未実行）
- `pnpm test`（docs中心作業のため未実行）
- `pnpm build`（docs中心作業のため未実行）
