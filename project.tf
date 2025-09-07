terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

# Variables
variable "billing_account" {
  description = "The billing account ID to associate with the project"
  type        = string
}

variable "organization_id" {
  description = "The organization ID (optional, if using organization)"
  type        = string
  default     = ""
}

variable "folder_id" {
  description = "The folder ID (optional, if using folders)"
  type        = string
  default     = ""
}

variable "project_name" {
  description = "The project name"
  type        = string
  default     = "web-page"
}

# Random suffix for unique project ID
resource "random_id" "project_suffix" {
  byte_length = 4
}

locals {
  project_id = "${var.project_name}-${random_id.project_suffix.hex}"
}

# Provider configuration
provider "google" {
  region = "us-central1"
}

# Create the project
resource "google_project" "web_page" {
  name            = var.project_name
  project_id      = local.project_id
  billing_account = var.billing_account
  
  # Use either organization_id or folder_id, not both
  org_id    = var.organization_id != "" ? var.organization_id : null
  folder_id = var.folder_id != "" ? var.folder_id : null
}

# Enable required APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "compute.googleapis.com",
    "storage.googleapis.com",
    "dns.googleapis.com",
    "certificatemanager.googleapis.com",
    "iam.googleapis.com",
    "serviceusage.googleapis.com"
  ])
  
  project            = google_project.web_page.project_id
  service            = each.value
  disable_on_destroy = false
}

# Output the project ID for use in other configurations
output "project_id" {
  value       = google_project.web_page.project_id
  description = "The created project ID"
}