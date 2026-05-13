#!/usr/bin/env bash
set -euo pipefail
for f in docs/ai-protocol/nte-commercial-policy.md docs/ai-protocol/templates/security-review-template.md docs/ai-protocol/templates/privacy-review-template.md docs/ai-protocol/templates/license-review-template.md docs/ai-protocol/templates/release-readiness-template.md docs/ai-protocol/templates/support-note-template.md docs/risks/risks.md; do
 [[ -f "$f" ]] || { echo "不足: $f"; exit 1; }
done
echo "commercial readiness: OK"
