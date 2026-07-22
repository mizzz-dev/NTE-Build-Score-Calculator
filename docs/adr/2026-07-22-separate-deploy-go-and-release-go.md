# ADR: 初回本番deploy承認と公開継続判定を分離する

- 日付: 2026-07-22
- ステータス: 採用
- 関連Issue: #187

## 背景

従来の公開実行前Go判定では、本番URL一致、robots、sitemap、canonical、metadataなど、初回本番deploy後でなければ取得できない実測証跡をdeploy前必須条件として扱っていました。

その結果、以下の循環待ちが発生しました。

1. 本番deploy前のため本番実測証跡を取得できない。
2. 本番実測証跡がないためGo承認できない。
3. Go承認できないため本番deployできない。
4. 本番deployできないため証跡を取得できない。

Issue #181 / #183 / #185では、この条件構造によりNo-Go継続が反復しました。

## 決定

正式リリース承認を以下の2段階へ分離します。

### Gate A: Deploy-Go

初回本番deployを実施してよいかを判断します。deploy前に確認可能な情報のみを必須条件とします。

必須条件:
- deploy対象ブランチと対象コミットSHA
- CI / lint / test / build結果、または実行不能理由
- deploy実施者 / 実施責任者 / 記録責任者
- 本番環境変数設定済みの人間確認
- rollback参照コミットとrollback手順
- deploy後確認担当者と確認期限
- 人間のDeploy-Go承認

必須条件に含めないもの:
- 本番URL到達確認
- 本番robots / sitemap / canonical / metadata / OGP実測
- 主要導線の本番確認
- deploy実行ログURL

### Gate B: Release-Go

初回本番deploy後の実測結果に基づき、公開継続またはrollbackを判断します。

必須条件:
- deploy実行ログURLと結果
- 本番URL一致確認
- robots / sitemap / noindex相当の本番出力確認
- 主要導線確認
- canonical / metadata / OGP確認
- 重大不具合の有無
- rollback要否判定
- 人間のRelease-Go最終判断

## 理由

- 未deploy状態でもGate Aを判定できる。
- 本番実測証跡を取得するための初回deployを、安全な条件付きで許可できる。
- Gate A通過と正式公開完了を混同しない。
- deploy後の不具合に対して、明確な期限・担当者・rollback条件を設定できる。
- secretや環境変数値を保存せず、確認結果だけを証跡化できる。

## 却下した案

### 案1: 従来どおり本番実測証跡をdeploy前必須とする

循環待ちが解消せず、初回本番deployへ進めないため却下しました。

### 案2: 本番実測証跡を確認せず、一度のGo承認で正式公開完了とする

初回deploy後の不具合・robots誤設定・URL不一致を検出する統制が弱くなるため却下しました。

### 案3: AIが本番設定や証跡を推測して承認する

一次情報に基づかず、運用・セキュリティ上不適切なため却下しました。

## 影響

- 公開実行Runbookと証跡提出テンプレートの記録構造が変更される。
- 承認文言は`Deploy-Go`または`Release-Go`のどちらかを明記する必要がある。
- 初回deploy後、原則30分以内にGate Bを確認する運用が必要になる。
- アプリコード、DB、auth、infra、deployment workflow、保存payload仕様への変更はない。

## 運用上の注意

- Gate A通過を正式公開完了として扱わない。
- Gate B完了前に公開継続承認を記録しない。
- Gate Bで重大不具合または確認不能が発生した場合はrollback判定へ移行する。
- 環境変数値、secret、非公開管理画面情報はRepositoryへ保存しない。
- 人間承認や本番実測結果をAIが推測補完しない。
