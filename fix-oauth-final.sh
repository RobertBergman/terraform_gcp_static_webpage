#!/bin/bash

PROJECT_ID="web-page-d9ec622e"
CLIENT_ID="231662253958-lrvhdulmo2kpokvulhpas4odudou3ta4.apps.googleusercontent.com"

echo "=== OAuth Fix - Final Steps ==="
echo ""
echo "Since you've already added the redirect URIs hours ago, let's try these solutions:"
echo ""

echo "SOLUTION 1: Clear browser cache and cookies"
echo "--------------------------------------------"
echo "1. Clear all cookies for:"
echo "   - accounts.google.com"
echo "   - fatesblind.com"
echo "   - *.appspot.com"
echo ""
echo "2. Try in an incognito/private window"
echo ""
echo "3. Try a different browser"
echo ""

echo "SOLUTION 2: Verify EXACT redirect URI match"
echo "--------------------------------------------"
echo "The error shows the exact redirect URI being used:"
echo "redirect_uri=https://fatesblind.com/api/auth/callback/google"
echo ""
echo "Open this URL to verify it's in your OAuth client:"
echo "https://console.cloud.google.com/apis/credentials/oauthclient/${CLIENT_ID}?project=${PROJECT_ID}"
echo ""
echo "Make sure this EXACT URI is listed (no trailing slash, exact case):"
echo "https://fatesblind.com/api/auth/callback/google"
echo ""

echo "SOLUTION 3: Check for multiple OAuth clients"
echo "--------------------------------------------"
echo "There might be another OAuth client that's actually being used."
echo "Check ALL OAuth 2.0 clients at:"
echo "https://console.cloud.google.com/apis/credentials?project=${PROJECT_ID}"
echo ""
echo "Look for any OAuth 2.0 Web Application clients and check each one."
echo ""

echo "SOLUTION 4: Force App Engine redeployment"
echo "--------------------------------------------"
echo "Sometimes the app needs to be redeployed to pick up env changes:"
echo ""
read -p "Do you want to redeploy the App Engine app? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Redeploying App Engine..."
    cd nextjs-site
    npm run build
    gcloud app deploy app.yaml --project=$PROJECT_ID --quiet --version=oauth-fix-$(date +%Y%m%d%H%M%S)
    echo "Deployment complete. Wait 2-3 minutes for it to become active."
else
    echo "Skipping redeployment."
fi

echo ""
echo "SOLUTION 5: Test with direct App Engine URL"
echo "--------------------------------------------"
echo "Try signing in via the App Engine URL directly:"
echo "https://web-page-d9ec622e.uc.r.appspot.com"
echo ""
echo "If this works, the issue is with the domain routing."
echo ""

echo "SOLUTION 6: Create a new OAuth client (last resort)"
echo "--------------------------------------------"
echo "If nothing else works, create a NEW OAuth 2.0 Web Application client:"
echo "1. Go to: https://console.cloud.google.com/apis/credentials?project=${PROJECT_ID}"
echo "2. Click '+ CREATE CREDENTIALS' → 'OAuth client ID'"
echo "3. Choose 'Web application'"
echo "4. Add these redirect URIs:"
echo "   - https://fatesblind.com/api/auth/callback/google"
echo "   - https://www.fatesblind.com/api/auth/callback/google"
echo "   - https://web-page-d9ec622e.uc.r.appspot.com/api/auth/callback/google"
echo "5. Update app.yaml and .env.local with the new client ID and secret"
echo "6. Redeploy the app"
echo ""

echo "Current OAuth Test URL:"
echo "https://fatesblind.com"