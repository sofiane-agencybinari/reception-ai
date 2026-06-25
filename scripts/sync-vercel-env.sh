#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v vercel >/dev/null 2>&1; then
  echo "Install: npm i -g vercel"
  exit 1
fi

ENV_FILE="${1:-.env.local}"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

SYNC_KEYS=(
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  NEXT_PUBLIC_DEFAULT_RESTAURANT_ID
  NEXT_PUBLIC_APP_LOGIN_ID
  NEXT_PUBLIC_APP_LOGIN_PASSWORD
  NEXT_PUBLIC_APP_URL
  NEXT_PUBLIC_ELEVENLABS_AGENT_ID
  ORDERS_WEBHOOK_SECRET
  TWILIO_ACCOUNT_SID
  TWILIO_AUTH_TOKEN
  TWILIO_FROM_NUMBER
  RESTAURANT_NAME
  ORDER_PREP_MINUTES
)

for key in "${SYNC_KEYS[@]}"; do
  value=$(grep -E "^${key}=" "$ENV_FILE" | head -1 | cut -d= -f2- || true)
  if [[ -z "${value}" ]]; then
    echo "skip $key (empty)"
    continue
  fi
  printf '%s' "$value" | vercel env add "$key" production preview development --force
  echo "synced $key"
done

echo "Done. Run: vercel --prod"
