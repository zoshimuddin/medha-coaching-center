#!/usr/bin/env bash
# Apply SQL files to the Supabase project through the Management API.
# No database password needed — only a Supabase Personal Access Token.
#
# Usage:
#   SUPABASE_ACCESS_TOKEN=sbp_xxx ./supabase/apply.sh supabase/20261018_fee_sync.sql
#   # token may also live in ~/.supabase/access-token (from: supabase login --token ...)
#
# Every migration must be safe to run more than once (create/replace, if not exists).
set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-mlsyvhlnnjexqtaswayi}"
TOKEN="${SUPABASE_ACCESS_TOKEN:-}"
if [ -z "$TOKEN" ] && [ -f "$HOME/.supabase/access-token" ]; then
  TOKEN="$(tr -d '\r\n' < "$HOME/.supabase/access-token")"
fi
if [ -z "$TOKEN" ]; then
  echo "No Supabase access token. Set SUPABASE_ACCESS_TOKEN or run: supabase login --token <sbp_...>" >&2
  exit 1
fi
if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <file.sql> [more.sql ...]" >&2
  exit 1
fi

fail=0
for f in "$@"; do
  if [ ! -f "$f" ]; then
    echo "==> skip (not found): $f" >&2
    fail=1
    continue
  fi
  echo "==> applying $f"
  out="$(mktemp)"
  payload="$(python3 -c 'import json,sys; print(json.dumps({"query": sys.stdin.read()}))' < "$f")"
  code="$(curl -sS -o "$out" -w '%{http_code}' \
    -X POST "https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$payload")"
  if [ "$code" = "200" ] || [ "$code" = "201" ]; then
    echo "    OK ($code)"
  else
    echo "    FAILED ($code):" >&2
    cat "$out" >&2
    echo >&2
    fail=1
  fi
  rm -f "$out"
done

if [ "$fail" -ne 0 ]; then
  echo "One or more migrations failed." >&2
  exit 1
fi
echo "All migrations applied."
