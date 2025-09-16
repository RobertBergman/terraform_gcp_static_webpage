provider "google" {
  project = "your-gcp-project-id"
}

resource "google_storage_bucket" "app_bucket" {
  name     = "app-engine-code-bucket-${random_id.bucket_suffix.hex}"
  location = "US-CENTRAL1"
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

data "archive_file" "app_archive" {
  type        = "zip"
  source_dir  = "."
  output_path = "/tmp/app.zip"
}

resource "google_storage_bucket_object" "app_archive" {
  name   = "app.zip"
  bucket = google_storage_bucket.app_bucket.name
  source = data.archive_file.app_archive.output_path
}

resource "google_app_engine_standard_app_version" "app_version" {
  version_id = "v1"
  service    = "default"

  runtime = "nodejs18"

  entrypoint {
    shell = "npm start"
  }

  deployment {
    zip {
      source_url = "https://storage.googleapis.com/${google_storage_bucket.app_bucket.name}/${google_storage_bucket_object.app_archive.name}"
    }
  }

  env_variables = {
    GOOGLE_CLIENT_ID     = "your-google-client-id"
    GOOGLE_CLIENT_SECRET = "your-google-client-secret"
    NEXTAUTH_SECRET      = "your-next-auth-secret"
  }

  instance_class = "F2"
}

resource "google_project_service" "appengine_api" {
  service = "appengine.googleapis.com"
}

output "app_url" {
  value = google_app_engine_standard_app_version.app_version.name
}
