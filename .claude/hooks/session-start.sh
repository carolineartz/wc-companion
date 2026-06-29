#!/bin/bash
# SessionStart hook: install dependencies so `npm run build` / `npm run
# typecheck` work in Claude Code on the web sessions.
#
# Runs synchronously (no async JSON) so deps are guaranteed present before the
# session begins — no race with an early build/typecheck.
set -euo pipefail

# Only run in the remote (web) environment; local sessions manage their own deps.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Idempotent and cache-friendly: `npm install` reuses node_modules when the
# lockfile is unchanged (preferred over `npm ci`, which wipes node_modules).
echo "[session-start] installing npm dependencies…"
npm install --no-fund --no-audit

echo "[session-start] dependencies ready."
