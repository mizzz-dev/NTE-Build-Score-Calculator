# Issue #148 作業ログ（商用利用前の権利・法務確認観点整理）

- 作成日: 2026-05-17
- 対象Issue: #148

## 1. 実施概要

正式リリース準備へ進む前提として、非公式ファンツールの権利・法務確認観点をRepositoryに明文化した。法務判断は確定せず、確認済み/未確認/専門確認必須へ分類した。

## 2. 実施内容

1. `docs/ai-protocol/PROMPT.txt` を最優先ルールとして確認。  
2. `docs/current-status.md` / `docs/active-issues.md` / Issue #137ログ / Issue #145ログを参照。  
3. 利用規約・免責・プライバシー方針の現行文言を確認。  
4. 権利・法務観点レポートを `docs/reports/2026-05-17-issue-148-commercial-legal-readiness-review.md` に追加。  
5. `docs/risks/risks.md` に商用利用時の権利・法務確認未完了リスクを追記。  
6. `docs/current-status.md` と `docs/active-issues.md` をIssue #148完了状態へ更新。  

## 3. 技術判断

- 本Issueはドキュメント整理のみとし、実装仕様は非変更。
- 法務判断を断定せず、公開前P0と商用前専門確認を分離して記録。
- 収益化（広告/寄付/課金）は追加実装せず、追加確認観点のみ整理。

## 4. テスト結果

- `pnpm lint`: docs中心作業のため未実行（コード変更なし）
- `pnpm test`: docs中心作業のため未実行（コード変更なし）
- `pnpm build`: docs中心作業のため未実行（コード変更なし）

## 5. 非変更確認

- OCRアルゴリズム
- OCR信頼度計算
- DB migration
- auth / infra / deployment 設定
- 保存payload仕様
- ランキング仕様
- 外部OCR API連携
- 公式素材・ゲーム画像追加
- 法務判断の確定

## 6. 残課題

1. 公式名称・略称・ゲーム内用語の利用可否の専門確認。  
2. 公式素材・スクリーンショット・ロゴ・アイコン利用可否の専門確認。  
3. 商用化時（広告/寄付/課金）に必要な規約・表示の最終レビュー。  

## 7. Rollback方法

1. `git revert <Issue #148対応コミットSHA>` を実行。  
2. 追加したレポート/ログ/AIプロンプトログを差し戻し。  
3. `docs/current-status.md` と `docs/active-issues.md` を直前状態へ戻す。  

## 8. PR本文案

### タイトル
Issue #148: 商用利用前の権利・法務確認観点を整理

### 本文（案）
- Issue: #148

#### 実施内容
- 非公式ファンツールとしての権利・法務確認観点を `docs/reports/...` に整理
- 非公式表記、名称/用語、公式素材、ゲーム内情報、OCR画像、免責、収益化時追加確認を棚卸し
- 確認済み/未確認/専門確認必須を分類
- 公開前P0リスクと商用利用前の専門確認必須項目を分離
- `docs/risks/risks.md` に商用利用時の権利・法務確認未完了リスクを追記
- `docs/current-status.md` と `docs/active-issues.md` を更新
- 作業ログとAIプロンプトログを追加

#### 非変更
- OCRアルゴリズム
- OCR信頼度計算
- DB / auth / infra / deployment
- 保存payload仕様 / ランキング仕様
- 外部OCR API連携
- 公式素材・ゲーム画像
- 法務判断の確定

#### テスト
- `pnpm lint`（docs中心作業のため未実行）
- `pnpm test`（docs中心作業のため未実行）
- `pnpm build`（docs中心作業のため未実行）
