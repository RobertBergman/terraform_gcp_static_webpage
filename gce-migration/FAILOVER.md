# 🔄 Emergency Failover Procedure

## Overview

App Engine version `20251010t054151` is maintained as a zero-cost emergency fallback. It receives no traffic from your domain but can be activated instantly if Compute Engine fails.

## Current Architecture

**Primary (Active):**
- Compute Engine e2-micro spot instance
- Load balancer routes all traffic here
- URL: https://fatesblind.com

**Fallback (Inactive):**
- App Engine version 20251010t054151
- Receives zero traffic from domain
- URL: https://web-page-d9ec622e.uc.r.appspot.com (still works)
- Cost: $0/month (no traffic = no cost)

---

## When to Failover

Use App Engine fallback when:
- Spot instance terminated and emergency-restore.sh fails
- Compute Engine has extended outage
- Critical production issue needs immediate fix
- Need time to troubleshoot VM issues

---

## Failover to App Engine (5 minutes)

### Option 1: Update Load Balancer Backend (Recommended)

```bash
# 1. Get the App Engine backend service name
gcloud compute backend-services list --global --project=web-page-d9ec622e

# 2. Update URL map to point to App Engine backend
# (You'll need to identify the App Engine backend service name first)
gcloud compute url-maps export website-url-map \
  --destination=/tmp/url-map.yaml \
  --global \
  --project=web-page-d9ec622e

# 3. Edit the YAML file to change defaultService to App Engine backend
nano /tmp/url-map.yaml

# 4. Import the updated URL map
gcloud compute url-maps import website-url-map \
  --source=/tmp/url-map.yaml \
  --global \
  --project=web-page-d9ec622e
```

**Time to take effect:** 1-2 minutes

### Option 2: Direct App Engine URL (Immediate)

If load balancer update fails, use App Engine URL directly:

```bash
# Test App Engine is working
curl -I https://web-page-d9ec622e.uc.r.appspot.com

# Temporarily update DNS (if you control DNS)
# Point fatesblind.com CNAME to: web-page-d9ec622e.uc.r.appspot.com
```

**Time to take effect:** DNS propagation (5-30 minutes)

---

## Verify Failover

```bash
# 1. Check what backend is serving traffic
curl -I https://fatesblind.com

# 2. Look for App Engine headers
# App Engine will have: x-cloud-trace-context, x-nextjs-cache
# Compute Engine will have: via: 1.1 google (from load balancer)

# 3. Check App Engine instances
gcloud app instances list --project=web-page-d9ec622e

# 4. Monitor App Engine logs
gcloud app logs tail --project=web-page-d9ec622e
```

---

## Failback to Compute Engine

Once Compute Engine is restored:

```bash
# 1. Verify VM is healthy
gcloud compute instances describe nextjs-vm \
  --zone=us-central1-a \
  --project=web-page-d9ec622e

# 2. Check application is running
gcloud compute ssh nextjs-vm \
  --zone=us-central1-a \
  --command="pm2 status"

# 3. Verify health check
gcloud compute backend-services get-health nextjs-backend \
  --global \
  --project=web-page-d9ec622e

# 4. Update load balancer back to Compute Engine
gcloud compute url-maps describe website-url-map \
  --global \
  --project=web-page-d9ec622e

# If currently pointing to App Engine, run:
cd /home/rbergman/google_cloud_website/gce-migration
terraform apply  # This will restore the correct backend
```

---

## Cost Impact

**During Normal Operation (Compute Engine):**
- App Engine: $0/month (no traffic)
- Compute Engine: FREE (e2-micro free tier) or $2/month (spot)

**During Failover (App Engine):**
- App Engine: ~$20-30/month (F1 instances handling traffic)
- Compute Engine: $0-2/month (still running but not serving traffic)

**Minimize failover costs:**
- Only use for critical emergencies
- Failback to Compute Engine ASAP
- Monitor App Engine costs during failover

---

## Testing Failover (Optional)

To test the failover procedure without affecting production:

```bash
# 1. Test App Engine endpoint directly
curl https://web-page-d9ec622e.uc.r.appspot.com

# 2. Check App Engine version is healthy
gcloud app versions describe 20251010t054151 \
  --service=default \
  --project=web-page-d9ec622e

# 3. Review App Engine logs
gcloud app logs read --limit=50 --project=web-page-d9ec622e
```

**Do NOT test by updating load balancer unless in actual emergency**

---

## Quick Reference

### Check Current Backend
```bash
gcloud compute url-maps describe website-url-map \
  --global \
  --format="get(defaultService)" \
  --project=web-page-d9ec622e
```

### App Engine URLs
- **Production (via load balancer):** https://fatesblind.com
- **App Engine direct:** https://web-page-d9ec622e.uc.r.appspot.com
- **GCP Console:** https://console.cloud.google.com/appengine

### Emergency Contacts
- **VM Status:** `gcloud compute instances list`
- **App Engine Status:** `gcloud app versions list`
- **Load Balancer:** `gcloud compute url-maps list`

---

## Important Notes

1. **Cannot delete App Engine** - Google Cloud permanent limitation
2. **Zero cost when inactive** - No traffic = no charges
3. **Always test App Engine URL** - Verify it works before emergency
4. **Terraform manages backend** - Use `terraform apply` to restore Compute Engine backend
5. **Keep App Engine updated** - If major changes, redeploy to App Engine too

---

**Last Updated:** November 2, 2025
**App Engine Version:** 20251010t054151
**Status:** INACTIVE (Fallback Mode)
