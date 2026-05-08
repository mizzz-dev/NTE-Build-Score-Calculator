# Supabase migration運用方針

Issue #29 対応として、SupabaseのDDL/RLSは `supabase/migrations` 配下で時系列管理する。

## 方針
- マイグレーションは `YYYYMMDDHHMMSS_<summary>.sql` 形式で追加し、既存ファイルは書き換えない。
- 1 migration = 1 意図（テーブル追加、RLS追加など）を原則とする。
- 認証系のユーザー識別は `auth.users.id` を唯一の基準にする。
- RLSは deny-by-default を前提に、必要な操作（SELECT/INSERT/UPDATE/DELETE）のみ許可する。
- secret / service role key はクライアント実装・環境変数例に含めない。

## 適用想定
- ローカル/CIでは Supabase CLI で `supabase/migrations` を適用する。
- 本番適用時は同一SQLを使い、手作業SQLとの差分運用を禁止する。

## 命名メモ
- 保存領域テーブルは「個人保存データ」と「ランキング公開データ」を分離する。
- 今回の個人保存テーブルは公開フラグを持たず、公開用途は別テーブルで扱う。
