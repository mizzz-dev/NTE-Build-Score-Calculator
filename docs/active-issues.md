# Active Issues（Context Bootstrap）

最終更新: 2026-05-15（PR #136 merge後処理 / Issue #137 作成反映）

## 1. 現在Open Issue

- #137: 正式リリース前の品質・SEO・規約表示確認（open）
- #135: 条件付き正式展開後のOCR監視運用を月次サイクルへ移行（完了）
- #133: `image_quality_low` 起因の事前撮影ガイド・再撮影導線改善（完了）
- #131: `/compare` 比較ブロック理由に応じて案内文を出し分ける（完了）
- #129: `/compare` OCRの未確定項目解消フローのUX文言改善（完了）
- #127: `/compare` OCR正式展開後の監視運用定常化と残リスク改善方針整理（完了）

> 要確認: GitHub上のOpen Issueは変動するため、着手時に必ず最新一覧を同期すること。

## 2. 次にやるべきIssue候補

1. #137: 正式リリース前の品質・SEO・規約表示確認
2. 利用規約・免責・非公式ファンツール表記の改善Issue
3. 商用利用前の権利・法務確認
4. 正式リリース準備・リリースノート作成

## 3. 優先順位（暫定）

- P1: #137 正式リリース前の品質・SEO・規約表示確認
- P1: 非公式ファンツール表記・免責・プライバシー説明の確認
- P1: secretや環境変数が公開されていないことの確認
- P2: 正式リリース準備・リリースノート作成
- P2: 商用利用前の権利・法務確認

## 4. Blocker

- Issue #135 / PR #136 は完了済み。
- 次は正式リリース前の品質・SEO・規約表示確認を行う。
- OCRアルゴリズム、OCR信頼度計算、DB、auth、infra、deployment、保存payload仕様、ランキング仕様は引き続き変更しない。
- 法務判断の確定は本Issueの対象外とし、要確認事項を整理する。

## 5. Handoff情報

- まず `docs/current-status.md` と `docs/ai-protocol/PROMPT.txt` を読む。
- 次に `docs/runbooks/compare-ocr-release-runbook.md`、`docs/runbooks/compare-ocr-monthly-audit-runbook.md`、`docs/logs/compare-ocr-monthly-audit-template.md` を確認する。
- Issue #137では、品質・SEO・規約・非公式表記・secret取扱いを確認し、不足があれば改善Issue候補を整理する。
- 公式素材・名称・ゲーム内情報・画像などの利用可否は要確認として扱う。
- 評価画像や個人情報をRepositoryへ保存しない。
