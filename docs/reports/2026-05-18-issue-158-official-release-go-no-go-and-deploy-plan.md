# Issue #158 正式リリース実施可否判定 / deploy計画レポート

- 作成日: 2026-05-18
- 対象Issue: #158
- 関連Issue: #152, #154, #156
- 判定対象: 正式リリース候補（非公式ファンツール）
- 注意: 本レポートは法務判断を確定しない。公式名称・素材・商用利用可否は引き続き「要確認」。

## 1. 目的

Issue #152 の Go（条件付き）判定が、Issue #154（canonical整合）/ #156（metadata title重複解消）反映後も有効かを再判定し、正式リリース実施可否・本番deploy手順・rollback条件・post-release確認ログ運用を正本ドキュメントとして確定する。

## 2. 判定結論（2026-05-18時点）

- 判定: **Conditional Go（条件付きGo）**
- 判定理由:
  1. Issue #154 により、主要機能ページ canonical 方針とGo判定レポートの不整合は解消済み。
  2. Issue #156 により、主要機能ページ metadata title のサイト名重複リスクは解消済み。
  3. Release / Security / Privacy / Support の公開前要件は、既存正本ドキュメントと整合を維持。
  4. 一方、法務・権利の専門確認は未完了であり、正式公開前必須と商用化前必須を分離して管理継続が必要。

## 3. Issue #152 Go（条件付き）判定の有効性再確認

### 3.1 再確認結果

- **有効（継続）**。
- ただし、Issue #152 当時の条件に加え、Issue #154 / #156 で追加修正したSEO整合が維持されていることを前提条件に更新。

### 3.2 根拠

- canonical不整合: 解消済み（Issue #154）
- metadata title重複: 解消済み（Issue #156）
- 本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` 方針: Issue #152時点の運用方針を維持

## 4. 未解決リスク（継続管理）

1. 公式素材利用可否未確認（高）
2. 非公式ファンツールとしての商用利用リスク（高）
3. 商用利用時の権利・法務確認未完了（高）
4. 非公式表記運用の将来ページ追加時の漏れリスク（高）

## 5. 専門確認事項の再分類

### 5.1 正式公開前必須

1. 非公式ファンツール表記の主要導線（主要ページ/規約導線）最終監査
2. 利用規約・免責・プライバシー方針の公開状態と導線有効性確認
3. 本番URL / `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ROBOTS_NOINDEX` の再監査

### 5.2 商用化前必須

1. 公式名称・略称・ゲーム内用語の使用可否に関する専門確認
2. 公式素材・ゲーム画像・ロゴ等の使用可否に関する専門確認
3. 免責文言・収益化導線に関する法務レビュー完了

## 6. 本番URL・環境変数再確認（Issue #158時点）

- 本番URL候補（fallback）: `https://nte-build-score-calculator.vercel.app`
- `NEXT_PUBLIC_SITE_URL`: 本番URLと一致必須（未一致はNo-Go）
- `NEXT_PUBLIC_ROBOTS_NOINDEX`: 正式公開時は `false` 必須

補足:
- 本Issueでは実deploy・実環境変数変更は実施しない（運用手順定義のみ）。

## 7. deploy実施計画（責任範囲・タイミング・前提条件）

### 7.1 実施者（責任範囲）

- 最終公開判断責任者: リポジトリ管理者（人間）
- deploy実行者: 本番権限を持つ運用担当者（人間）
- 記録責任者: Issue #158 担当者（本レポート更新担当）

### 7.2 実施タイミング

- 条件を満たした後、**人間のGo承認当日**に実施。
- 重大問い合わせ対応可能時間帯（平日の日中帯を推奨）に限定。

### 7.3 前提条件

1. Releaseチェックリストの必須項目が完了
2. `pnpm lint` / `pnpm test` / `pnpm build` 結果記録
3. rollback責任者と直前安定版コミット（またはタグ）確定
4. 法務判断を本Issueで確定しないことを関係者合意

## 8. deploy確認手順

### 8.1 deploy前確認

1. release-checklist の 0,1,2,3,4,5,6,7,8.1,9 を再確認
2. `NEXT_PUBLIC_SITE_URL` と本番URLの一致確認
3. `NEXT_PUBLIC_ROBOTS_NOINDEX=false` を確認
4. 直前安定版タグ/コミットの控えを記録

### 8.2 deploy中確認

1. build/deployログで失敗有無を確認
2. 本番トップへアクセスしHTTPエラー有無を確認
3. `robots.txt` / `sitemap.xml` の公開状態を確認

### 8.3 deploy後確認

1. `/` `/score` `/card` `/compare` `/contact` `/terms` `/privacy` `/disclaimer` `/updates` の表示確認
2. canonical/metadata/robots/sitemap の反映確認
3. 問い合わせ導線動作確認
4. 重大不具合の有無を30分以内に一次判定

## 9. rollback条件とrollback手順

### 9.1 rollback条件（いずれか1つで実施）

1. 主要導線にアクセス不能（5xx継続・白画面）
2. `robots` / `sitemap` / canonical の重大誤設定
3. 規約導線（`/terms` `/privacy` `/disclaimer`）欠落
4. 公開直後にP1障害（データ損失相当・継続利用不能）が発生

### 9.2 rollback手順

1. 直前安定版コミットへ `git revert <release_commit>` または直前タグを再deploy
2. 必要時 `NEXT_PUBLIC_ROBOTS_NOINDEX=true` で一時noindex化
3. rollback後に主要導線再確認
4. 障害内容・判断時刻・実施者を運用ログへ保存

## 10. post-release確認ログ定義

- 保存先: `docs/logs/`
- ファイル名形式: `YYYY-MM-DD-issue-158-post-release-check.md`
- 必須記録項目:
  1. 判定（継続公開 / rollback）
  2. 実施日時（UTC）
  3. 実施者（役割名）
  4. 確認コマンド/確認URL
  5. 問題有無
  6. 次アクション

## 11. deploy実施Issueの扱い

- 本Issue #158 では **実deployは行わない**。
- deploy実施は新規Issue（提案: `正式リリース本番deploy実行`）として起票し、実施ログを分離する。
- `docs/active-issues.md` に「deploy実施Issue新規作成」を次アクションとして追記。

## 12. 非実施項目（意図的）

- 法務判断の確定
- 公式素材・ゲーム画像の追加
- OCRアルゴリズム/OCR信頼度計算の変更
- DB/auth/infra/deployment設定の変更
- 保存payload/共有URL/ランキング仕様の変更

