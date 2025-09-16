# OAuth Troubleshooting Guide

## Current Error
`Error 400: redirect_uri_mismatch`
- Redirect URI being sent: `https://fatesblind.com/api/auth/callback/google`

## Checklist for Google Cloud Console OAuth Client

### 1. Authorized JavaScript Origins
Make sure these are added:
- `https://fatesblind.com`
- `https://www.fatesblind.com`
- `https://web-page-d9ec622e.uc.r.appspot.com`

### 2. Authorized Redirect URIs
Make sure these EXACT URIs are added (copy and paste them):
```
https://fatesblind.com/api/auth/callback/google
https://www.fatesblind.com/api/auth/callback/google
https://web-page-d9ec622e.uc.r.appspot.com/api/auth/callback/google
```

### 3. Common Issues to Check

1. **Trailing Slashes**: Make sure there's NO trailing slash after `google`
   - ✅ Correct: `https://fatesblind.com/api/auth/callback/google`
   - ❌ Wrong: `https://fatesblind.com/api/auth/callback/google/`

2. **HTTP vs HTTPS**: Must be `https://` not `http://`

3. **Exact Match**: The URI must match EXACTLY, including:
   - Protocol (https)
   - Domain (fatesblind.com)
   - Path (/api/auth/callback/google)

4. **Client ID Match**: Verify you're editing the correct OAuth client:
   - Client ID should be: `231662253958-lrvhdulmo2kpokvulhpas4odudou3ta4.apps.googleusercontent.com`

### 4. Propagation Time
- Changes can take 5-10 minutes to propagate
- Try clearing browser cache/cookies
- Try incognito/private browsing mode

### 5. Test in Incognito Mode
1. Open an incognito/private browser window
2. Navigate to https://fatesblind.com
3. Click "Sign In"
4. This bypasses any cached OAuth configurations

### 6. Alternative Test URLs
Try signing in from these URLs to see if any work:
- https://fatesblind.com
- https://www.fatesblind.com  
- https://web-page-d9ec622e.uc.r.appspot.com

### 7. Verify OAuth Client Settings
In Google Cloud Console, ensure:
- Application type: "Web application"
- OAuth client is not in "Testing" mode (should be in "Production")

### 8. Direct OAuth Test Link
Test the OAuth flow directly:
https://accounts.google.com/o/oauth2/v2/auth?client_id=231662253958-lrvhdulmo2kpokvulhpas4odudou3ta4.apps.googleusercontent.com&redirect_uri=https://fatesblind.com/api/auth/callback/google&response_type=code&scope=openid%20email%20profile

If this link gives an error, the redirect URI is definitely not configured correctly in the OAuth client.