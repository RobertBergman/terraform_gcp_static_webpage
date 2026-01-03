# =============================================================================
# APP ENGINE BACKEND CONFIGURATION - DEPRECATED/FALLBACK
# =============================================================================
# NOTE: This configuration is NOT currently active. Firebase Hosting is the
# active backend service (see firebase-backend.tf).
#
# App Engine is still deployed with 2 versions but is not serving fatesblind.com
# The app-engine-neg has 0 endpoints and is not referenced in the URL map.
#
# This configuration is commented out to reflect the current deployment state.
# Uncomment if you need to switch back to App Engine as the backend.
# =============================================================================

# DISABLED: App Engine Network Endpoint Group
# resource "google_compute_region_network_endpoint_group" "app_engine_neg" {
#   name                  = "app-engine-neg"
#   project               = google_project.web_page.project_id
#   network_endpoint_type = "SERVERLESS"
#   region                = "us-central1" # Must match the App Engine region
#   app_engine {
#     service = "default"
#   }
# }

# DISABLED: App Engine Backend Service
# resource "google_compute_backend_service" "app_engine_backend" {
#   name                  = "app-engine-backend"
#   project               = google_project.web_page.project_id
#   protocol              = "HTTP"
#   port_name             = "http"
#   load_balancing_scheme = "EXTERNAL_MANAGED"
#   enable_cdn            = true
#
#   backend {
#     group = google_compute_region_network_endpoint_group.app_engine_neg.id
#   }
#
#   cdn_policy {
#     cache_mode        = "CACHE_ALL_STATIC"
#     client_ttl        = 3600
#     default_ttl       = 3600
#     max_ttl           = 86400
#     negative_caching  = true
#     serve_while_stale = 86400
#     signed_url_cache_max_age_sec = 3600
#   }
#
#   depends_on = [google_compute_region_network_endpoint_group.app_engine_neg]
# }
