# Storage bucket for static website
resource "google_storage_bucket" "website" {
  name          = "fatesblind-website-${random_id.project_suffix.hex}"
  project       = google_project.web_page.project_id
  location      = "US"
  force_destroy = true
  
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
  
  cors {
    origin          = ["https://fatesblind.com"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
  
  uniform_bucket_level_access = true
  
  depends_on = [google_project_service.apis]
}

# Make bucket public
resource "google_storage_bucket_iam_member" "public_access" {
  bucket = google_storage_bucket.website.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Upload index.html
resource "google_storage_bucket_object" "index" {
  name         = "index.html"
  bucket       = google_storage_bucket.website.name
  source       = "index.html"
  content_type = "text/html"
}

# Upload 404.html
resource "google_storage_bucket_object" "not_found" {
  name         = "404.html"
  bucket       = google_storage_bucket.website.name
  source       = "404.html"
  content_type = "text/html"
}

# Reserve external IP address
resource "google_compute_global_address" "website_ip" {
  name       = "website-ip"
  project    = google_project.web_page.project_id
  depends_on = [google_project_service.apis]
}

# SSL Certificate
resource "google_certificate_manager_certificate" "website_cert" {
  name     = "fatesblind-cert"
  project  = google_project.web_page.project_id
  location = "global"
  
  managed {
    domains = ["fatesblind.com", "www.fatesblind.com"]
  }
  
  depends_on = [google_project_service.apis]
}

# Certificate Map
resource "google_certificate_manager_certificate_map" "website_cert_map" {
  name       = "fatesblind-cert-map"
  project    = google_project.web_page.project_id
  depends_on = [google_project_service.apis]
}

# Certificate Map Entry
resource "google_certificate_manager_certificate_map_entry" "website_cert_entry" {
  name         = "fatesblind-cert-entry"
  project      = google_project.web_page.project_id
  map          = google_certificate_manager_certificate_map.website_cert_map.name
  hostname     = "fatesblind.com"
  certificates = [google_certificate_manager_certificate.website_cert.id]
}

resource "google_certificate_manager_certificate_map_entry" "website_cert_entry_www" {
  name         = "fatesblind-cert-entry-www"
  project      = google_project.web_page.project_id
  map          = google_certificate_manager_certificate_map.website_cert_map.name
  hostname     = "www.fatesblind.com"
  certificates = [google_certificate_manager_certificate.website_cert.id]
}

# Backend bucket
resource "google_compute_backend_bucket" "website_backend" {
  name        = "website-backend"
  project     = google_project.web_page.project_id
  bucket_name = google_storage_bucket.website.name
  enable_cdn  = true
  
  cdn_policy {
    cache_mode        = "CACHE_ALL_STATIC"
    client_ttl        = 3600
    default_ttl       = 3600
    max_ttl           = 86400
    negative_caching  = true
    serve_while_stale = 86400
  }
  
  depends_on = [google_project_service.apis]
}

# URL map
resource "google_compute_url_map" "website" {
  name            = "website-url-map"
  project         = google_project.web_page.project_id
  default_service = google_compute_backend_bucket.website_backend.id
  depends_on      = [google_project_service.apis]
}

# HTTPS target proxy
resource "google_compute_target_https_proxy" "website" {
  name            = "website-https-proxy"
  project         = google_project.web_page.project_id
  url_map         = google_compute_url_map.website.id
  certificate_map = "//certificatemanager.googleapis.com/projects/${google_project.web_page.project_id}/locations/global/certificateMaps/${google_certificate_manager_certificate_map.website_cert_map.name}"
  
  depends_on = [
    google_certificate_manager_certificate_map_entry.website_cert_entry,
    google_certificate_manager_certificate_map_entry.website_cert_entry_www
  ]
}

# Global forwarding rule for HTTPS
resource "google_compute_global_forwarding_rule" "website_https" {
  name       = "website-https-rule"
  project    = google_project.web_page.project_id
  ip_protocol = "TCP"
  port_range  = "443"
  target      = google_compute_target_https_proxy.website.id
  ip_address  = google_compute_global_address.website_ip.address
  depends_on  = [google_project_service.apis]
}

# HTTP to HTTPS redirect
resource "google_compute_url_map" "http_redirect" {
  name       = "http-redirect"
  project    = google_project.web_page.project_id
  depends_on = [google_project_service.apis]
  
  default_url_redirect {
    strip_query            = false
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
  }
}

resource "google_compute_target_http_proxy" "http_redirect" {
  name       = "http-redirect-proxy"
  project    = google_project.web_page.project_id
  url_map    = google_compute_url_map.http_redirect.id
  depends_on = [google_project_service.apis]
}

resource "google_compute_global_forwarding_rule" "http_redirect" {
  name        = "http-redirect-rule"
  project     = google_project.web_page.project_id
  ip_protocol = "TCP"
  port_range  = "80"
  target      = google_compute_target_http_proxy.http_redirect.id
  ip_address  = google_compute_global_address.website_ip.address
  depends_on  = [google_project_service.apis]
}

# Cloud DNS Zone
resource "google_dns_managed_zone" "fatesblind" {
  name        = "fatesblind-zone"
  project     = google_project.web_page.project_id
  dns_name    = "fatesblind.com."
  description = "DNS zone for fatesblind.com"
  depends_on  = [google_project_service.apis]
}

# DNS A record for root domain
resource "google_dns_record_set" "website_a" {
  name         = google_dns_managed_zone.fatesblind.dns_name
  project      = google_project.web_page.project_id
  managed_zone = google_dns_managed_zone.fatesblind.name
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_global_address.website_ip.address]
}

# DNS A record for www subdomain
resource "google_dns_record_set" "website_www" {
  name         = "www.${google_dns_managed_zone.fatesblind.dns_name}"
  project      = google_project.web_page.project_id
  managed_zone = google_dns_managed_zone.fatesblind.name
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_global_address.website_ip.address]
}

# Outputs
output "website_ip" {
  value       = google_compute_global_address.website_ip.address
  description = "The IP address to point your domain to"
}

output "name_servers" {
  value       = google_dns_managed_zone.fatesblind.name_servers
  description = "Name servers to configure at your domain registrar"
}

output "bucket_url" {
  value       = google_storage_bucket.website.url
  description = "The GCS URL of the bucket"
}