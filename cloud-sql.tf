# Enable required APIs for Cloud SQL
resource "google_project_service" "sql_admin_api" {
  project = google_project.web_page.project_id
  service = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "secret_manager_api" {
  project = google_project.web_page.project_id
  service = "secretmanager.googleapis.com"
  disable_on_destroy = false
}

# Random suffix for database instance name
resource "random_id" "db_name_suffix" {
  byte_length = 4
}

# Cloud SQL PostgreSQL Instance for Recipe Generator
resource "google_sql_database_instance" "recipe_generator_db" {
  name             = "recipe-generator-db-${random_id.db_name_suffix.hex}"
  database_version = "POSTGRES_15"
  region           = "us-central1"
  project          = google_project.web_page.project_id

  settings {
    tier = "db-f1-micro" # Small instance for development/testing

    database_flags {
      name  = "max_connections"
      value = "100"
    }

    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = false # Set to true in production
      transaction_log_retention_days = 1     # Increase in production
    }

    ip_configuration {
      ipv4_enabled    = true
      private_network = null
      # Note: require_ssl is deprecated, use ssl_mode instead if needed

      # Allow App Engine and your local IP to connect
      authorized_networks {
        name  = "app-engine"
        value = "0.0.0.0/0" # Note: In production, restrict this
      }
    }

    insights_config {
      query_insights_enabled  = true
      query_string_length     = 1024
      record_application_tags = true
      record_client_address   = false
    }
  }

  deletion_protection = false # Set to true in production

  depends_on = [google_project_service.sql_admin_api]
}

# Create the database
resource "google_sql_database" "recipe_generator" {
  name     = "recipe_generator"
  instance = google_sql_database_instance.recipe_generator_db.name
  project  = google_project.web_page.project_id
}

# Create a database user with password
resource "random_password" "db_password" {
  length  = 32
  special = true
}

resource "google_sql_user" "recipe_app_user" {
  name     = "recipe_app"
  instance = google_sql_database_instance.recipe_generator_db.name
  password = random_password.db_password.result
  project  = google_project.web_page.project_id
}

# Store database connection string in Secret Manager
resource "google_secret_manager_secret" "db_connection_string" {
  secret_id = "recipe-generator-db-url"
  project   = google_project.web_page.project_id

  replication {
    auto {}
  }

  depends_on = [google_project_service.secret_manager_api]
}

# Create the secret version with the connection string
resource "google_secret_manager_secret_version" "db_connection_string" {
  secret = google_secret_manager_secret.db_connection_string.id

  # Connection string for App Engine (uses Cloud SQL proxy via Unix socket)
  secret_data = "postgresql://${google_sql_user.recipe_app_user.name}:${urlencode(random_password.db_password.result)}@localhost/${google_sql_database.recipe_generator.name}?host=/cloudsql/${google_project.web_page.project_id}:us-central1:${google_sql_database_instance.recipe_generator_db.name}"
}

# Grant App Engine service account access to the secret
resource "google_secret_manager_secret_iam_member" "app_engine_secret_accessor" {
  secret_id = google_secret_manager_secret.db_connection_string.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_project.web_page.project_id}@appspot.gserviceaccount.com"
  project   = google_project.web_page.project_id
}

# Grant App Engine service account access to Cloud SQL
resource "google_project_iam_member" "app_engine_sql_client" {
  project = google_project.web_page.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_project.web_page.project_id}@appspot.gserviceaccount.com"
}

# Output the connection details
output "db_instance_name" {
  value       = google_sql_database_instance.recipe_generator_db.name
  description = "The name of the Cloud SQL instance"
}

output "db_connection_name" {
  value       = google_sql_database_instance.recipe_generator_db.connection_name
  description = "The connection name of the Cloud SQL instance"
}

output "db_public_ip" {
  value       = google_sql_database_instance.recipe_generator_db.public_ip_address
  description = "The public IP address of the Cloud SQL instance"
  sensitive   = true
}

output "db_user" {
  value       = google_sql_user.recipe_app_user.name
  description = "Database user"
}

output "db_password" {
  value       = random_password.db_password.result
  description = "Database password"
  sensitive   = true
}

output "db_connection_string_local" {
  value       = "postgresql://${google_sql_user.recipe_app_user.name}:${urlencode(random_password.db_password.result)}@${google_sql_database_instance.recipe_generator_db.public_ip_address}:5432/${google_sql_database.recipe_generator.name}"
  description = "Database connection string for local development"
  sensitive   = true
}

output "db_connection_string_app_engine" {
  value       = "postgresql://${google_sql_user.recipe_app_user.name}:${urlencode(random_password.db_password.result)}@localhost/${google_sql_database.recipe_generator.name}?host=/cloudsql/${google_project.web_page.project_id}:us-central1:${google_sql_database_instance.recipe_generator_db.name}"
  description = "Database connection string for App Engine"
  sensitive   = true
}

output "secret_id" {
  value       = google_secret_manager_secret.db_connection_string.secret_id
  description = "The secret ID containing the database connection string"
}