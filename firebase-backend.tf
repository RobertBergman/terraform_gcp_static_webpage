# =============================================================================
# FIREBASE HOSTING BACKEND CONFIGURATION
# =============================================================================
# This configuration creates a backend service that routes traffic to the
# Firebase Hosting deployment at {project-id}.web.app
#
# Firebase Hosting is the current active deployment for fatesblind.com
#
# Firebase Hosting is deployed separately using:
#   cd firebase-site && npm run build && firebase deploy
#
# The site files are located in: firebase-site/
# =============================================================================

# Network Endpoint Group for Firebase Hosting
# This creates a global NEG that points to the Firebase Hosting URL
resource "google_compute_global_network_endpoint_group" "firebase_neg" {
  name                  = "firebase-neg"
  project               = google_project.web_page.project_id
  network_endpoint_type = "INTERNET_FQDN_PORT"
  default_port          = 443

  depends_on = [google_project_service.apis]
}

# Network Endpoint pointing to Firebase Hosting
# Points to the Firebase Hosting URL: {project-id}.web.app
resource "google_compute_global_network_endpoint" "firebase_endpoint" {
  global_network_endpoint_group = google_compute_global_network_endpoint_group.firebase_neg.id
  project                       = google_project.web_page.project_id
  fqdn                          = "${google_project.web_page.project_id}.web.app"
  port                          = 443
}

# Backend Service for Firebase Hosting
# This is the active backend service used by the Load Balancer
# Routes traffic from fatesblind.com to Firebase Hosting
resource "google_compute_backend_service" "firebase_backend" {
  name                  = "firebase-backend"
  project               = google_project.web_page.project_id
  protocol              = "HTTPS"
  port_name             = "https"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  enable_cdn            = true

  backend {
    group = google_compute_global_network_endpoint_group.firebase_neg.id
  }

  # CDN configuration for optimal caching
  cdn_policy {
    cache_mode                   = "CACHE_ALL_STATIC"
    client_ttl                   = 3600  # 1 hour
    default_ttl                  = 3600  # 1 hour
    max_ttl                      = 86400 # 24 hours
    negative_caching             = true
    serve_while_stale            = 86400
    signed_url_cache_max_age_sec = 0
  }

  # Forward the correct Host header to Firebase Hosting
  custom_request_headers = [
    "Host: ${google_project.web_page.project_id}.web.app"
  ]

  depends_on = [
    google_compute_global_network_endpoint.firebase_endpoint,
    google_project_service.apis
  ]
}

# Output the Firebase Hosting URL
output "firebase_hosting_url" {
  value       = "https://${google_project.web_page.project_id}.web.app"
  description = "Direct Firebase Hosting URL (before custom domain)"
}
