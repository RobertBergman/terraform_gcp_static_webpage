# Deployment Scripts

This directory contains all scripts needed to deploy and maintain your Next.js application on Google Compute Engine.

## 📋 Scripts Overview

### 1. `check-status.sh` - **Infrastructure Status Check**
**Purpose**: Check the health and status of all infrastructure components

**When to use**:
- Before any deployment to verify system health
- After deployment to confirm everything is working
- Troubleshooting issues
- Checking which backend (Compute Engine or App Engine) is active

**Usage**:
```bash
cd gce-migration/scripts
./check-status.sh
```

**What it checks**:
1. Active backend (Compute Engine or App Engine)
2. VM status and application health
3. Load balancer health checks
4. App Engine fallback availability
5. Production site accessibility

**Output example**:
```
✅ Compute Engine (Primary)
✅ Running
✅ Application running (PM2)
✅ Healthy
✅ App Engine Available (fallback)
✅ https://fatesblind.com (HTTP 200)
```

---

### 2. `deploy-to-vm.sh` - **Main Deployment Script**
**Purpose**: Deploy your app from your local machine to the VM

**When to use**:
- Updating your application code
- Regular deployments after making changes
- Pushing new features

**Usage**:
```bash
cd gce-migration/scripts
chmod +x deploy-to-vm.sh
./deploy-to-vm.sh
```

**What it does**:
1. Builds Next.js app locally
2. Creates deployment package
3. Copies to VM
4. Installs dependencies
5. Builds on VM
6. Restarts PM2
7. Verifies deployment

---

### 3. `vm-setup.sh` - **Initial VM Setup**
**Purpose**: Set up a fresh VM from scratch

**When to use**:
- First time VM setup
- After VM is recreated
- Spot instance was terminated and recreated

**Usage**:
```bash
# Copy to VM and run
gcloud compute scp vm-setup.sh nextjs-vm:/tmp/ --zone=us-central1-a
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="bash /tmp/vm-setup.sh"
```

**What it does**:
1. Installs Node.js 20.x
2. Installs PM2
3. Installs nginx
4. Installs Cloud SQL Proxy
5. Configures all services
6. Sets up directory structure
7. Creates environment files

---

### 4. `quick-deploy.sh` - **Quick Deploy on VM**
**Purpose**: Deploy app when you're already SSH'd into the VM

**When to use**:
- You're on the VM and want to redeploy
- After copying new files to the VM
- Quick updates without leaving SSH session

**Usage**:
```bash
# On the VM
cd /var/www/app
bash /path/to/quick-deploy.sh
```

**What it does**:
1. Installs dependencies
2. Generates Prisma client
3. Builds Next.js
4. Restarts PM2

---

### 5. `emergency-restore.sh` - **Emergency Recovery**
**Purpose**: Complete disaster recovery procedure

**When to use**:
- Spot instance was terminated
- VM was accidentally deleted
- Complete system failure
- Need to restore from scratch

**Usage**:
```bash
cd gce-migration/scripts
chmod +x emergency-restore.sh
./emergency-restore.sh
```

**What it does**:
1. Checks VM exists (prompts to run terraform if not)
2. Runs complete VM setup
3. Deploys application
4. Verifies everything is working

---

## 🚀 Common Scenarios

### Scenario 1: Regular Code Update
You've made changes to your Next.js app and want to deploy:

```bash
cd gce-migration/scripts
./deploy-to-vm.sh
```

---

### Scenario 2: Spot Instance Got Terminated
Your spot instance was terminated by Google:

**Option A: Let Terraform recreate it**
```bash
cd gce-migration
terraform apply  # Will recreate VM with same config
cd scripts
./emergency-restore.sh  # Will set up and deploy
```

**Option B: Manual recreation**
```bash
# 1. Recreate via Terraform
terraform apply

# 2. Wait 30 seconds for VM to boot

# 3. Run emergency restore
./emergency-restore.sh
```

---

### Scenario 3: Fresh VM Setup
Setting up a completely new VM:

```bash
# 1. Create VM via Terraform
terraform apply

# 2. Set up VM environment
gcloud compute scp vm-setup.sh nextjs-vm:/tmp/ --zone=us-central1-a
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="bash /tmp/vm-setup.sh"

# 3. Deploy app
./deploy-to-vm.sh
```

---

### Scenario 4: Manual Deployment
You want to manually deploy while SSH'd into the VM:

```bash
# 1. SSH to VM
gcloud compute ssh nextjs-vm --zone=us-central1-a

# 2. Copy your app files (from local machine)
# In another terminal:
tar -czf /tmp/app.tar.gz -C ../nextjs-site .
gcloud compute scp /tmp/app.tar.gz nextjs-vm:/tmp/ --zone=us-central1-a

# 3. Back on VM:
cd /var/www/app
tar -xzf /tmp/app.tar.gz

# 4. Copy and run quick deploy script
# From local machine:
gcloud compute scp quick-deploy.sh nextjs-vm:/tmp/ --zone=us-central1-a

# On VM:
bash /tmp/quick-deploy.sh
```

---

## 🔧 Configuration

All scripts use these default values:
- **Project**: web-page-d9ec622e
- **Zone**: us-central1-a
- **VM Name**: nextjs-vm
- **App Directory**: /var/www/app

To change these, edit the variables at the top of each script.

---

## 📝 Pre-requisites

### For local scripts (deploy-to-vm.sh, emergency-restore.sh):
- `gcloud` CLI installed and authenticated
- Terraform (for emergency restore)
- Node.js and npm

### For VM scripts (vm-setup.sh, quick-deploy.sh):
- Ubuntu 22.04 VM
- Sudo access
- Internet connectivity

---

## 🛡️ Security Notes

1. **Credentials**: Scripts use existing `.env` values. Keep these secure.
2. **SSH Keys**: Uses gcloud SSH which manages keys automatically
3. **Service Account**: VM uses service account with minimal permissions
4. **Cloud SQL**: Connection via Cloud SQL Proxy (encrypted)

---

## 🐛 Troubleshooting

### Script fails to connect to VM
```bash
# Check VM is running
gcloud compute instances list --project=web-page-d9ec622e

# Check SSH connectivity
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="echo connected"
```

### App won't start
```bash
# SSH to VM and check logs
gcloud compute ssh nextjs-vm --zone=us-central1-a

# Check PM2
pm2 status
pm2 logs nextjs-app

# Check Cloud SQL Proxy
sudo systemctl status cloud-sql-proxy
```

### Build fails
```bash
# Check Node.js version
node --version  # Should be 20.x

# Clear cache and retry
rm -rf node_modules .next
npm ci
npm run build
```

### Health check failing
```bash
# Check nginx
sudo systemctl status nginx
sudo nginx -t

# Check app is running
curl http://localhost:3000

# Check backend health
gcloud compute backend-services get-health nextjs-backend --global
```

---

## 📊 Monitoring

After deployment, monitor your app:

```bash
# Check PM2 status
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 status"

# View logs
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 logs --lines 50"

# Monitor resources
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="pm2 monit"

# Check backend health
gcloud compute backend-services get-health nextjs-backend --global
```

---

## 🔄 Rollback

If deployment goes wrong:

```bash
# SSH to VM
gcloud compute ssh nextjs-vm --zone=us-central1-a

# Restart PM2 with previous version
pm2 restart nextjs-app

# Or restore from backup
# (Make sure to back up before deployments!)
```

---

## 💾 Backups

Before major deployments, create a backup:

```bash
# Backup current app
gcloud compute ssh nextjs-vm --zone=us-central1-a --command="
  cd /var/www &&
  tar -czf app-backup-$(date +%Y%m%d-%H%M%S).tar.gz app
"

# Download backup
gcloud compute scp nextjs-vm:/var/www/app-backup-*.tar.gz ./ --zone=us-central1-a
```

---

## ✅ Best Practices

1. **Test locally first**: Always test builds locally before deploying
2. **Use deploy-to-vm.sh**: This is the safest deployment method
3. **Monitor after deploy**: Check logs for 5-10 minutes after deployment
4. **Keep backups**: Backup before major changes
5. **Document changes**: Keep track of what was deployed when

---

## 📞 Support

If you encounter issues:
1. Check script output for error messages
2. Review VM logs: `pm2 logs`
3. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Verify health: `gcloud compute backend-services get-health nextjs-backend --global`

---

**Last Updated**: Nov 2, 2025
**VM**: nextjs-vm (e2-micro spot instance)
**Region**: us-central1-a
