#!/usr/bin/env bash
# Pulls the permanent dev admin credential from Bitwarden into a local,
# gitignored cache so agents can read it without touching .env.
#
# Source of truth: Bitwarden item named below. This script only mirrors it.
# Rerun after rotating the password in Bitwarden.
set -euo pipefail

ITEM_NAME="powerkids-dev-admin"
OUT_FILE="_reference/secrets/dev-admin.json"

if ! command -v bw >/dev/null 2>&1; then
  echo "Bitwarden CLI not installed. Install: brew install bitwarden-cli" >&2
  exit 1
fi

if [ -z "${BW_SESSION:-}" ]; then
  echo "Vault locked. Run: export BW_SESSION=\$(bw unlock --raw)" >&2
  exit 1
fi

mkdir -p "$(dirname "$OUT_FILE")"

bw get item "$ITEM_NAME" | \
  jq '{email: .login.username, password: .login.password}' \
  > "$OUT_FILE"

echo "Wrote $OUT_FILE"
