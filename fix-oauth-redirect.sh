#!/bin/bash

# Script to help fix OAuth redirect URI configuration

PROJECT_ID="web-page-d9ec622e"
CLIENT_ID="231662253958-lrvhdulmo2kpokvulhpas4odudou3ta4.apps.googleusercontent.com"

echo "=== OAuth Redirect URI Fix ==="
echo ""
echo "The error you're seeing means the redirect URI isn't configured in Google Cloud Console."
echo ""
echo "Opening Google Cloud Console OAuth Credentials page..."
echo ""

# Open the credentials page
CONSOLE_URL="https://console.cloud.google.com/apis/credentials?project=${PROJECT_ID}"
echo "If the browser doesn't open automatically, visit:"
echo "$CONSOLE_URL"
echo ""

# Try to open in browser
if command -v xdg-open > /dev/null; then
    xdg-open "$CONSOLE_URL" 2>/dev/null
elif command -v open > /dev/null; then
    open "$CONSOLE_URL" 2>/dev/null
fi

echo "=== INSTRUCTIONS ==="
echo ""
echo "1. Find the OAuth 2.0 Client ID:"
echo "   ${CLIENT_ID}"
echo ""
echo "2. Click on it to edit"
echo ""
echo "3. In 'Authorized redirect URIs' section, ADD these URIs:"
echo "   • https://fatesblind.com/api/auth/callback/google"
echo "   • https://www.fatesblind.com/api/auth/callback/google"
echo "   • https://web-page-d9ec622e.uc.r.appspot.com/api/auth/callback/google"
echo "   • http://localhost:3000/api/auth/callback/google (for local development)"
echo ""
echo "4. In 'Authorized JavaScript origins' section, ADD:"
echo "   • https://fatesblind.com"
echo "   • https://www.fatesblind.com"
echo "   • https://web-page-d9ec622e.uc.r.appspot.com"
echo "   • http://localhost:3000 (for local development)"
echo ""
echo "5. Click 'SAVE' at the bottom"
echo ""
echo "NOTE: Changes may take 5-10 minutes to propagate."
echo ""
echo "After saving, test at: https://fatesblind.com"