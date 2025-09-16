# Cloud Identity Free Setup Guide for fatesblind.com

## Step-by-Step Instructions

### Step 1: Start Cloud Identity Setup

1. **Open this URL**: https://workspace.google.com/gcpidentity/signup
   
2. **Enter your information**:
   - Business name: `FatesBlind` (or your preferred name)
   - Number of employees: Select `Just you`
   - Country: Your country
   - Click **NEXT**

3. **Enter your domain**:
   - Domain name: `fatesblind.com`
   - Click **NEXT**

4. **Create your Cloud Identity account**:
   - First name: Rob
   - Last name: Bergman
   - Username: `admin` (will become admin@fatesblind.com)
   - Password: (create a strong password)
   - Click **NEXT**

### Step 2: Domain Verification

You'll need to verify you own fatesblind.com. Google will provide a TXT record.

**Expected TXT Record Format**:
```
Name/Host: @ or fatesblind.com
Type: TXT
Value: google-site-verification=XXXXXXXXXXXXXXXXXXXX
TTL: 3600 (or default)
```

**To add in NetworkSolutions**:
1. Log into NetworkSolutions.com
2. Navigate to your domain (fatesblind.com)
3. Go to **Advanced DNS Settings** or **Manage DNS**
4. Add new TXT record:
   - Record Type: TXT
   - Host: @ (or leave blank for root)
   - Value: (paste the google-site-verification string)
   - TTL: 3600
5. Save changes

**Verify in Cloud Identity**:
- Click **Verify** after adding the TXT record
- May take 5-10 minutes to propagate

### Step 3: Complete Setup

1. **Skip adding users** (you can do this later)
2. **Accept terms and conditions**
3. **Complete setup**

### Step 4: Get Your Organization ID

After setup completes, run:
```bash
# Wait a few minutes for propagation, then:
gcloud organizations list

# You should see:
# DISPLAY_NAME      ID                DIRECTORY_CUSTOMER_ID
# fatesblind.com    123456789012      C01abcdef
```

Save your organization ID (the numeric ID like `123456789012`).

### Step 5: Update Terraform Configuration

Once you have your organization ID, update terraform.tfvars:
```hcl
billing_account = "01D7B7-328031-6B8063"
organization_id = "YOUR_ORG_ID_HERE"  # Replace with your actual org ID
folder_id = ""
```

### Step 6: Move Existing Project to Organization

```bash
# Move your project to the new organization
gcloud projects move web-page-8ce1f44f \
  --organization=YOUR_ORG_ID

# Verify the move
gcloud projects describe web-page-8ce1f44f --format="value(parent.id)"
```

## Troubleshooting

### Can't find organization after setup?
```bash
# Re-authenticate
gcloud auth login admin@fatesblind.com

# List organizations again
gcloud organizations list
```

### Domain verification fails?
- Check TXT record with: `nslookup -type=TXT fatesblind.com`
- Wait 10-15 minutes for DNS propagation
- Try verification again

### Alternative admin email?
If you prefer using rob.bergman@gmail.com as admin:
- During setup, you can add rob.bergman@gmail.com as a super admin
- This allows management from your regular account

## Benefits After Setup

✅ Can create OAuth2 credentials via Terraform
✅ Centralized project management
✅ Organization-level IAM policies
✅ Better security and compliance options
✅ Free tier - no additional costs

## Next Steps

After you have your organization ID, we'll:
1. Update Terraform configuration
2. Deploy OAuth2 credentials automatically
3. Your website will have working Google Sign-In!

---

**Need help?** The setup wizard at https://workspace.google.com/gcpidentity/signup has built-in help and chat support.