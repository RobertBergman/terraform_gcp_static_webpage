#!/bin/bash

echo "=== OAuth Diagnostic Script ==="
echo ""

PROJECT_ID="web-page-d9ec622e"
CLIENT_ID="231662253958-lrvhdulmo2kpokvulhpas4odudou3ta4.apps.googleusercontent.com"

echo "1. Checking deployed App Engine configuration..."
echo "----------------------------------------"
gcloud app versions list --project=$PROJECT_ID --format="table(version.id,traffic_split,serving_status)" | head -5

echo ""
echo "2. Testing OAuth endpoints..."
echo "----------------------------------------"
echo "Testing https://fatesblind.com/api/auth/providers:"
curl -s "https://fatesblind.com/api/auth/providers" | python3 -m json.tool 2>/dev/null | head -20

echo ""
echo "3. Attempting OAuth flow..."
echo "----------------------------------------"
AUTH_URL="https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=https://fatesblind.com/api/auth/callback/google&response_type=code&scope=openid%20email%20profile"
echo "OAuth authorization URL:"
echo "$AUTH_URL"
echo ""
echo "Testing if redirect_uri is registered (checking HTTP response):"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" -I "$AUTH_URL"

echo ""
echo "4. Checking all possible OAuth client IDs in use..."
echo "----------------------------------------"
echo "In app.yaml:"
grep -i "GOOGLE_CLIENT_ID" nextjs-site/app.yaml 2>/dev/null | cut -d'"' -f2

echo ""
echo "In .env.local:"
grep -i "GOOGLE_CLIENT_ID" nextjs-site/.env.local 2>/dev/null | cut -d'"' -f2

echo ""
echo "5. Testing direct App Engine URL..."
echo "----------------------------------------"
APP_ENGINE_URL="https://web-page-d9ec622e.uc.r.appspot.com"
echo "Testing $APP_ENGINE_URL/api/auth/providers:"
curl -s "$APP_ENGINE_URL/api/auth/providers" | python3 -m json.tool 2>/dev/null | head -10

echo ""
echo "6. Verifying DNS and routing..."
echo "----------------------------------------"
echo "DNS lookup for fatesblind.com:"
nslookup fatesblind.com | grep -A2 "Non-authoritative"

echo ""
echo "7. IMPORTANT: Manual verification needed"
echo "----------------------------------------"
echo "Please verify in Google Cloud Console that these EXACT URLs are added:"
echo ""
echo "Required Redirect URIs:"
echo "  ✓ https://fatesblind.com/api/auth/callback/google"
echo "  ✓ https://www.fatesblind.com/api/auth/callback/google"
echo "  ✓ https://web-page-d9ec622e.uc.r.appspot.com/api/auth/callback/google"
echo ""
echo "Required JavaScript Origins:"
echo "  ✓ https://fatesblind.com"
echo "  ✓ https://www.fatesblind.com"
echo "  ✓ https://web-page-d9ec622e.uc.r.appspot.com"
echo ""
echo "Console URL: https://console.cloud.google.com/apis/credentials/oauthclient/${CLIENT_ID}?project=${PROJECT_ID}"
echo ""
echo "NOTE: There might be multiple OAuth clients. Make sure you're editing the right one!"
echo "Client ID that MUST be configured: ${CLIENT_ID}"