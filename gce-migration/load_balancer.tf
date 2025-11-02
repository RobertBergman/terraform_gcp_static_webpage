# ============================================================================
# This configuration UPDATES your existing load balancer to use the new
# Compute Engine VM instead of App Engine. Everything else stays the same:
# - Same IP address
# - Same SSL certificate
# - Same domain configuration
# ============================================================================

# Reference existing static IP
data "google_compute_global_address" "existing_ip" {
  name = "website-ip"
}

# Update the existing URL map to point to the new backend
# This will update the existing URL map to route traffic to the new Compute Engine VM
resource "google_compute_url_map" "website" {
  name            = "website-url-map"
  default_service = google_compute_backend_service.nextjs_backend.id

  # This replaces the existing URL map with same name
  # Terraform will import and update it to point to new backend
}

# Note: The existing HTTPS proxy, HTTP redirect, SSL certificates, etc.
# are already configured and will continue to work. We're just changing
# which backend service the load balancer routes to.

output "load_balancer_ip" {
  description = "Load balancer IP address (unchanged)"
  value       = data.google_compute_global_address.existing_ip.address
}

output "migration_note" {
  description = "Important migration information"
  value = <<-EOT
    ✅ Using your existing load balancer setup:
       - URL: https://fatesblind.com
       - IP: ${data.google_compute_global_address.existing_ip.address}
       - SSL: Existing certificate (no changes needed)
       - Backend: Updated to point to new Compute Engine VM

    The load balancer will automatically route traffic to your new VM
    once the health checks pass (takes 2-3 minutes).

    Your App Engine will continue running until you delete it.
  EOT
}
