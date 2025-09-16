# Get Your Organization ID

## Run These Commands Locally

Since you created the Cloud Identity with **rbergman@fatesblind.com**, run these commands in your local terminal:

### Step 1: Authenticate
```bash
gcloud auth login rbergman@fatesblind.com
```

### Step 2: Get Organization ID
```bash
gcloud organizations list
```

You should see output like:
```
DISPLAY_NAME      ID                DIRECTORY_CUSTOMER_ID
fatesblind.com    123456789012      C01abcdef
```

### Step 3: Copy the ID
The **ID** column (e.g., `123456789012`) is your organization ID.

## Alternative: Check in Cloud Console

1. Go to: https://console.cloud.google.com
2. Sign in with: **rbergman@fatesblind.com**
3. Look at the top of the page or go to:
   - https://console.cloud.google.com/cloud-resource-manager
4. Your organization ID will be displayed

## Once You Have the ID

Just tell me the organization ID (the 12-digit number) and I'll:
1. Update all configurations
2. Move your project to the organization
3. Deploy OAuth2
4. Get everything working!

---

**Quick Check**: The organization ID is a 12-digit number like `123456789012`