#!/usr/bin/env bash
set -euo pipefail
msg="${1:-$(git log -1 --pretty=%s)}"
if [[ "$msg" =~ ^Merge\  ]] || [[ "$msg" =~ bot ]]; then
  echo "除外対象コミットです"; exit 0
fi
if [[ ! "$msg" =~ : ]]; then
  echo "警告: 推奨形式 type(scope): 日本語要約"; exit 1
fi
summary="${msg#*: }"
if [[ "$summary" =~ [ぁ-んァ-ン一-龥] ]]; then
  echo "OK: 日本語要約を確認"; exit 0
fi
echo "エラー: 要約部分に日本語が必要です"; exit 1
