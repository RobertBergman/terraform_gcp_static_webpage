# 🚀 Complete Deployment Guide

## Quick Reference Card

```bash
# 📦 Regular Deployment (most common)
cd gce-migration/scripts
./deploy-to-vm.sh

# 🆘 Emergency Restore (spot instance terminated)
cd gce-migration/scripts
./emergency-restore.sh

# 🔍 Check Status
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 status"

# 📊 View Logs
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 logs"

# 🏥 Check Health
gcloud compute backend-services get-health nextjs-backend --global
```

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Deployment Scripts](#deployment-scripts)
3. [Common Tasks](#common-tasks)
4. [Troubleshooting](#troubleshooting)
5. [Monitoring](#monitoring)
6. [Disaster Recovery](#disaster-recovery)

---

## Quick Start

### First Time Setup (Already Done!)

✅ Infrastructure deployed
✅ VM configured
✅ Application running
✅ Load balancer connected
✅ SSL certificate working

### Making Changes and Deploying

```bash
# 1. Make your code changes in nextjs-site/
cd nextjs-site
# ... edit files ...

# 2. Test locally (optional)
npm run dev

# 3. Deploy to production
cd ../gce-migration/scripts
./deploy-to-vm.sh
```

That's it! The script handles everything.

---

## Deployment Scripts

### 📦 `deploy-to-vm.sh` - Main Deployment

**Use this 90% of the time**

```bash
cd gce-migration/scripts
./deploy-to-vm.sh
```

**What happens:**
1. ✅ Builds app locally (ensures it compiles)
2. ✅ Creates package
3. ✅ Uploads to VM
4. ✅ Installs dependencies
5. ✅ Runs build on VM
6. ✅ Restarts app with zero downtime
7. ✅ Verifies deployment

**Time**: ~3-5 minutes

---

### 🔧 `vm-setup.sh` - VM Initialization

**Use when:** VM is new or recreated

```bash
# Copy to VM
gcloud compute scp gce-migration/scripts/vm-setup.sh nextjs-vm:/tmp/ --zone=us-central1-a

# Run on VM
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="bash /tmp/vm-setup.sh"
```

**Installs:**
- Node.js 20.x
- PM2 (process manager)
- nginx (reverse proxy)
- Cloud SQL Proxy
- All system configurations

**Time**: ~5-7 minutes

---

### ⚡ `quick-deploy.sh` - Fast Deploy on VM

**Use when:** You're already SSH'd into the VM

```bash
# SSH first
gcloud compute ssh nextjs-vm --zone=us-central1-a

# Then run
cd /var/www/app
bash /tmp/quick-deploy.sh
```

**Time**: ~2-3 minutes

---

### 🆘 `emergency-restore.sh` - Complete Recovery

**Use when:** Spot instance terminated or system failure

```bash
cd gce-migration/scripts
./emergency-restore.sh
```

**Handles:**
1. Checks if VM exists
2. Sets up complete environment
3. Deploys application
4. Verifies everything works

**Time**: ~10-15 minutes

---

## Common Tasks

### Update Application Code

```bash
cd gce-migration/scripts
./deploy-to-vm.sh
```

### Restart Application

```bash
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 restart nextjs-app"
```

### View Logs

```bash
# Real-time logs
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 logs nextjs-app"

# Last 50 lines
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 logs nextjs-app --lines 50 --nostream"
```

### Check Application Status

```bash
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 status"
```

### Update Environment Variables

```bash
# SSH to VM
gcloud compute ssh nextjs-vm --zone=us-central1-a

# Edit .env
nano /var/www/app/.env

# Restart app
pm2 restart nextjs-app
```

### Run Database Migrations

```bash
gcloud compute ssh nextjs-vm --zone=us-central1-a

cd /var/www/app
npx prisma migrate deploy
pm2 restart nextjs-app
```

---

## Troubleshooting

### Application Not Responding

```bash
# Check PM2 status
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 status"

# Check logs for errors
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 logs --lines 100"

# Restart app
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 restart nextjs-app"
```

### Database Connection Issues

```bash
# Check Cloud SQL Proxy
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="sudo systemctl status cloud-sql-proxy"

# Restart proxy
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="sudo systemctl restart cloud-sql-proxy"

# Test connection
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="psql -h localhost -U recipe_app -d recipe_generator -c 'SELECT 1;'"
```

### nginx Issues

```bash
# Check nginx status
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="sudo systemctl status nginx"

# Test configuration
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="sudo nginx -t"

# Restart nginx
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="sudo systemctl restart nginx"
```

### Load Balancer Health Check Failing

```bash
# Check health status
gcloud compute backend-services get-health nextjs-backend --global

# Test VM directly
VM_IP=$(gcloud compute instances describe nextjs-vm --zone=us-central1-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)')
curl -I http://$VM_IP

# Check firewall rules
gcloud compute firewall-rules list --filter="name:allow-http OR name:allow-https"
```

### Spot Instance Terminated

```bash
# Run emergency restore
cd gce-migration/scripts
./emergency-restore.sh
```

---

## Monitoring

### Real-Time Monitoring

```bash
# SSH and use PM2 monitor
gcloud compute ssh nextjs-vm --zone=us-central1-a
pm2 monit
```

### Check Resource Usage

```bash
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="
  echo 'CPU and Memory:' &&
  top -bn1 | head -5 &&
  echo '' &&
  echo 'Disk:' &&
  df -h /
"
```

### View All Logs

```bash
# Application logs
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 logs --lines 50"

# nginx access logs
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="sudo tail -50 /var/log/nginx/access.log"

# nginx error logs
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="sudo tail -50 /var/log/nginx/error.log"

# Cloud SQL Proxy logs
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="sudo journalctl -u cloud-sql-proxy -n 50"
```

### Check Site Status

```bash
# Test HTTP
curl -I http://34.160.77.21

# Test HTTPS
curl -I https://fatesblind.com

# Test response time
curl -w "@-" -o /dev/null -s https://fatesblind.com <<'EOF'
    time_namelookup:  %{time_namelookup}s\n
       time_connect:  %{time_connect}s\n
    time_appconnect:  %{time_appconnect}s\n
      time_redirect:  %{time_redirect}s\n
   time_pretransfer:  %{time_pretransfer}s\n
 time_starttransfer:  %{time_starttransfer}s\n
                    ----------\n
         time_total:  %{time_total}s\n
EOF
```

---

## Disaster Recovery

### Scenario: Spot Instance Terminated

1. **Check if VM exists**
   ```bash
   gcloud compute instances list --project=web-page-d9ec622e
   ```

2. **If VM missing, recreate with Terraform**
   ```bash
   cd gce-migration
   terraform apply
   ```

3. **Run emergency restore**
   ```bash
   cd scripts
   ./emergency-restore.sh
   ```

### Scenario: Application Crashed

```bash
# Restart application
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 restart nextjs-app"

# If restart fails, redeploy
cd gce-migration/scripts
./deploy-to-vm.sh
```

### Scenario: Database Lost Connection

```bash
# Restart Cloud SQL Proxy
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="
  sudo systemctl restart cloud-sql-proxy &&
  sleep 5 &&
  pm2 restart nextjs-app
"
```

### Scenario: Complete System Failure

```bash
# 1. Check infrastructure
cd gce-migration
terraform plan

# 2. Restore if needed
terraform apply

# 3. Run emergency restore
cd scripts
./emergency-restore.sh
```

---

## Pre-Deployment Checklist

Before deploying major changes:

- [ ] Test locally: `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] Tests pass (if you have tests)
- [ ] Environment variables updated (if needed)
- [ ] Database migrations ready (if needed)
- [ ] Backup current version (optional but recommended)

---

## Post-Deployment Checklist

After deployment:

- [ ] Site loads: https://fatesblind.com
- [ ] Check PM2 status: `pm2 status`
- [ ] Review logs: `pm2 logs --lines 50`
- [ ] Test key features (login, database, etc.)
- [ ] Health check passing: `gcloud compute backend-services get-health nextjs-backend --global`
- [ ] Monitor for 10-15 minutes

---

## Cost Monitoring

### Check Current Month's Costs

```bash
# Via gcloud (if billing API enabled)
gcloud billing accounts list

# Or check in Cloud Console
# https://console.cloud.google.com/billing
```

### Expected Monthly Costs

- **Compute Engine e2-micro**: FREE (744 hrs/month)
- **Spot instance discount**: 60-91% off regular price
- **Cloud SQL db-f1-micro**: ~$15-20/month
- **Load Balancer**: ~$18/month
- **Data egress**: ~$1-2/month

**Total**: ~$33-38/month (first year with free tier)

---

## Important URLs

- **Production Site**: https://fatesblind.com
- **GCP Console**: https://console.cloud.google.com
- **Compute Instances**: https://console.cloud.google.com/compute/instances
- **Load Balancer**: https://console.cloud.google.com/net-services/loadbalancing
- **Cloud SQL**: https://console.cloud.google.com/sql/instances

---

## Support Commands

```bash
# Get VM info
gcloud compute instances describe nextjs-vm --zone=us-central1-a --format=json

# Get SSH command
terraform output ssh_command

# Get all outputs
terraform output

# List all instances
gcloud compute instances list --project=web-page-d9ec622e

# Check backend health
gcloud compute backend-services get-health nextjs-backend --global
```

---

## Notes

- **Spot instances** can be terminated by Google with 30 seconds notice
- **Emergency restore** script handles automatic recovery
- **PM2** automatically restarts the app if it crashes
- **Cloud SQL Proxy** handles database connection automatically
- **Load balancer** provides health monitoring and automatic failover

---

**Last Updated**: Nov 2, 2025
**Current Setup**: e2-micro spot instance in us-central1-a
**Status**: Production ✅
