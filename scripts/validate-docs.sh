#!/usr/bin/env bash
set -euo pipefail
files=(
  docs/ai-protocol/PROMPT.md
  docs/ai-protocol/adoption-guide.md
  docs/ai-protocol/nte-commercial-policy.md
  docs/logs/README.md
  docs/ai-prompts/README.md
  docs/adr/README.md
  .github/pull_request_template.md
)
for f in "${files[@]}"; do [[ -f "$f" ]] || { echo "不足: $f"; exit 1; }; done
echo "docs validation: OK"
