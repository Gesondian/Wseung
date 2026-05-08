#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF'
Local development commands:

1. pnpm install
2. pnpm dev:infra
3. cd apps/api && mvn spring-boot:run
4. pnpm dev:web

Phase 0 / Phase 1 only provides skeleton applications.
EOF
