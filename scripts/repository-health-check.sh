#!/usr/bin/env bash
set -euo pipefail
rg -q "docs/ai-protocol/README.md" README.md || { echo "README導線不足"; exit 1; }
for f in docs/ai-protocol/PROMPT.md docs/ai-protocol/adoption-guide.md .github/pull_request_template.md docs/logs/README.md docs/ai-prompts/README.md; do
  [[ -f "$f" ]] || { echo "不足: $f"; exit 1; }
done
echo "repository health: OK"
