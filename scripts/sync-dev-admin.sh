#!/usr/bin/env bash
# Writes the permanent dev admin credential into a local, gitignored cache
# so agents can read it without touching .env.
#
# Manual by design: does NOT call any password manager's CLI. A CLI unlock
# typically exports a session token into the shell, which grants ANY command
# run in that shell (including anything an agent gets tricked into running)
# read access to the whole vault, not just this one item. Instead, open your
# password manager yourself (app/browser/extension) and paste the fields
# below.
#
# Source of truth: the "powerkids dev admin" entry in your password manager.
# This script only mirrors it locally.
set -euo pipefail

OUT_FILE=".agents/secrets/dev-admin.json"
mkdir -p "$(dirname "$OUT_FILE")"

read -r -p "Dev admin name [Dev Admin]: " name
name="${name:-Dev Admin}"
read -r -p "Dev admin email: " email
read -r -s -p "Dev admin password: " password
echo

jq -n --arg name "$name" --arg email "$email" --arg password "$password" \
  '{name: $name, email: $email, password: $password}' \
  > "$OUT_FILE"
chmod 600 "$OUT_FILE"

echo "Wrote $OUT_FILE"
