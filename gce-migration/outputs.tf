output "deployment_summary" {
  description = "Summary of the deployment"
  value = <<-EOT

    ================================================================
    Google Compute Engine Migration Complete!
    ================================================================

    INSTANCE INFORMATION:
    - VM Name: ${google_compute_instance.nextjs_vm.name}
    - External IP: ${google_compute_address.vm_ip.address}
    - Zone: ${var.zone}
    - Machine Type: ${var.machine_type}
    - Spot Instance: ${var.use_spot_instance}

    CONNECT TO INSTANCE:
    SSH via IAP: gcloud compute ssh ${google_compute_instance.nextjs_vm.name} --zone=${var.zone} --project=${var.project_id}

    DATABASE:
    - Using existing Cloud SQL instance
    - Connection via Cloud SQL Proxy (automatic)

    LOAD BALANCER:
    - IP Address: ${data.google_compute_global_address.existing_ip.address}
    - HTTPS: ✓ (using existing certificate)
    - HTTP → HTTPS redirect: ✓

    NEXT STEPS:
    1. SSH into the instance:
       gcloud compute ssh ${google_compute_instance.nextjs_vm.name} --zone=${var.zone}

    2. Update deployment script:
       sudo nano /root/deploy.sh
       (Update REPO_URL with your GitHub repository)

    3. Deploy your application:
       sudo /root/deploy.sh

    4. Check application status:
       pm2 status
       pm2 logs

    5. Setup SSL certificate (if not using load balancer):
       sudo /root/setup-ssl.sh

    COST ESTIMATE:
    - Compute Engine e2-micro: FREE (744 hrs/month free tier)
    - Spot instance discount: Additional 60-91% off if exceeds free tier
    - Cloud SQL (existing): $15-20/month
    - Load Balancer (existing): $18/month
    - Total: ~$33-38/month (vs ~$35-45 with App Engine)

    With free tier: ~$33/month for first 12 months
    Spot instance: Reduces costs by 60-91% after free tier

    ================================================================
  EOT
}

output "monitoring_commands" {
  description = "Useful monitoring commands"
  value = <<-EOT

    MONITORING COMMANDS:
    - Monitor all services: sudo /root/monitor.sh
    - PM2 status: pm2 status
    - PM2 logs: pm2 logs nextjs-app
    - Nginx logs: sudo tail -f /var/log/nginx/error.log
    - Cloud SQL Proxy: sudo systemctl status cloud-sql-proxy
    - Startup script log: sudo tail -f /var/log/startup-script.log
  EOT
}
