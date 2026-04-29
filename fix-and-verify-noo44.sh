#!/usr/bin/env bash
set -e

WEBSITE_DIR="/home/chris/Projects/work/Nootropicstacker.com/Website"

echo "=== NOO-44 Build Verification ==="
echo "This script will:"
echo "  1. Fix node_modules ownership (requires sudo)"
echo "  2. Reinstall dependencies"
echo "  3. Checkout feat/utm-affiliate-noo44 and run the production build"
echo "  4. Grep the bundle to confirm UTM parameters are present"
echo ""
read -rp "Proceed? [y/N] " confirm
[[ "$confirm" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }

cd "$WEBSITE_DIR"

echo ""
echo "[1/4] Fixing node_modules ownership..."
sudo chown -R chris:chris "$WEBSITE_DIR/node_modules"
echo "      Done."

echo ""
echo "[2/4] Reinstalling dependencies..."
pnpm install --frozen-lockfile
echo "      Done."

echo ""
echo "[3/4] Switching to feat/utm-affiliate-noo44 and building..."
git checkout feat/utm-affiliate-noo44
npm run build
echo "      Build complete."

echo ""
echo "[4/4] Verifying UTM parameters in bundle..."
TOTAL_AMAZON=$(grep -oE 'amazon\.com[^"\\s]*' dist/assets/*.js 2>/dev/null | grep -c 'tag=nootropicstk-20' || true)
UTM_COUNT=$(grep -oE 'amazon\.com[^"\\s]*' dist/assets/*.js 2>/dev/null | grep -c 'utm_campaign' || true)
MISSING=$((TOTAL_AMAZON - UTM_COUNT))

echo ""
echo "  Amazon URLs with tag=nootropicstk-20 : $TOTAL_AMAZON"
echo "  Of those with utm_campaign            : $UTM_COUNT"
echo "  Missing UTMs                          : $MISSING"

if [[ "$MISSING" -eq 0 && "$UTM_COUNT" -gt 0 ]]; then
  echo ""
  echo "PASS — All Amazon affiliate URLs carry UTM parameters."
else
  echo ""
  echo "FAIL — $MISSING Amazon URL(s) are missing UTM parameters."
  echo "Offending URLs:"
  grep -oE 'amazon\.com[^"\\s]*tag=nootropicstk-20[^"\\s]*' dist/assets/*.js 2>/dev/null | grep -v 'utm_campaign' | head -20 || true
fi
