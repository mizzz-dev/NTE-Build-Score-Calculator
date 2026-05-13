# AI Protocol README

## 目的
このディレクトリは、NTE-Build-Score-Calculator に **Level 3（商用・本番運用向け）** のAI開発プロトコルを適用し、継続保守・監査・安全運用を実現するためのルール群を管理します。

## 最初に読むファイル
1. `docs/ai-protocol/adoption-guide.md`
2. `docs/ai-protocol/PROMPT.md`
3. `docs/ai-protocol/nte-commercial-policy.md`
4. `docs/ai-protocol/core/definition-of-done.md`

## 役割分担
- `README.md`: リポジトリ入口・概要・導線
- `docs/ai-protocol/adoption-guide.md`: 導入手順と日常運用
- `docs/ai-protocol/PROMPT.md`: AIへ渡す正本
- `docs/ai-protocol/PROMPT.txt`: コピペ用テキスト

## 商用運用で特に確認すること
- 非公式ファンツール表記と権利確認
- 公式素材利用可否（要確認）
- Supabase認証と環境変数管理
- セキュリティ/プライバシー/ライセンス/リリース運用

## NTE固有リスク
- 公式素材やゲーム内情報の利用可否未確認
- OCR画像への個人情報混入
- service role key誤利用
- 商用化時の法務・サポート体制不足
