variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "us-central1-a"
}

variable "machine_type" {
  description = "Machine type for Compute Engine"
  type        = string
  default     = "e2-micro" # Free tier eligible
}

variable "use_spot_instance" {
  description = "Use spot (preemptible) instance for cost savings"
  type        = bool
  default     = true
}

variable "domain_name" {
  description = "Domain name"
  type        = string
  default     = "fatesblind.com"
}

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
}

variable "nextauth_secret" {
  description = "NextAuth secret key"
  type        = string
  sensitive   = true
}
