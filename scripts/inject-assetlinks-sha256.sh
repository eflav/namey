#!/usr/bin/env bash
# Inject release cert SHA256 into public/.well-known/assetlinks.json
# Usage:
#   source /home/box/secrets/namey-signing.env   # or set NAMEY_* yourself
#   ./scripts/inject-assetlinks-sha256.sh
# Or:
#   NAMEY_CERT_SHA256=aabbcc... ./scripts/inject-assetlinks-sha256.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/.well-known/assetlinks.json"
PACKAGE_ID="${NAMEY_APPLICATION_ID:-app.namey.twa}"

if [[ -z "${NAMEY_CERT_SHA256:-}" ]]; then
  if [[ -n "${NAMEY_KEYSTORE:-}" && -n "${NAMEY_KEY_ALIAS:-}" && -n "${NAMEY_STORE_PASSWORD:-}" ]]; then
    NAMEY_CERT_SHA256=$(keytool -list -v \
      -keystore "$NAMEY_KEYSTORE" \
      -alias "$NAMEY_KEY_ALIAS" \
      -storepass "$NAMEY_STORE_PASSWORD" \
      | awk -F' ' '/SHA256:/{print $2}' | tr -d ':' | tr 'A-F' 'a-f')
  else
    echo "Set NAMEY_CERT_SHA256 or NAMEY_KEYSTORE + NAMEY_KEY_ALIAS + NAMEY_STORE_PASSWORD" >&2
    exit 1
  fi
fi

# Normalise: lowercase, no colons
FP=$(echo "$NAMEY_CERT_SHA256" | tr -d ':' | tr 'A-F' 'a-f')

mkdir -p "$(dirname "$OUT")"
cat > "$OUT" <<EOF
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "${PACKAGE_ID}",
      "sha256_cert_fingerprints": [
        "${FP}"
      ]
    }
  }
]
EOF
echo "Wrote $OUT"
echo "package_name=$PACKAGE_ID"
echo "sha256=$FP"
echo
echo "NOTE: Chrome fetches Digital Asset Links from the *origin root*:"
echo "  https://eflav.github.io/.well-known/assetlinks.json"
echo "This repo deploys to https://eflav.github.io/namey/.well-known/assetlinks.json"
echo "Copy the same JSON to an eflav.github.io user-site repo (or custom domain) for verification."
