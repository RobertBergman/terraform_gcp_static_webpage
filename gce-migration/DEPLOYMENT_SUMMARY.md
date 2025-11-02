# GCE Migration - Deployment Summary

## What This Migration Does

### ✅ Keeps (No Changes)
- **Load Balancer**: https://console.cloud.google.com/net-services/loadbalancing/details/http/website-url-map
- **Static IP**: `website-ip` (same IP address)
- **SSL Certificate**: `fatesblind-cert` (same certificate)
- **Domain**: fatesblind.com (same domain, no DNS changes)
- **Cloud SQL Database**: recipe-generator-db (same database)

### 🔄 Changes
- **Backend**: App Engine → Compute Engine e2-micro VM
- **URL Map**: Updates `website-url-map` to route to new VM

### ➕ Creates New
- **Compute Engine VM**: e2-micro spot instance
- **Backend Service**: `nextjs-backend` (points to new VM)
- **Service Account**: For VM with Cloud SQL access
- **Firewall Rules**: HTTP/HTTPS/SSH access

## Architecture

### Before (Current)
```
Internet → Load Balancer → App Engine → Cloud SQL
           (website-url-map)  (F1 instance)
```

### After (Target)
```
Internet → Load Balancer → Compute Engine → Cloud SQL
           (website-url-map)  (e2-micro VM)
```

**Same load balancer, same IP, same SSL - just new compute backend!**

## Migration Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Deploy Compute Engine VM (terraform apply)         │
│  • Creates VM with nginx and PM2                            │
│  • Sets up Cloud SQL Proxy connection                       │
│  • Configures firewall rules                                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Deploy Your Next.js App (deploy.sh)                │
│  • Clones your GitHub repo                                  │
│  • Installs dependencies                                    │
│  • Runs Prisma migrations                                   │
│  • Builds and starts app with PM2                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Update Load Balancer (automatic)                   │
│  • Updates website-url-map backend                          │
│  • Health checks verify VM is ready                         │
│  • Traffic automatically routes to new VM                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Verify & Monitor (you)                             │
│  • Test https://fatesblind.com                              │
│  • Monitor logs and performance                             │
│  • Keep App Engine running as backup                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Cleanup App Engine (after 48 hours)                │
│  • Delete App Engine service                                │
│  • Remove old backend from load balancer                    │
└─────────────────────────────────────────────────────────────┘
```

## What Happens During `terraform apply`

1. **Creates VM** (~2 minutes)
   - Provisions e2-micro instance
   - Runs startup script to install:
     - Node.js 20
     - nginx
     - PM2
     - Cloud SQL Proxy
     - Certbot

2. **Configures Networking** (~1 minute)
   - Assigns static external IP
   - Creates firewall rules
   - Sets up health checks

3. **Updates Load Balancer** (~30 seconds)
   - Creates new backend service
   - Updates URL map to point to new backend
   - Keeps existing SSL and forwarding rules

4. **Total Time**: ~3-5 minutes

## What You Need to Do After

1. **SSH to VM**:
   ```bash
   gcloud compute ssh nextjs-vm --zone=us-central1-a
   ```

2. **Update deploy script** with your GitHub repo:
   ```bash
   sudo nano /root/deploy.sh
   # Change: REPO_URL="https://github.com/YOUR_USERNAME/YOUR_REPO.git"
   ```

3. **Deploy app**:
   ```bash
   sudo /root/deploy.sh
   ```

4. **Wait for health checks** (2-3 minutes):
   ```bash
   gcloud compute backend-services get-health nextjs-backend --global
   ```

5. **Test site**:
   ```bash
   curl https://fatesblind.com
   ```

## Rollback Plan

### If Issues Occur Before Deleting App Engine

The beauty of this approach: **App Engine keeps running!**

Option 1: **Manual rollback via Console**
1. Go to: https://console.cloud.google.com/net-services/loadbalancing/details/http/website-url-map
2. Click "Edit"
3. Change default backend back to `app-engine-backend`
4. Save

Option 2: **Terraform rollback**
```bash
terraform destroy
# Then App Engine will automatically take over again
```

### If Issues After Deleting App Engine

You'll need to redeploy App Engine:
```bash
cd ..
gcloud app deploy nextjs-site/app.yaml
```

## Health Check Monitoring

The load balancer performs health checks every 10 seconds:
- URL: `http://[VM_IP]/`
- Expected: HTTP 200 response
- Healthy threshold: 2 consecutive successes
- Unhealthy threshold: 3 consecutive failures

### Check Health Status

```bash
# See current health
gcloud compute backend-services get-health nextjs-backend --global

# Expected output when healthy:
# status:
#   healthStatus:
#   - healthState: HEALTHY
```

## Cost Comparison

### Current (App Engine F1)
```
App Engine F1 instance hours: $0.05/hour
Estimated: ~$30/month for moderate traffic
Plus: Cloud SQL + Load Balancer
```

### New (Compute Engine e2-micro)
```
e2-micro instance: FREE (first 744 hours/month)
Spot discount: 60-91% off regular price after free tier
Regular price after free tier: ~$7/month
Spot price: ~$2/month
Plus: Cloud SQL + Load Balancer (same as before)
```

**Savings: ~$25-28/month**

## Security Considerations

### VM Security
- ✅ Service account with minimal permissions
- ✅ Cloud SQL Proxy (no direct database access)
- ✅ Firewall rules restrict access
- ✅ IAP for SSH (no public SSH keys)

### Data Security
- ✅ SSL via existing load balancer
- ✅ Database credentials in .env (not in code)
- ✅ OAuth secrets in environment variables
- ✅ No secrets in Terraform state (using variables)

## Monitoring Checklist

After migration, monitor these:

### Application Health
- [ ] PM2 shows app as "online"
- [ ] No errors in PM2 logs
- [ ] Nginx access logs show requests
- [ ] No 5xx errors in nginx error logs

### Infrastructure Health
- [ ] Backend health check: HEALTHY
- [ ] Cloud SQL Proxy: active (running)
- [ ] VM CPU usage: <80%
- [ ] VM memory usage: <80%
- [ ] Disk usage: <80%

### Functional Testing
- [ ] Homepage loads correctly
- [ ] Google OAuth login works
- [ ] Database queries work
- [ ] Create/edit/delete operations work
- [ ] Images/static assets load
- [ ] Mobile view works

### Performance
- [ ] Page load time: <3 seconds
- [ ] Time to First Byte: <200ms
- [ ] No cold starts (instant response)
- [ ] Database queries: <100ms average

## Commands Reference

### Check Everything
```bash
gcloud compute ssh nextjs-vm --zone=us-central1-a
sudo /root/monitor.sh
```

### Application
```bash
pm2 status
pm2 logs nextjs-app
pm2 restart nextjs-app
```

### Nginx
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/access.log
```

### Database
```bash
sudo systemctl status cloud-sql-proxy
psql -h localhost -U recipe_app -d recipe_generator
```

### Load Balancer
```bash
gcloud compute backend-services get-health nextjs-backend --global
gcloud compute url-maps describe website-url-map --global
```

## Success Criteria

Migration is successful when:
- ✅ `terraform apply` completes without errors
- ✅ VM is running and accessible via SSH
- ✅ Application deployed and running in PM2
- ✅ Backend health check shows HEALTHY
- ✅ https://fatesblind.com loads correctly
- ✅ All features work (login, CRUD operations)
- ✅ No errors in logs for 24 hours
- ✅ Performance is equal or better
- ✅ Costs are reduced

## Timeline

| Task | Duration | Can Rollback? |
|------|----------|---------------|
| Terraform init | 30 sec | Yes |
| Terraform apply | 3-5 min | Yes |
| SSH and configure | 2 min | Yes |
| Deploy app | 3-5 min | Yes |
| Health checks pass | 2-3 min | Yes |
| Verify functionality | 10-15 min | Yes |
| Monitor (recommended) | 24-48 hours | Yes |
| Delete App Engine | 5 min | Difficult* |

\* Can recreate but takes time

**Total active work: ~20-25 minutes**
**Total with monitoring: 24-48 hours**

## Support Resources

- **Load Balancer**: https://console.cloud.google.com/net-services/loadbalancing/list
- **Compute Instances**: https://console.cloud.google.com/compute/instances
- **Cloud SQL**: https://console.cloud.google.com/sql/instances
- **Logs**: https://console.cloud.google.com/logs
- **Monitoring**: https://console.cloud.google.com/monitoring

## Questions?

- **Will there be downtime?** No! App Engine keeps running.
- **Do I need to update DNS?** No! Same load balancer, same IP.
- **What if the VM is terminated?** Auto-recreates (takes 3-5 min).
- **Can I switch back?** Yes! Update load balancer backend.
- **How do I see costs?** Cloud Console → Billing → Reports

---

**Ready to migrate?** Start with `terraform init` in the `gce-migration/` directory! 🚀
