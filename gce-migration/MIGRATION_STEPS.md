# Step-by-Step Migration Guide
## App Engine → Compute Engine

Follow these steps in order for a smooth migration.

---

## Before You Start

### ✅ Checklist
- [ ] Have `gcloud` CLI installed
- [ ] Have Terraform installed
- [ ] Have access to GCP project
- [ ] Know your Cloud SQL instance name
- [ ] Have GitHub repo with your Next.js code

### Get Cloud SQL Instance Name

```bash
# List Cloud SQL instances
gcloud sql instances list --project=web-page-d9ec622e

# Note the instance name (e.g., recipe-generator-db-a1b2c3d4)
```

---

## Phase 1: Setup (5 minutes)

### 1.1 Navigate to Migration Directory

```bash
cd gce-migration
```

### 1.2 Create Variables File

```bash
cp terraform.tfvars.example terraform.tfvars
```

### 1.3 Update terraform.tfvars

```hcl
project_id = "web-page-d9ec622e"
zone = "us-central1-a"
machine_type = "e2-micro"
use_spot_instance = true  # or false for guaranteed availability

# Copy from your app.yaml:
google_client_id = "your-client-id"
google_client_secret = "your-secret"
nextauth_secret = "your-nextauth-secret"
```

### 1.4 Update Instance Name Reference

Edit `compute_engine.tf` line 12-16 to use your actual Cloud SQL instance name:

```hcl
data "google_sql_database_instance" "existing_db" {
  name    = "recipe-generator-db-YOUR_SUFFIX"  # From step above
  project = var.project_id
}
```

---

## Phase 2: Deploy Infrastructure (5 minutes)

### 2.1 Initialize Terraform

```bash
terraform init
```

Expected output:
```
Initializing the backend...
Initializing provider plugins...
Terraform has been successfully initialized!
```

### 2.2 Review Planned Changes

```bash
terraform plan
```

Review what will be created:
- ✅ Compute Engine instance (e2-micro)
- ✅ Service account
- ✅ Firewall rules
- ✅ Backend service
- ✅ Load balancer configuration

### 2.3 Apply Configuration

```bash
terraform apply
```

Type `yes` when prompted.

This will take **3-5 minutes**.

### 2.4 Save Outputs

```bash
terraform output > deployment-info.txt
cat deployment-info.txt
```

Note the VM name and external IP.

---

## Phase 3: Deploy Application (5 minutes)

### 3.1 SSH to the New VM

```bash
gcloud compute ssh nextjs-vm --zone=us-central1-a --project=web-page-d9ec622e
```

### 3.2 Verify Services Are Running

```bash
# Check all services
sudo /root/monitor.sh
```

Expected output:
```
=== VM Status ===
up 5 minutes

=== Cloud SQL Proxy Status ===
● cloud-sql-proxy.service - Cloud SQL Proxy
   Active: active (running)

=== Nginx Status ===
● nginx.service
   Active: active (running)
```

### 3.3 Update Deployment Script

```bash
sudo nano /root/deploy.sh
```

Change line 6:
```bash
REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO.git"
```

Save: `Ctrl+X`, `Y`, `Enter`

### 3.4 Deploy Your Application

```bash
sudo /root/deploy.sh
```

This will:
1. Clone your repository
2. Install dependencies
3. Run Prisma migrations
4. Build Next.js
5. Start with PM2

Wait for completion (~2-3 minutes).

### 3.5 Verify Application

```bash
# Check PM2 status
pm2 status

# Should show:
# ┌─────┬──────────────┬─────────┬─────────┐
# │ id  │ name         │ status  │ restart │
# ├─────┼──────────────┼─────────┼─────────┤
# │ 0   │ nextjs-app   │ online  │ 0       │
# └─────┴──────────────┴─────────┴─────────┘

# View logs
pm2 logs nextjs-app --lines 50

# Test locally
curl http://localhost:3000
```

---

## Phase 4: Verify Load Balancer (5 minutes)

### 4.1 Check Backend Health

```bash
# From your local machine (not SSH)
gcloud compute backend-services get-health nextjs-backend --global --project=web-page-d9ec622e
```

Initial status may show "UNHEALTHY" - this is normal. Wait 2-3 minutes for health checks.

After 2-3 minutes, should show:
```
HEALTHY
```

### 4.2 Test Direct VM Access

```bash
# Get VM IP
VM_IP=$(terraform output -raw vm_external_ip)

# Test directly
curl http://$VM_IP/

# Should return HTML
```

### 4.3 Test via Load Balancer

```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://fatesblind.com

# Test HTTPS
curl -I https://fatesblind.com

# Should return 200 OK
```

### 4.4 Test in Browser

1. Open browser
2. Go to https://fatesblind.com
3. Test features:
   - [ ] Homepage loads
   - [ ] Google OAuth login works
   - [ ] Create recipe works
   - [ ] Database queries work

---

## Phase 5: Monitoring (Ongoing)

### 5.1 Set Up Monitoring Dashboard

1. Go to: https://console.cloud.google.com/compute/instances
2. Click on `nextjs-vm`
3. Click "Monitoring" tab
4. Pin to dashboard

### 5.2 Monitor Logs

```bash
# SSH to VM
gcloud compute ssh nextjs-vm --zone=us-central1-a

# Watch application logs
pm2 logs nextjs-app

# Watch nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Watch Cloud SQL Proxy
sudo journalctl -u cloud-sql-proxy -f
```

### 5.3 Set Up Alerts (Optional)

In Cloud Console:
1. Monitoring → Alerting → Create Policy
2. Set alerts for:
   - CPU > 80%
   - Memory > 80%
   - Instance down

---

## Phase 6: Parallel Running (24-48 hours)

### 6.1 Keep Both Systems Running

- ✅ App Engine: Continue serving traffic
- ✅ Compute Engine: Test thoroughly
- ✅ Monitor both for issues

### 6.2 Compare Performance

```bash
# Check response times
time curl https://fatesblind.com

# Use Chrome DevTools:
# - Network tab
# - Check TTFB (Time to First Byte)
# - Compare with App Engine version
```

### 6.3 Test Edge Cases

- [ ] Test with high load
- [ ] Test database-heavy operations
- [ ] Test file uploads (if applicable)
- [ ] Test OAuth flow completely
- [ ] Test on mobile devices
- [ ] Test on different browsers

---

## Phase 7: Cleanup App Engine (After 48 hours)

### 7.1 Verify Everything Working

Before deleting App Engine:
- [ ] Compute Engine running smoothly for 48+ hours
- [ ] No errors in logs
- [ ] All features tested
- [ ] Users report no issues
- [ ] Database working correctly

### 7.2 Take Final Backup

```bash
# Export database (just in case)
gcloud sql export sql recipe-generator-db-XXXXX \
  gs://YOUR_BUCKET/final-backup-$(date +%Y%m%d).sql \
  --database=recipe_generator \
  --project=web-page-d9ec622e
```

### 7.3 Delete App Engine Service

```bash
# Go back to main directory
cd ..

# Option A: Comment out in Terraform
# Edit app-engine-deploy.tf and comment out all resources

# Option B: Manual deletion
gcloud app services delete default --project=web-page-d9ec622e

# Confirm deletion
```

### 7.4 Clean Up Old Backend

```bash
# Remove old App Engine backend from load balancer
gcloud compute backend-services delete app-engine-backend --global
```

---

## Phase 8: Post-Migration Tasks

### 8.1 Update Documentation

- [ ] Update deployment procedures
- [ ] Update runbooks
- [ ] Update team wiki
- [ ] Document new SSH procedures

### 8.2 Set Up CI/CD (Optional)

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
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - run: |
          gcloud compute ssh nextjs-vm --zone=us-central1-a --command="
            cd /var/www/app &&
            git pull origin main &&
            npm ci &&
            npm run build &&
            pm2 restart nextjs-app
          "
```

### 8.3 Enable Automatic Backups

Already configured! But verify:

```bash
gcloud sql instances describe recipe-generator-db-XXXXX \
  --format="get(settings.backupConfiguration)"
```

### 8.4 Monitor Costs

Track for first month:

1. Go to: https://console.cloud.google.com/billing/reports
2. Filter by: "Compute Engine" service
3. Expected:
   - First 744 hours: $0 (free tier)
   - After: ~$2/month (spot) or ~$7/month (regular)

---

## Troubleshooting Common Issues

### Issue: Health check failing

```bash
# Check nginx is running
sudo systemctl status nginx

# Check nginx config
sudo nginx -t

# Check firewall
gcloud compute firewall-rules list --filter="name~'allow-http'"

# Test health check endpoint
curl http://localhost/
```

### Issue: Database connection failed

```bash
# Check Cloud SQL Proxy
sudo systemctl status cloud-sql-proxy
sudo journalctl -u cloud-sql-proxy -n 50

# Restart proxy
sudo systemctl restart cloud-sql-proxy

# Check connection string
cat /var/www/app/.env | grep DATABASE_URL
```

### Issue: Application crashing

```bash
# Check PM2 logs
pm2 logs nextjs-app --lines 100

# Check system resources
pm2 monit

# Restart app
pm2 restart nextjs-app
```

### Issue: Spot instance terminated

If your spot instance is terminated:

1. **Auto-recovery**: Terraform will recreate it (takes 3-5 minutes)
2. **Manual recovery**:
   ```bash
   terraform apply
   ```
3. **Prevent**: Set `use_spot_instance = false` in terraform.tfvars

---

## Success Criteria

Migration is successful when:

- ✅ Application running on Compute Engine
- ✅ All features working correctly
- ✅ Database connectivity confirmed
- ✅ OAuth authentication working
- ✅ Load balancer routing traffic
- ✅ HTTPS working
- ✅ No errors in logs for 48+ hours
- ✅ Performance equal or better than App Engine
- ✅ Costs reduced

---

## Emergency Rollback

If critical issues occur:

### Immediate Rollback (5 minutes)

```bash
# The App Engine is still running!
# Just update the load balancer to point back:

gcloud compute backend-services update website-url-map \
  --default-service=app-engine-backend \
  --global
```

### Full Rollback (10 minutes)

```bash
# Destroy Compute Engine
cd gce-migration
terraform destroy

# Verify App Engine is serving traffic
curl https://fatesblind.com
```

---

## Support

- **Terraform issues**: `terraform validate`, `terraform plan`
- **GCP issues**: Check Cloud Console logs
- **Application issues**: `pm2 logs`, nginx logs
- **Database issues**: Cloud SQL logs in console

---

## Timeline Summary

| Phase | Duration | Can Rollback? |
|-------|----------|---------------|
| Setup | 5 min | Yes |
| Deploy Infra | 5 min | Yes |
| Deploy App | 5 min | Yes |
| Verify | 5 min | Yes |
| Monitoring | 24-48 hrs | Yes |
| Cleanup | 10 min | No* |

\* Can recreate App Engine if needed

**Total: 20 minutes active work + 48 hours monitoring**

---

**Ready to start?** Begin with Phase 1: Setup! 🚀
