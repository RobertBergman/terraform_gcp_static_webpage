# Service Account for Terraform Management
resource "google_service_account" "terraform" {
  account_id   = "terraform-sa"
  display_name = "Terraform Service Account"
  project      = google_project.web_page.project_id
  description  = "Service account for managing infrastructure via Terraform"
}

# Project-level roles for the service account
resource "google_project_iam_member" "terraform_editor" {
  project = google_project.web_page.project_id
  role    = "roles/editor"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform_storage_admin" {
  project = google_project.web_page.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform_compute_admin" {
  project = google_project.web_page.project_id
  role    = "roles/compute.admin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform_dns_admin" {
  project = google_project.web_page.project_id
  role    = "roles/dns.admin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform_certificate_manager" {
  project = google_project.web_page.project_id
  role    = "roles/certificatemanager.editor"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

resource "google_project_iam_member" "terraform_service_usage" {
  project = google_project.web_page.project_id
  role    = "roles/serviceusage.serviceUsageAdmin"
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

# Create a service account key for local authentication
resource "google_service_account_key" "terraform_key" {
  service_account_id = google_service_account.terraform.name
  key_algorithm      = "KEY_ALG_RSA_2048"
  private_key_type   = "TYPE_GOOGLE_CREDENTIALS_FILE"
}

# Output the service account details
output "service_account_email" {
  value       = google_service_account.terraform.email
  description = "The email of the Terraform service account"
}

output "service_account_key" {
  value       = google_service_account_key.terraform_key.private_key
  sensitive   = true
  description = "The private key for the service account (base64 encoded)"
}