# Complete Organization Setup

## Current Status
✅ Cloud Identity created
✅ Domain verified (TXT record added)
❓ Organization not visible yet

## Steps to Complete Setup

### Option 1: Authenticate with Cloud Identity Admin Account

Run this in your terminal:
```bash
# Login with your Cloud Identity admin account
gcloud auth login admin@fatesblind.com
# Or if you used a different admin email during setup

# Then list organizations
gcloud organizations list

# You should see something like:
# DISPLAY_NAME      ID                DIRECTORY_CUSTOMER_ID
# fatesblind.com    123456789012      C01abcdef
```

### Option 2: Add Your Current Account to Organization

1. Go to: https://admin.google.com
2. Sign in with admin@fatesblind.com
3. Navigate to **Directory** → **Users**
4. Add user: rob.bergman@gmail.com
5. Assign role: **Super Admin** or **Organization Administrator**
6. Then run:
```bash
gcloud auth login rob.bergman@gmail.com
gcloud organizations list
```

### Option 3: Get Organization ID from Cloud Console

1. Visit: https://console.cloud.google.com/cloud-resource-manager
2. Sign in with admin@fatesblind.com (or your admin account)
3. You should see your organization at the top
4. Copy the Organization ID (numeric value)

## Once You Have the Organization ID

### 1. Update terraform.tfvars:
```bash
# Edit the file and add your org ID
nano terraform.tfvars
```

Update this line:
```hcl
organization_id = "YOUR_ORG_ID_HERE"  # e.g., "123456789012"
```

### 2. Move Your Project to the Organization:
```bash
# Replace ORG_ID with your actual organization ID
gcloud projects move web-page-8ce1f44f --organization=ORG_ID
```

### 3. Deploy OAuth2 with Terraform:
```bash
# Initialize and apply
export GOOGLE_OAUTH_ACCESS_TOKEN=$(gcloud auth print-access-token)
terraform plan
terraform apply
```

## Manual Organization ID Entry

If you know your organization ID, you can directly:

1. Update terraform.tfvars:
```bash
echo 'organization_id = "YOUR_ORG_ID"' >> terraform.tfvars
```

2. Continue with Terraform deployment

## Troubleshooting

### Can't see organization?
- Make sure you're logged in with an account that has organization access
- Cloud Identity propagation can take up to 24 hours (usually much faster)
- Try accessing https://console.cloud.google.com with your admin account

### Permission denied when moving project?
- You need to be organization admin or have resourcemanager.projects.move permission
- Login with admin@fatesblind.com or grant permissions to rob.bergman@gmail.com

## Next Steps

Once you provide the organization ID, I can:
1. Update all configurations automatically
2. Move your project
3. Deploy OAuth2
4. Get Google Sign-In working!

Just tell me your organization ID (the numeric value like 123456789012) and we'll continue!