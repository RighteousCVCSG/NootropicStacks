#!/usr/bin/env bash
# NootropicStacker — Plausible Analytics Setup Guide
# ======================================================
# Purpose: Guide the user through creating a Plausible account and
# verifying the analytics installation.
#
# The Plausible script tag is already in index.html (live on site).
# After account creation, stats will start flowing automatically.
#
# Prerequisites:
#   - A web browser at https://plausible.io
#   - Access to nootropicstacker.com DNS (to verify)
#
# Steps:
#   1. Open https://plausible.io in your browser
#   2. Click "Start Trial" / "Get Started"
#   3. Sign up with your email (recommend cmo@nootropicstacker.com or
#      a shared team inbox so the dashboard is accessible to multiple people)
#   4. Add domain: nootropicstacker.com
#   5. Choose the "JavaScript snippet" method (already installed)
#   6. The script in index.html uses: script.tagged-events.outbound-links.js
#      which enables custom events + outbound link tracking
#   7. Click "Verify" — Plausible will check the script tag is present
#   8. Share the dashboard URL with the team:
#      https://plausible.io/nootropicstacker.com
#
# Custom events already wired:
#   - pageview (auto on every route change via App.jsx)
#   - affiliate_click (auto capture-phase listener in main.jsx)
#   - stack_add (when a supplement is added in StackContext)
#   - email_signup (on successful newsletter subscribe)
#
# To verify events are firing:
#   1. Open https://nootropicstacker.com in a browser
#   2. Open DevTools → Network tab
#   3. Filter by "plausible"
#   4. Navigate around the site — you should see POST requests to
#      plausible.io/api/event for each pageview
#   5. Add a supplement to a stack → look for 'stack_add' event
#   6. Submit the newsletter form → look for 'email_signup' event
#   7. Click an Amazon affiliate link → look for 'affiliate_click' event
#
# Troubleshooting:
#   - Events not showing? Check that `data-domain` in index.html
#     matches the domain registered in your Plausible account
#   - Script not loading? Check that plausible.io is not blocked
#     by corporate DNS/network filters
#   - Use Plausible's "Live" view in the dashboard for real-time
#     event verification — it's faster than refreshing the Network tab

set -euo pipefail

echo "=== NootropicStacker — Plausible Analytics Setup ==="
echo ""
echo "The analytics code is already deployed."
echo ""
echo "To complete setup:"
echo "  1. Open https://plausible.io and create an account"
echo "  2. Add domain: nootropicstacker.com"
echo "  3. Use the 'JavaScript snippet' method (already in index.html)"
echo "  4. Verify the script tag is detected"
echo "  5. Share dashboard at https://plausible.io/nootropicstacker.com"
echo ""
echo "Custom events wired in this deployment:"
echo "  - pageview        (every route change)"
echo "  - affiliate_click (Amazon links with tag=nootropicstk-20)"
echo "  - stack_add       (supplement added to stack)"
echo "  - email_signup    (newsletter subscription)"
echo ""
echo "For step-by-step verification instructions, read this script."
