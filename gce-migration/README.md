# Google Compute Engine Migration Guide
## From App Engine to Compute Engine (Spot Instance)

This migration moves your Next.js app from App Engine to Compute Engine using a **spot (preemptible) instance** for cost savings.

## 🎯 Why Migrate?

| Feature | App Engine | Compute Engine (Spot) | Benefit |
|---------|-----------|---------------------|---------|
| **Cost** | ~$20-30/month | FREE (e2-micro free tier) | 100% savings* |
| **Control** | Limited | Full control | More flexibility |
| **Startup time** | Cold starts | Always warm | Better performance |
| **Custom software** | Limited | Install anything | Full customization |

\* e2-micro includes 744 hours/month free tier. Spot instances are 60-91% cheaper than regular instances.

## 💰 Cost Comparison

### Current (App Engine)
- App Engine F1: ~$20-30/month
- Cloud SQL: ~$15-20/month
- **Total: ~$35-50/month**

### New (Compute Engine Spot)
- e2-micro: **FREE** (744 hours/month free tier)
- If exceeding free tier: ~$7/month regular OR ~$2/month spot
- Cloud SQL: ~$15-20/month (unchanged)
- Load Balancer: ~$18/month (unchanged)
- **Total: ~$33-38/month (FREE for first 744 hours)**

**Savings**: Up to $15/month + better performance

## 📋 Prerequisites

1. **Existing infrastructure** (already have):
   - Cloud SQL PostgreSQL instance
   - Domain with SSL certificate
   - Load Balancer with static IP

2. **Local tools**:
   ```bash
   # Verify gcloud is installed
   gcloud --version

   # Verify Terraform is installed
   terraform --version
   ```

## 🚀 Quick Start (10 minutes)

### Step 1: Configure Variables

```bash
cd gce-migration

# Copy and edit Terraform variables
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars  # Add your actual OAuth credentials

# Actual credentials are stored in credentials.env (gitignored)
# See credentials.env for OAuth and database credentials
```

### Step 2: Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Review what will be created
terraform plan

# Deploy (takes ~3-5 minutes)
terraform apply
```

### Step 3: Deploy Your Application

```bash
# SSH into the new VM
gcloud compute ssh nextjs-vm --zone=us-central1-a

# Update the deployment script with your GitHub repo
sudo nano /root/deploy.sh
# Change: REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO.git"

# Deploy the application
sudo /root/deploy.sh

# Check status
pm2 status
pm2 logs nextjs-app
```

### Step 4: Update Load Balancer (Automatic)

Terraform automatically:
- ✅ Points your existing load balancer to the new VM
- ✅ Keeps your existing SSL certificate
- ✅ Maintains your existing static IP
- ✅ No DNS changes needed!

### Step 5: Verify & Cutover

```bash
# Test the new instance directly
curl http://[VM_IP]:3000

# Check via load balancer (may take 2-3 minutes for health checks)
curl https://fatesblind.com

# Monitor health
gcloud compute backend-services get-health nextjs-backend --global
```

## 🔄 Migration Strategy

### Option A: Instant Cutover (Recommended)
Terraform automatically switches the load balancer to the new VM. App Engine continues running as backup.

**Steps**:
1. Deploy Compute Engine VM
2. Deploy application on VM
3. Terraform updates load balancer (automatic)
4. Test thoroughly
5. Delete App Engine after 24 hours

### Option B: Gradual Migration
Use load balancer traffic splitting:

```bash
# Split traffic 50/50
gcloud compute backend-services update nextjs-backend \
  --global \
  --traffic-split=app-engine-backend=0.5,nextjs-backend=0.5

# Move to 100% Compute Engine
gcloud compute backend-services update nextjs-backend \
  --global \
  --traffic-split=nextjs-backend=1.0
```

## 📦 What Gets Deployed

### Infrastructure
- **Compute Engine e2-micro** instance (spot/preemptible)
- **Cloud SQL Proxy** (connects to existing database)
- **nginx** reverse proxy
- **PM2** process manager for Node.js
- **Let's Encrypt** SSL (optional, already have via load balancer)
- **Firewall rules** for HTTP/HTTPS/SSH

### Automatic Configuration
- Node.js 20.x installation
- Application directory at `/var/www/app`
- Environment variables from your existing config
- Startup scripts for deployment
- Health checks for load balancer

## 🔐 Security

The VM uses:
- **Service account** with minimal permissions
- **IAP** for SSH (no public SSH key needed)
- **Cloud SQL Proxy** for secure database connection
- **Firewall rules** restricting access
- **HTTPS** via existing load balancer

## 📊 Monitoring

### Check Application Status

```bash
# SSH to VM
gcloud compute ssh nextjs-vm --zone=us-central1-a

# Run monitoring script
sudo /root/monitor.sh
```

### View Logs

```bash
# Application logs
pm2 logs nextjs-app

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# Cloud SQL Proxy logs
sudo journalctl -u cloud-sql-proxy -f

# Startup script logs
sudo tail -f /var/log/startup-script.log
```

### Cloud Console Monitoring

1. Go to: https://console.cloud.google.com/compute/instances
2. Click on `nextjs-vm`
3. View monitoring tab for:
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network traffic

## 🔄 Deployment & Updates

### Manual Deployment

```bash
gcloud compute ssh nextjs-vm --zone=us-central1-a
sudo /root/deploy.sh
```

### Automated Deployment (GitHub Actions)

Create `.github/workflows/deploy-gce.yml`:

```yaml
name: Deploy to GCE

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Deploy to Compute Engine
        run: |
          gcloud compute ssh nextjs-vm \
            --zone=us-central1-a \
            --command="cd /var/www/app && \
              git pull origin main && \
              npm ci && \
              npm run build && \
              pm2 restart nextjs-app"
```

## 🐛 Troubleshooting

### Application not starting

```bash
# Check PM2 status
pm2 status

# View detailed logs
pm2 logs nextjs-app --lines 100

# Check if Cloud SQL Proxy is running
sudo systemctl status cloud-sql-proxy

# Restart everything
pm2 restart nextjs-app
sudo systemctl restart nginx
sudo systemctl restart cloud-sql-proxy
```

### Database connection issues

```bash
# Test Cloud SQL Proxy
sudo systemctl status cloud-sql-proxy

# Check database connectivity
psql -h localhost -U recipe_app -d recipe_generator

# Restart Cloud SQL Proxy
sudo systemctl restart cloud-sql-proxy
```

### Load balancer not routing traffic

```bash
# Check backend health
gcloud compute backend-services get-health nextjs-backend --global

# Check health check
curl http://[VM_IP]/

# View nginx status
sudo systemctl status nginx
sudo nginx -t
```

### Spot instance terminated

If GCP terminates your spot instance:

1. **Instance auto-recreates** (Terraform manages this)
2. **Application auto-starts** (via startup script)
3. **May take 3-5 minutes** to come back online

To avoid interruptions, set `use_spot_instance = false` in `terraform.tfvars`.

## 💡 Cost Optimization Tips

### Free Tier Usage (12 months)
- ✅ e2-micro: 744 hours/month FREE
- ✅ Use spot instance for 60-91% discount after free tier
- ✅ 30 GB storage included
- ✅ 1 GB egress to Americas/month

### After Free Tier
- Switch to spot instance: ~$2/month vs ~$7/month
- Consider committed use discounts for 1-3 years
- Use preemptible instances (spot) for even more savings

### Monitoring Costs

```bash
# Check current month's costs
gcloud billing accounts list
gcloud billing projects describe PROJECT_ID
```

## 🧹 Rollback Plan

If issues arise:

### 1. Quick Rollback (5 minutes)

```bash
# Point load balancer back to App Engine
# (Manual via console or save old terraform state)

# Or: Keep both running and switch DNS
```

### 2. Full Rollback

```bash
# Destroy Compute Engine resources
terraform destroy

# App Engine continues serving traffic
# No downtime!
```

## 📚 Maintenance

### Regular Updates

```bash
# SSH to VM
gcloud compute ssh nextjs-vm --zone=us-central1-a

# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js packages
cd /var/www/app
npm update
pm2 restart nextjs-app
```

### SSL Certificate Renewal

If using direct SSL (not via load balancer):

```bash
# Auto-renewal is configured
# Manual renewal:
sudo certbot renew

# Check expiration
sudo certbot certificates
```

## 🗑️ Cleanup Old Resources

After verifying everything works (wait 7-14 days):

```bash
# Delete App Engine (in ../terraform.tf)
# Comment out or remove:
# - google_app_engine_application
# - app-engine-backend.tf
# - app-engine-deploy.tf

terraform apply  # This will destroy App Engine resources
```

## 📈 Performance Comparison

| Metric | App Engine | Compute Engine | Improvement |
|--------|-----------|----------------|-------------|
| Cold Start | 2-5 seconds | None (always running) | ✅ Instant |
| Response Time | Variable | Consistent | ✅ Better |
| Memory | 256 MB (F1) | 1 GB (e2-micro) | ✅ 4x more |
| CPU | Shared | 2 shared vCPUs | ✅ Better |

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE.md` | Complete deployment procedures and troubleshooting |
| `QUICK_REFERENCE.txt` | Printable command reference card |
| `MIGRATION_COMPLETE.md` | Migration summary and success metrics |
| `FAILOVER.md` | **Emergency failover to App Engine backup** |
| `scripts/README.md` | Detailed deployment script documentation |

## 🆘 Support Resources

- [Compute Engine Docs](https://cloud.google.com/compute/docs)
- [Cloud SQL Proxy Guide](https://cloud.google.com/sql/docs/postgres/sql-proxy)
- [Spot Instances](https://cloud.google.com/compute/docs/instances/preemptible)
- [Free Tier](https://cloud.google.com/free/docs/free-cloud-features#compute)

## ✅ Post-Migration Checklist

- [ ] VM deployed and running
- [ ] Application deployed via PM2
- [ ] Database connectivity verified
- [ ] Load balancer routing traffic
- [ ] HTTPS working
- [ ] OAuth login working
- [ ] All features tested
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Team trained on new infrastructure
- [x] App Engine maintained as zero-cost fallback (see FAILOVER.md)
- [ ] Failover procedure documented and tested

---

**Ready to migrate?** Start with `terraform apply` 🚀

**Questions?** Check the troubleshooting section or Cloud Console logs.

**Cost tracking**: Monitor costs daily for first week in Cloud Console → Billing
