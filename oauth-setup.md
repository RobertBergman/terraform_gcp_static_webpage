# OAuth2 Setup Instructions for Google Sign-In

## Steps to Configure OAuth2 in Google Cloud Console

### 1. Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project: `web-page-8ce1f44f`
3. Navigate to **APIs & Services** > **Credentials**
4. Click **+ CREATE CREDENTIALS** > **OAuth client ID**

### 2. Configure OAuth Consent Screen (if not already done)

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type
3. Fill in the required information:
   - App name: FatesBlind Portal
   - User support email: (your email)
   - Authorized domains: fatesblind.com
   - Developer contact: (your email)
4. Add scopes:
   - `openid`
   - `profile`
   - `email`
5. Add test users if in testing mode

### 3. Create OAuth Client ID

1. Application type: **Web application**
2. Name: **FatesBlind Web Client**
3. Authorized JavaScript origins:
   ```
   https://fatesblind.com
   http://localhost:8080 (for testing)
   ```
4. Authorized redirect URIs (not needed for implicit flow, but add for completeness):
   ```
   https://fatesblind.com/callback
   ```
5. Click **CREATE**

### 4. Update Your Website

1. Copy the **Client ID** from the credentials page
2. Update `index.html` (menu page):
   - Find: `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
   - Replace with your actual Client ID

### 5. Enable Required APIs

Run these commands or enable in Console:
```bash
gcloud services enable people.googleapis.com --project=web-page-8ce1f44f
gcloud services enable oauth2.googleapis.com --project=web-page-8ce1f44f
```

## Security Notes

- The Client ID is safe to expose in frontend code
- Never expose the Client Secret (not used in implicit flow)
- Session storage is used for demo purposes - consider more secure options for production
- Add proper CORS headers if needed

## Testing

1. Deploy the updated files
2. Navigate to https://fatesblind.com
3. Click "Sign in with Google"
4. Grant permissions
5. You should see your name and profile picture

## Troubleshooting

- If sign-in popup doesn't appear, check browser console for errors
- Ensure popup blockers are disabled
- Verify the domain is in the authorized JavaScript origins
- Check that the OAuth consent screen is configured properly