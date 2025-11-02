# ⚡ Quick Start - GCE Migration in 10 Minutes

## What You're Getting

- **FREE Compute Engine** e2-micro (744 hrs/month free tier)
- **Spot instance** option for 60-91% discount
- **Same database** (existing Cloud SQL)
- **Same domain & SSL** (existing load balancer)
- **Better performance** (no cold starts)

## 3-Step Migration

### Step 1: Deploy (5 minutes)

```bash
cd gce-migration

# Copy config
cp terraform.tfvars.example terraform.tfvars

# Deploy
terraform init
terraform apply -auto-approve
```

### Step 2: Deploy App (3 minutes)

```bash
# SSH to new VM
gcloud compute ssh nextjs-vm --zone=us-central1-a

# Update deploy script with your GitHub repo
sudo nano /root/deploy.sh
# Change line: REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO.git"

# Deploy
sudo /root/deploy.sh
```

### Step 3: Verify (2 minutes)

```bash
# Check app status
pm2 status
pm2 logs nextjs-app

# Test site (wait 2-3 mins for health checks)
curl https://fatesblind.com
```

Done! 🎉 Your app is running on Compute Engine.

## What Was Created?

```
┌─────────────────────────────────────────┐
│  Load Balancer (existing)               │
│  - fatesblind.com                       │
│  - SSL certificate ✓                    │
│  - Now points to new VM                 │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Compute Engine VM (NEW)                │
│  - e2-micro (FREE tier)                 │
│  - Spot instance (optional)             │
│  - nginx reverse proxy                  │
│  - PM2 process manager                  │
│  - Cloud SQL Proxy                      │
│  - Next.js app on port 3000             │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Cloud SQL (existing)                   │
│  - PostgreSQL database                  │
│  - Connected via Cloud SQL Proxy        │
└─────────────────────────────────────────┘
```

## Cost Comparison

| Item | Before (App Engine) | After (Compute Engine) |
|------|-------------------|---------------------|
| Compute | $20-30/month | **FREE** (or $2/mo spot) |
| Database | $15-20/month | $15-20/month (same) |
| Load Balancer | $18/month | $18/month (same) |
| **Total** | **$53-68/month** | **$33-38/month** |

**Savings: $15-30/month** (or more with spot instances)

## Common Commands

```bash
# SSH to VM
gcloud compute ssh nextjs-vm --zone=us-central1-a

# Check everything
sudo /root/monitor.sh

# View logs
pm2 logs nextjs-app

# Restart app
pm2 restart nextjs-app

# Redeploy
sudo /root/deploy.sh
```

## Troubleshooting

### App not starting?
```bash
pm2 logs nextjs-app
sudo systemctl status cloud-sql-proxy
```

### Load balancer not working?
```bash
# Check health (may take 2-3 minutes)
gcloud compute backend-services get-health nextjs-backend --global

# Check nginx
sudo systemctl status nginx
```

### Database connection failed?
```bash
# Restart Cloud SQL Proxy
sudo systemctl restart cloud-sql-proxy

# Test connection
psql -h localhost -U recipe_app -d recipe_generator
```

## Next Steps

1. **Test thoroughly** for 24 hours
2. **Monitor costs** in Cloud Console → Billing
3. **Delete App Engine** after verifying (see README.md)
4. **Set up CI/CD** with GitHub Actions (optional)

## Rollback

If something goes wrong:

```bash
# Keep App Engine running as backup
# It will continue serving traffic

# Destroy Compute Engine
terraform destroy
```

## FAQ

**Q: Will there be downtime?**
A: No! App Engine keeps running until you delete it.

**Q: What happens if spot instance is terminated?**
A: It automatically recreates (may take 3-5 minutes). Set `use_spot_instance = false` to avoid this.

**Q: How do I monitor costs?**
A: Cloud Console → Billing → Reports. e2-micro is free for 744 hrs/month.

**Q: Can I upgrade the instance size?**
A: Yes! Edit `terraform.tfvars` and change `machine_type = "e2-medium"` then run `terraform apply`.

**Q: Do I need to update DNS?**
A: No! Using your existing load balancer and static IP.

---

**Need help?** Check the detailed README.md

**Ready to deploy?** → `terraform apply` 🚀
