# Fix OAuth Redirect URI Configuration

## Problem
Google OAuth is showing "Error 400: redirect_uri_mismatch" because the OAuth client doesn't have the correct redirect URIs configured for NextAuth.

## Solution

### Required Redirect URIs
Add these redirect URIs to your OAuth 2.0 Client ID in Google Cloud Console:

1. **Production URLs:**
   - `https://fatesblind.com/api/auth/callback/google`
   - `https://www.fatesblind.com/api/auth/callback/google`

2. **App Engine URL:**
   - `https://web-page-d9ec622e.uc.r.appspot.com/api/auth/callback/google`

3. **Development (optional):**
   - `http://localhost:3000/api/auth/callback/google`

### Steps to Update

1. **Open Google Cloud Console:**
   ```bash
   gcloud console --project=web-page-d9ec622e
   ```
   Or visit: https://console.cloud.google.com/apis/credentials?project=web-page-d9ec622e

2. **Navigate to OAuth 2.0 Client:**
   - Go to "APIs & Services" → "Credentials"
   - Find the OAuth 2.0 Client ID: `231662253958-lrvhdulmo2kpokvulhpas4odudou3ta4.apps.googleusercontent.com`
   - Click on it to edit

3. **Add Authorized Redirect URIs:**
   - In the "Authorized redirect URIs" section, add each of the URLs listed above
   - Click "ADD URI" for each one
   - Make sure to include the exact paths with `/api/auth/callback/google`

4. **Add JavaScript Origins (if needed):**
   - `https://fatesblind.com`
   - `https://www.fatesblind.com`
   - `https://web-page-d9ec622e.uc.r.appspot.com`

5. **Save Changes:**
   - Click "SAVE" at the bottom of the page
   - Changes may take a few minutes to propagate

### Alternative: Using gcloud CLI

Unfortunately, the gcloud CLI doesn't support directly modifying OAuth2 Web Application redirect URIs. You must use the Cloud Console web interface.

### Verification

After updating, test the authentication:
1. Visit https://fatesblind.com
2. Click "Sign In"
3. Should redirect to Google OAuth without errors
4. After authorization, should redirect back to your site

## Current OAuth Configuration

- **Client ID:** `231662253958-lrvhdulmo2kpokvulhpas4odudou3ta4.apps.googleusercontent.com`
- **Client Secret:** (stored in app.yaml as GOOGLE_CLIENT_SECRET)
- **NextAuth URL:** `https://fatesblind.com` (configured in app.yaml as NEXTAUTH_URL)

## Notes

- NextAuth automatically handles the callback at `/api/auth/callback/google`
- The redirect URI must match exactly what NextAuth sends to Google
- The NEXTAUTH_URL environment variable determines the base URL for callbacks