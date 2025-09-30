# OAuth2 Configuration for Google Sign-In

# Enable required APIs for OAuth2
resource "google_project_service" "iap_api" {
  project            = google_project.web_page.project_id
  service            = "iap.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.apis]
}

resource "google_project_service" "identity_api" {
  project            = google_project.web_page.project_id
  service            = "identitytoolkit.googleapis.com"
  disable_on_destroy = false
  depends_on         = [google_project_service.apis]
}

# Configure OAuth consent screen
resource "google_iap_brand" "project_brand" {
  support_email     = "rbergman@fatesblind.com"  # Organization admin email
  application_title = "FatesBlind Portal"
  project           = google_project.web_page.project_id
  
  depends_on = [google_project_service.iap_api]
}

# Create OAuth 2.0 Client for Web Application
resource "google_iap_client" "web_client" {
  display_name = "FatesBlind Web Client"
  brand        = google_iap_brand.project_brand.name
  
  depends_on = [google_iap_brand.project_brand]
}

# Output the client ID for use in the website
output "oauth_client_id" {
  value       = google_iap_client.web_client.client_id
  description = "OAuth2 Client ID for Google Sign-In"
}

output "oauth_client_secret" {
  value       = google_iap_client.web_client.secret
  sensitive   = true
  description = "OAuth2 Client Secret (keep confidential)"
}

# Generate index.html from template with OAuth client ID
# DISABLED: Using Next.js app instead of static HTML
# resource "local_file" "index_html" {
#   content = templatefile("${path.module}/index.html.tpl", {
#     oauth_client_id = google_iap_client.web_client.client_id
#   })
#   filename = "${path.module}/index.html"
#
#   depends_on = [google_iap_client.web_client]
# }