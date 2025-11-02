# Enable Compute Engine API
resource "google_project_service" "compute" {
  service            = "compute.googleapis.com"
  disable_on_destroy = false
}

# Create a service account for the VM
resource "google_service_account" "vm_service_account" {
  account_id   = "nextjs-vm-sa"
  display_name = "Next.js VM Service Account"
  description  = "Service account for Next.js Compute Engine instance"
}

# Note: IAM roles need to be granted manually due to permission restrictions
# Run these commands after deployment:
# gcloud projects add-iam-policy-binding web-page-d9ec622e \
#   --member="serviceAccount:nextjs-vm-sa@web-page-d9ec622e.iam.gserviceaccount.com" \
#   --role="roles/cloudsql.client"
# gcloud projects add-iam-policy-binding web-page-d9ec622e \
#   --member="serviceAccount:nextjs-vm-sa@web-page-d9ec622e.iam.gserviceaccount.com" \
#   --role="roles/secretmanager.secretAccessor"

# Alternatively, the service account has cloud-platform scope which provides access

# Startup script template
data "template_file" "startup_script" {
  template = file("${path.module}/startup-script.sh")

  vars = {
    project_id           = var.project_id
    db_connection_name   = data.google_sql_database_instance.existing_db.connection_name
    db_name              = "recipe_generator"
    db_user              = "recipe_app"
    domain_name          = var.domain_name
    google_client_id     = var.google_client_id
    google_client_secret = var.google_client_secret
    nextauth_secret      = var.nextauth_secret
  }
}

# Get existing Cloud SQL instance
data "google_sql_database_instance" "existing_db" {
  name    = "recipe-generator-db"
  project = var.project_id
}

# Create static IP address
resource "google_compute_address" "vm_ip" {
  name         = "nextjs-vm-ip"
  address_type = "EXTERNAL"
  region       = var.region
}

# Firewall rule for HTTP
resource "google_compute_firewall" "allow_http" {
  name    = "allow-http"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}

# Firewall rule for HTTPS
resource "google_compute_firewall" "allow_https" {
  name    = "allow-https"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["https-server"]
}

# Firewall rule for SSH (restricted)
resource "google_compute_firewall" "allow_ssh" {
  name    = "allow-ssh-restricted"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["35.235.240.0/20"] # IAP for SSH
  target_tags   = ["ssh-server"]
}

# Compute Engine Instance
resource "google_compute_instance" "nextjs_vm" {
  name         = "nextjs-vm"
  machine_type = var.machine_type
  zone         = var.zone

  # Spot (preemptible) instance for cost savings
  scheduling {
    preemptible       = var.use_spot_instance
    automatic_restart = !var.use_spot_instance
    on_host_maintenance = var.use_spot_instance ? "TERMINATE" : "MIGRATE"
    provisioning_model = var.use_spot_instance ? "SPOT" : "STANDARD"
  }

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 20
      type  = "pd-balanced"
    }
  }

  network_interface {
    network = "default"

    access_config {
      nat_ip = google_compute_address.vm_ip.address
    }
  }

  # Allow HTTP, HTTPS, and SSH
  tags = ["http-server", "https-server", "ssh-server"]

  # Startup script
  metadata = {
    startup-script = data.template_file.startup_script.rendered
  }

  service_account {
    email  = google_service_account.vm_service_account.email
    scopes = ["cloud-platform"]
  }

  # Allow the instance to be deleted
  allow_stopping_for_update = true

  depends_on = [
    google_project_service.compute,
    google_service_account.vm_service_account
  ]
}

# Health check for load balancer
resource "google_compute_health_check" "nextjs_health" {
  name                = "nextjs-health-check"
  check_interval_sec  = 10
  timeout_sec         = 5
  healthy_threshold   = 2
  unhealthy_threshold = 3

  http_health_check {
    port         = 80
    request_path = "/"
  }
}

# Instance group for load balancer
resource "google_compute_instance_group" "nextjs_group" {
  name      = "nextjs-instance-group"
  zone      = var.zone
  instances = [google_compute_instance.nextjs_vm.id]

  named_port {
    name = "http"
    port = 80
  }

  named_port {
    name = "https"
    port = 443
  }
}

# Backend service
resource "google_compute_backend_service" "nextjs_backend" {
  name                  = "nextjs-backend"
  protocol              = "HTTP"
  port_name             = "http"
  timeout_sec           = 30
  enable_cdn            = true
  health_checks         = [google_compute_health_check.nextjs_health.id]

  backend {
    group           = google_compute_instance_group.nextjs_group.id
    balancing_mode  = "UTILIZATION"
    capacity_scaler = 1.0
  }

  cdn_policy {
    cache_mode                  = "CACHE_ALL_STATIC"
    client_ttl                  = 3600
    default_ttl                 = 3600
    max_ttl                     = 86400
    negative_caching            = true
    serve_while_stale           = 86400
    signed_url_cache_max_age_sec = 3600

    cache_key_policy {
      include_host         = true
      include_protocol     = true
      include_query_string = true
    }
  }
}

# Outputs
output "vm_external_ip" {
  description = "External IP address of the VM"
  value       = google_compute_address.vm_ip.address
}

output "ssh_command" {
  description = "SSH command to connect via IAP"
  value       = "gcloud compute ssh nextjs-vm --zone=${var.zone} --project=${var.project_id}"
}

output "vm_name" {
  description = "Name of the VM instance"
  value       = google_compute_instance.nextjs_vm.name
}
