resource "google_app_engine_application" "app" {
  project     = google_project.web_page.project_id
  location_id = "us-central"
  
  depends_on = [google_project_service.apis]
}

# Build the Next.js app before deployment
resource "null_resource" "build_nextjs" {
  triggers = {
    always_run = timestamp()
  }
  
  provisioner "local-exec" {
    command = "cd nextjs-site && npm install && npm run build"
  }
}

# Deploy to App Engine using gcloud
resource "null_resource" "deploy_app_engine" {
  triggers = {
    always_run = timestamp()
  }
  
  provisioner "local-exec" {
    command = <<-EOT
      gcloud app deploy nextjs-site/app.yaml \
        --project=${google_project.web_page.project_id} \
        --quiet \
        --version=v${formatdate("YYYYMMDDhhmmss", timestamp())}
    EOT
  }
  
  depends_on = [
    google_app_engine_application.app,
    null_resource.build_nextjs
  ]
}

# Set up custom domain mapping - DISABLED: Using Load Balancer for domain routing
# resource "google_app_engine_domain_mapping" "fatesblind" {
#   project     = google_project.web_page.project_id
#   domain_name = "fatesblind.com"
#   
#   ssl_settings {
#     ssl_management_type = "AUTOMATIC"
#   }
#   
#   depends_on = [google_app_engine_application.app]
# }
# 
# resource "google_app_engine_domain_mapping" "www_fatesblind" {
#   project     = google_project.web_page.project_id
#   domain_name = "www.fatesblind.com"
#   
#   ssl_settings {
#     ssl_management_type = "AUTOMATIC"
#   }
#   
#   depends_on = [google_app_engine_application.app]
# }

# Output the App Engine URL
output "app_engine_url" {
  value = "https://${google_app_engine_application.app.default_hostname}"
  description = "The default App Engine URL"
}

output "custom_domain_url" {
  value = "https://fatesblind.com"
  description = "The custom domain URL"
}