# 現在ステータス（Context Bootstrap）

最終更新: 2026-05-16（PR #142 merge後処理 / Issue #143 作成反映）

## 1. 現在の実装状態

OCR MVP は、`/score` から `/card`、`/compare` へ段階的に展開済みです。OCRは入力補助であり、最終確定はユーザーの手動確認を必須とします。保存payload・共有URL・ランキングpayloadへOCR由来メタ情報を混入させない方針を維持しています。

公開前P1として metadata / OGP / canonical / robots の最小整備を実施済みです。非公式ファンツール表記を維持しつつ、検索・共有時の説明と実機能の整合を強化しています。

## 2. 完了済みの主要フェーズ

- `/score` OCR入力補助の導入と複数サイクルKPI確認。
- `/card` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCR入力補助の要件詳細化、最小実装、限定導入後KPI確認。
- `/compare` OCRは第1〜第3サイクルで重点KPIを確認し、条件付き正式展開可と判定済み。
- 正式展開後の監視運用方針、Runbook、監査ログ項目、改善Issue方針を整理済み。
- 月次監査Runbookと月次監査ログテンプレートを整備済み。
- 利用規約・免責・プライバシー方針ページを追加済み。
- Issue #141 として metadata / OGP / Twitter / canonical / robots 方針の公開前最小整備を実施済み。

## 3. 直近完了タスク（Issue #141 / PR #142）

Issue #141 / PR #142 で公開前監査（Issue #137）に基づくSEO/共有表示の最小整備を行いました。

実施内容:
- `src/app/layout.tsx` で `metadataBase`、`title` テンプレート、`description`、canonical相当設定を追加。
- `openGraph` / `twitter` を最小構成で追加し、機能説明と「非公式ファンツール」表記を統一。
- `src/app/robots.ts` を追加し、環境変数で公開前のindex抑制と通常公開を切り替えられる方針を実装。
- robotsに `sitemap.xml` 参照を記載（sitemap本体の実装は別Issue判断）。
- 公式素材・ゲーム画像は追加せず、法務判断は引き続き「要確認」として維持。

PR #142 のCodex Reviewで以下のP1指摘があり、次Issue #143で対応します。
- root layout のcanonical指定により、個別ページもホームcanonicalとして扱われる可能性がある。
- 公開前index抑制フラグがrobots側のみのため、metadata側にも明示的なnoindex指示が必要。

## 4. 現在の次作業（Issue #143）

Issue #143 で canonical をページ別方針に見直し、公開前noindexをmetadataにも反映します。

目的:
- root layoutが全ページへホームcanonicalを強制しないよう修正する。
- `/terms` `/privacy` `/disclaimer` がホームcanonicalとして扱われない状態にする。
- 公開前index抑制フラグが有効な場合にmetadata側でも明示的なnoindex指示を返す。
- robots.ts とmetadata側のrobots指示が矛盾しないようにする。
- 公式素材・ゲーム画像を使わない方針を維持する。

## 5. 進行中 / 次フェーズ

- 進行中: Issue #143（canonicalページ別方針見直し / metadata noindex反映）
- 次候補:
  1. sitemap実装要否の確定と必要時の別Issue化
  2. 商用利用前の権利・法務確認（要確認）
  3. 正式リリース準備・リリースノート作成
  4. 公開前最終チェックリスト整備

## 6. 注意すべき変更禁止領域

本フェーズでは以下を変更しない。

- OCRアルゴリズム
- OCR信頼度計算
- DB migration
- auth / infra / deployment 設定
- 保存payload仕様
- 共有URL仕様
- ランキング仕様
- 画像保存方式
- 外部OCR API連携
- 低信頼度候補の自動確定
- 法務判断の確定
- 公式素材・ゲーム画像の追加
- sitemap本体実装（必要なら別Issue）

## 7. 参照ドキュメント

- `docs/ai-protocol/PROMPT.txt`
- `docs/logs/2026-05-15-issue-137-pre-release-quality-seo-compliance-audit.md`
- `docs/logs/2026-05-16-issue-141-metadata-ogp-canonical-robots.md`
- `docs/ocr-requirements.md`
- `docs/scoring-spec.md`
- `docs/data-design.md`
- `docs/component-design.md`
- `docs/runbooks/compare-ocr-release-runbook.md`
- `docs/active-issues.md`
