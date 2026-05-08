#!/usr/bin/env bash
set -euo pipefail

echo "== Frontend lint =="
pnpm lint

echo "== Frontend typecheck =="
pnpm typecheck

echo "== Frontend build =="
pnpm build

if command -v mvn >/dev/null 2>&1; then
  echo "== Backend test =="
  (cd apps/api && mvn -Dmaven.repo.local=../../.m2/repository test)
else
  echo "TODO(P0-stub): mvn is not available in this environment; backend test skipped."
  exit 1
fi
