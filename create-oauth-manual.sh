#!/bin/bash

echo "Creating OAuth2 Client for Google Sign-In"
echo "=========================================="

PROJECT_ID="web-page-8ce1f44f"

# Create OAuth consent screen (external)
echo "Creating OAuth consent screen..."
gcloud alpha iap oauth-brands create \
  --application_title="FatesBlind Portal" \
  --support_email="rob.bergman@gmail.com" \
  --project=$PROJECT_ID 2>/dev/null || echo "Brand might already exist or requires organization"

# Create OAuth2 client using the Identity Platform instead
echo ""
echo "Creating OAuth2 client credentials..."
gcloud alpha identity oauth-clients create \
  --display_name="FatesBlind Web Client" \
  --project=$PROJECT_ID \
  --type=web \
  --authorized_uris="https://fatesblind.com" \
  --authorized_redirect_uris="https://fatesblind.com/oauth2callback"

echo ""
echo "OAuth2 client created!"
echo "Update your index.html with the client ID shown above"