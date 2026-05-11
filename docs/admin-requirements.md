# 管理画面要件

## 1. 目的
運用者がゲーム仕様更新・コンテンツ更新をコード変更なしで反映できるようにする。

## 2. 権限
- 管理者ロールを定義（`admin` / `editor` / `viewer`）。
- 一般ユーザー画面と分離する。
- 権限判定は Supabase + RLS を前提とし、フロント側表示制御は補助とする。

## 3. 管理対象
- キャラ管理
- ロール管理
- ステータス管理
- スコア重み管理
- ランク閾値管理
- プリセット管理
- お知らせ管理
- FAQ管理
- アップデート履歴管理
- （参照限定）監査ログ

## 4. 機能要件
- CRUD（作成・参照・更新・削除）
- 公開/非公開管理
- 並び順管理
- 変更履歴の追跡（最低限の監査）
- 権限不足時の操作禁止（UI非表示 + API/RLS拒否）

## 5. 運用要件
- 誤操作防止（確認ダイアログ）
- バリデーション（重複・桁数・必須）
- メンテナンス時の影響範囲表示
- 監査ログで更新者・更新前後を追跡可能にする

## 6. 要確認事項
- 管理者アカウント発行フロー
- 複数管理者時の承認フロー
- 監査ログ保持期間
- editor ロールに許可する操作境界（ランキング再集計含む）


## 7. Issue #39 DB基盤方針（管理画面実装前）
### 7.1 スコープ
- 本Issueでは管理画面UI/CRUD UIは実装しない。
- Supabaseのservice role key/secretは利用しない。
- 管理対象データの更新はRLSで管理者ロールに限定する。

### 7.2 権限モデル（RBAC）
- `user_roles` テーブルで `admin` / `editor` / `viewer` を管理する。
- `admin`: ロール付与を含む全管理操作。
- `editor`: マスタ/コンテンツ更新、監査ログの書き込み。
- `viewer`: 管理データ参照のみ。
- 管理者判定は `has_admin_role()` 関数を通してRLSポリシーで実施する。

### 7.3 管理対象データ（DB）
- マスタ: `admin_characters`, `admin_roles_master`, `admin_stats`, `admin_score_weights`
- コンテンツ: `admin_faqs`, `admin_announcements`, `admin_update_histories`
- 権限管理: `user_roles`
- 監査: `admin_audit_logs`

### 7.4 公開データと管理専用データの分離
- 一般公開は `public_*` ビュー経由で行う（`is_public = true` のみ）。
- 管理用の生テーブルはRLSで一般ユーザーを拒否する。
- これにより、公開参照（anon/authenticated）と管理更新（admin/editor）を物理・論理の両面で分離する。

### 7.5 監査ログ方針
- `admin_audit_logs` に `actor_user_id`, `action`, `target_table`, `target_id`, `before_json`, `after_json`, `request_id` を保存する。
- 監査ログ閲覧は `admin` のみ、書き込みは `admin/editor` とする。
- secret/access token/service role key/不要PIIはログに保存しない。

### 7.6 要確認事項
- `editor` が監査ログを参照可能にするか（現状は不可）。
- 監査ログ保持期間とアーカイブ運用。
- 初期管理者の付与手順（運用Runbook）。
