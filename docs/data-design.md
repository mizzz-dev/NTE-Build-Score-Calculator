# データ設計方針

## 1. 目的・前提
- 本書は Issue #4 の基本設計として、Supabase を前提に認証・認可・データ責務の境界を定義する。
- PR #1（要件定義）/ PR #5（画面・ルーティング設計）/ PR #6（スコア仕様）を参照し、実装前に未確定事項を分離する。
- Issue #29 でログインユーザー向け保存基盤（migration/RLS）の初期実装方針を追記する。

## 2. 全体方針
- 永続化は Supabase（PostgreSQL + Auth + RLS）を採用する。
- 認証済みユーザーの保存データはサーバー側で一元管理する。
- ゲスト利用はローカル保存を基本とし、ログイン時にユーザー選択で移行できる設計とする。
- スコア計算に必要なマスタデータは設定駆動を優先し、管理画面から更新可能とする。
- 非公式ファンツールであることを前提とし、個人情報は最小化する。

## 3. 認証方針（Supabase Auth / Google ログイン）

### 3.1 ログイン方式
- 認証基盤: Supabase Auth。
- 外部IDプロバイダ: Google ログインを採用。
- 必要最小限のプロフィール項目のみ利用（`sub` 相当の一意ID、表示名、アイコンURL、メールアドレス）。
- アプリ内のユーザー主キーは `auth.users.id`（UUID）を参照する。

### 3.2 セッション・アカウントの扱い
- 認証状態の判定は Supabase セッションで行う。
- アプリ独自パスワードは保持しない（Google 認証委譲）。
- 退会相当の扱いは「論理無効化 + 個人データ最小保持」を原則とし、詳細手順は要確認。

## 4. ゲスト利用方針

### 4.1 ゲスト識別
- 未ログイン時は `guest_local_id`（端末ローカル生成UUID）で識別する。
- `guest_local_id` はブラウザローカルストレージに保持し、サーバーのユーザー識別子としては利用しない。

### 4.2 ゲストデータ保存
- ゲストのビルド履歴はローカル保存を基本とする。
- 共有URL機能利用時のみ、公開用データを匿名化してサーバー側に保存可能とする（PIIを含めない）。

### 4.3 ログイン後のゲスト履歴
- 初回ログイン時に「ローカル履歴をアカウントへ移行する/しない」をユーザー選択式にする。
- 移行実行時は重複判定（ビルドハッシュ等）を行い、上限件数を超える分は選択削除対象にする。
- 未移行データはローカルに残すが、ユーザーが明示削除できるUIを要件化する。

## 5. データ分類
1. マスタデータ（運用者管理）
   - キャラ
   - ロール
   - ステータス
   - スコア重み/評価プロファイル
   - ランク閾値
   - プリセット
2. トランザクションデータ（ユーザー操作で増減）
   - ユーザー公開プロフィール
   - ビルド
   - ビルド履歴
   - ランキング集計結果
3. コンテンツデータ（運用者管理）
   - お知らせ
   - FAQ
   - アップデート履歴
4. 監査データ（運用追跡）
   - 管理操作ログ

## 6. テーブル候補と責務

> 命名は仮。実装フェーズで Supabase schema に合わせて確定する。

### 6.1 認証・ユーザー系
- `profiles`
  - 目的: `auth.users` と1:1の公開プロフィール管理。
  - 主な項目候補: `user_id(PK/FK auth.users.id)`, `display_name`, `avatar_url`, `locale`, `is_profile_public`, `created_at`, `updated_at`。
  - 備考: メールアドレスは原則 `auth.users` 側参照で、アプリ独自テーブルには複製しない。

- `user_roles`
  - 目的: RBAC用のロール付与（`admin`, `editor`, `viewer` など）。
  - 主な項目候補: `user_id`, `role`, `granted_by`, `granted_at`, `revoked_at`。
  - 備考: 管理者判定の一次情報として利用。

### 6.2 ビルド保存系
- `builds`
  - 目的: 現在有効なビルド本体。
  - 主な項目候補: `id`, `user_id`, `character_id`, `role_id`, `build_payload(jsonb)`, `score_total`, `score_rank`, `is_public`, `created_at`, `updated_at`。
  - 備考: 1レコード=1保存スロット。公開可否を明示する。

- `build_revisions`
  - 目的: ビルド編集履歴（差分追跡/復元用）。
  - 主な項目候補: `id`, `build_id`, `revision_no`, `build_payload(jsonb)`, `score_snapshot`, `created_at`, `created_by`。
  - 備考: 履歴上限・保持期間は要確認。

- `guest_share_builds`
  - 目的: ゲスト/ログイン問わず共有URL復元用の匿名ビルド。
  - 主な項目候補: `share_id`, `build_payload(jsonb)`, `score_snapshot`, `expires_at`, `created_at`。
  - 備考: 個人識別情報を保持しない。

### 6.3 ランキング系
- `ranking_snapshots`
  - 目的: ランキング集計結果の公開用スナップショット。
  - 主な項目候補: `id`, `aggregation_key(期間/条件)`, `generated_at`, `version`。

- `ranking_entries`
  - 目的: スナップショット内の順位行データ。
  - 主な項目候補: `snapshot_id`, `rank`, `build_id(nullable)`, `display_name`, `character_id`, `score_total`, `published_payload(jsonb)`。
  - 備考: 公開情報のみ保持。内部識別子やメールは非公開。

### 6.4 マスタデータ系
- `characters` / `roles` / `stats`
  - 目的: 計算・表示に利用する基礎マスタ。
- `score_profiles`
  - 目的: ロール別/キャラ別/デフォルト重み。
- `stat_ranges`
  - 目的: ステータス許容範囲（%/固定値）。
- `rank_thresholds`
  - 目的: ランク判定閾値（D〜SS）。
- `preset_build_templates`
  - 目的: 初期プリセット構成。
- `master_data_versions`
  - 目的: マスタ公開バージョン管理（ランキング再計算整合性に利用）。

### 6.5 コンテンツ・運用系
- `announcements` / `faqs` / `update_logs`
  - 目的: ユーザー向け情報コンテンツ。
- `admin_audit_logs`
  - 目的: 管理画面の更新操作記録。
  - 主な項目候補: `id`, `actor_user_id`, `action`, `target_table`, `target_id`, `before_json`, `after_json`, `created_at`。

## 7. 認可・RLS方針

### 7.1 基本原則
- すべてのアプリ公開テーブルで RLS を有効化する。
- 「クライアントから直接参照/更新する可能性があるテーブル」は deny-by-default で開始する。
- 認証不要公開は、必要最小限の `SELECT` ポリシーのみ許可する。

### 7.2 ユーザー領域ポリシー
- `profiles`, `builds`, `build_revisions` は `auth.uid() = user_id` の本人一致で `SELECT/INSERT/UPDATE/DELETE` を許可。
- 公開ビルド参照は `is_public = true` の行のみ匿名 `SELECT` を許可（要確認）。

### 7.3 管理領域ポリシー
- マスタ・コンテンツ編集テーブルは一般ユーザーの `INSERT/UPDATE/DELETE` を禁止。
- 管理者ロール付与済みユーザーのみ編集可能。
- 監査ログテーブルは管理者のみ参照可、一般ユーザー不可。

### 7.4 ランキング領域ポリシー
- `ranking_snapshots` / `ranking_entries` は公開 `SELECT` を許可。
- 生成・更新はサーバー権限（Service Role / バックエンドバッチ）限定。

## 8. 管理者権限の判定方法
- 第一候補: `user_roles` テーブルで RBAC 判定。
- 補助候補: Supabase JWT custom claims（`app_metadata.role`）併用。
- 判定の単一責務は DB 側（RLS policy）が持ち、フロントの表示制御は補助とする。
- 権限昇格/剥奪操作は `admin_audit_logs` に記録する。

## 9. 管理画面で編集するデータと権限
- `admin`
  - すべての管理対象データを CRUD 可能。
  - ロール付与・停止、公開設定変更、ランキング再集計トリガー実行可能。
- `editor`
  - マスタ/コンテンツの編集可。
  - ロール管理・監査ログ閲覧は不可（または制限付き、要確認）。
- `viewer`
  - 参照のみ。

管理対象データ:
- キャラ、ロール、ステータス、スコア重み、ランク閾値、プリセット
- お知らせ、FAQ、アップデート履歴
- （要確認）ランキング手動再集計の実行権限

## 10. 保存件数上限方針
- ログインユーザーの `builds` 保存件数に上限を設ける（具体値は要確認）。
- 上限判定は DB 書き込み前に実施し、超過時は「上書き」「削除して保存」「キャンセル」を選択できる仕様にする。
- `build_revisions` は別上限を設け、古い履歴を自動削除する方針を採用（具体値は要確認）。

## 11. ランキング集計データ方針
- リアルタイム直計算ではなく、定期バッチまたはイベント駆動で `ranking_snapshots` を生成する。
- 集計キー（期間、キャラ、ロール、スコアプロファイル版）を持たせ、再現可能性を担保する。
- 集計時は不正対策として重複投稿・異常値・無効ビルドを除外可能なフラグ設計を行う（詳細ルールは要確認）。

## 12. 監査ログ方針（要否定義）
- 結論: **要**。
- 対象: 管理画面からの更新系操作（作成/更新/削除/公開切替/権限変更）。
- 目的: 変更追跡、誤操作復旧、権限操作の説明責任。
- 保持期間とマスキング方針は要確認。

## 13. 個人情報最小化・公開データ範囲

### 13.1 収集最小化
- 必須: 認証ID、表示名（未設定可）、アイコンURL（未設定可）。
- 原則非保持: 電話番号、住所、生年月日など不要PII。
- メールアドレスは認証用途に限定し、公開レスポンスへ含めない。

### 13.2 ランキング公開可否
- 公開してよい情報
  - 表示名（匿名名許可）
  - キャラ/ロール
  - スコア、順位、更新日時
  - ビルド内容（ユーザーが公開許可した範囲）
- 公開してはいけない情報
  - メールアドレス
  - `user_id` 等の内部識別子
  - IP/端末識別情報
  - 非公開設定のビルド詳細

## 14. 要確認事項（実装前に確定が必要）
1. Google ログイン以外（Apple/X 等）の将来対応範囲。
2. ログインユーザー保存上限件数（`builds` / `build_revisions`）。
3. 共有URLの有効期限と失効ポリシー。
4. 公開ビルドの検索可否（完全公開/URL知っている人のみ）。
5. ランキング更新頻度（リアルタイム/日次/週次）。
6. 不正対策ルール（同一ユーザー多重投稿、bot、改ざんスコア検知）。
7. 監査ログ保持期間と閲覧可能ロール。
8. 管理者アカウント発行・承認フロー。
9. 退会時データ削除ポリシー（法務要件含む）。
10. 公式素材利用規約確定までの表示文言最終版。


## 15. Issue #29 実装方針（ログインユーザー保存基盤）

### 15.1 migration管理
- SupabaseのDDL/RLSは `supabase/migrations` 配下で時系列SQL管理する。
- ファイル命名は `YYYYMMDDHHMMSS_<summary>.sql` とし、既存migrationの上書きは禁止する。

### 15.2 個人保存テーブル
- テーブル名: `user_saved_results`。
- 主キー: `id (uuid)`、ユーザー識別: `user_id (auth.users.id FK)`。
- 種別: `result_kind`（`score` / `card` enum）。
- 保存データ本体: `payload (jsonb)`。
- 検索補助: `score_total`, `score_rank`, `source_version`, `created_at`, `updated_at`。
- `payload` はJSON object制約を持たせ、secret / 不要PIIは保存対象外とする。

### 15.3 RLS方針
- `user_saved_results` は RLS を有効化し、本人一致（`auth.uid() = user_id`）のみ許可する。
- 許可操作は `SELECT/INSERT/UPDATE/DELETE` の本人データのみに限定する。
- 匿名ユーザーや他ユーザー行へのアクセスは deny-by-default を維持する。

### 15.4 公開/非公開フラグの扱い
- 今回の個人保存テーブルには `is_public` を追加しない。
- 理由: 個人保存とランキング/公開用途を同一テーブルで混在させると、RLS・公開範囲制御が複雑化するため。
- 公開・ランキング対象は将来 `ranking_snapshots` / `ranking_entries` など別責務テーブルで管理する。

### 15.5 今回の非対応
- 保存UIの実装。
- ゲスト履歴のログインユーザー保存への移行。
- ランキング生成・管理機能。

## 16. Issue #35 実装方針（ランキング公開データ基盤）

### 16.1 公開ランキングテーブルの分離
- テーブル名: `ranking_public_entries`。
- `user_saved_results`（個人保存）とは物理的に分離し、個人保存データをそのまま公開しない。
- 1レコードは1件のランキング投稿公開データを表す。

### 16.2 公開対象カラム
- `display_name`（表示名または匿名表示名）
- `is_anonymous`（匿名表示フラグ）
- `result_kind`（結果種別）
- `role`（ロール）
- `equipment_type`（装備タイプ）
- `score_total`（スコア）
- `score_rank`（ランク）
- `payload_snapshot`（公開可能な最小スナップショット）
- `created_at`（投稿作成日時）

### 16.3 非公開情報の取り扱い
- `ranking_public_entries` には email / access token / secret / password / 内部識別子（`user_id`等）を `payload_snapshot` に含めない。
- DB制約とカラムコメントで「公開不可情報を保存しない」方針を明示する。
- 収集最小化の原則に従い、ランキング表示に不要なPIIは保存対象外とする。

### 16.4 RLS方針
- `SELECT`: 公開ランキング閲覧のため、未ログインを含む全ユーザーに許可。
- `INSERT`: 認証済みユーザーが `auth.uid() = user_id` の自分の投稿のみ作成可能。
- `DELETE`: 認証済みユーザーが `auth.uid() = user_id` の自分の投稿のみ削除可能。
- `UPDATE`: 今回は許可しない（再投稿での更新を前提にし、改ざん経路を最小化）。

### 16.5 将来UI向けインデックス
- 並び順用: `result_kind + score_total DESC + created_at DESC`。
- 絞り込み用: `role + equipment_type + score_rank`。
- マイ投稿管理用: `user_id + created_at DESC`。
- これにより次PRでランキング投稿UI/一覧UIを実装しやすい土台を先に整備する。
