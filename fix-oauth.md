# Fix OAuth2 for Public Access

The current OAuth2 setup is restricted to organization users only. To allow any Google user to sign in, you need to:

## Steps to Fix OAuth2:

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/apis/credentials?project=web-page-d9ec622e

### 2. Configure OAuth Consent Screen
1. Click on "OAuth consent screen" in the left menu
2. Select **External** user type (not Internal)
3. Fill in the required information:
   - App name: FatesBlind Portal
   - User support email: rbergman@fatesblind.com
   - App domain: https://fatesblind.com
   - Authorized domains: fatesblind.com
   - Developer contact: rbergman@fatesblind.com
4. Save and continue through the scopes (you can skip adding scopes)
5. Add test users if in testing mode, or publish the app

### 3. Create New OAuth 2.0 Client ID
1. Go to "Credentials" tab
2. Click "+ CREATE CREDENTIALS" > "OAuth client ID"
3. Choose "Web application"
4. Name: FatesBlind Web Client
5. Authorized JavaScript origins:
   - https://fatesblind.com
   - https://storage.googleapis.com
   - http://localhost (for testing)
6. Authorized redirect URIs (not needed for Google Sign-In JavaScript SDK)
7. Click "CREATE"

### 4. Update Your Website
1. Copy the new Client ID (will look like: XXXXXXXXXX.apps.googleusercontent.com)
2. Update the index.html with the new client ID:

```bash
# Edit the index.html.tpl file to use the new client ID
sed -i 's/231662253958-lrvhdulmo2kpokvulhpas4odudou3ta4/YOUR_NEW_CLIENT_ID/g' index.html.tpl

# Regenerate and deploy
terraform apply -auto-approve
```

## Current Issue
The current OAuth client (231662253958-lrvhdulmo2kpokvulhpas4odudou3ta4.apps.googleusercontent.com) is an IAP client that only works for organization members. You need a standard OAuth2 Web Application client for public access.

## Alternative: Keep Organization-Only Access
If you want to keep it restricted to your organization users:
1. Add users to your organization at https://admin.google.com
2. They can then sign in with their @fatesblind.com accounts