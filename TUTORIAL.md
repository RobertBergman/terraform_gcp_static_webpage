# Complete Guide: Building and Deploying a Static Website on Google Cloud with Terraform

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Step 1: Setting Up Google Cloud](#step-1-setting-up-google-cloud)
5. [Step 2: Creating the Terraform Configuration](#step-2-creating-the-terraform-configuration)
6. [Step 3: Building the Static Website](#step-3-building-the-static-website)
7. [Step 4: Configuring the Service Account](#step-4-configuring-the-service-account)
8. [Step 5: Deployment](#step-5-deployment)
9. [Step 6: DNS Configuration](#step-6-dns-configuration)
10. [Cost Analysis](#cost-analysis)
11. [Troubleshooting](#troubleshooting)
12. [Clean Up](#clean-up)

## Introduction

This tutorial demonstrates how to deploy a professional static website on Google Cloud Platform using Terraform for infrastructure as code. You'll learn to:
- Create a new GCP project programmatically
- Host static content with Cloud Storage
- Set up HTTPS with managed SSL certificates
- Configure a global load balancer with CDN
- Implement custom domain with Cloud DNS
- Automate everything with Terraform

**Final Result**: A secure, globally distributed website at https://yourdomain.com with automatic SSL and CDN caching.

## Prerequisites

### Required Tools
```bash
# Check if tools are installed
gcloud --version  # Google Cloud SDK
terraform --version  # Terraform >= 1.0
```

### Install Missing Tools
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Install Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

### Google Cloud Requirements
- Active Google Cloud account
- Billing account enabled
- Domain name ownership

## Project Structure

Create the following directory structure:
```
google_cloud_website/
├── project.tf           # Project and API configuration
├── main.tf              # Infrastructure resources
├── service-account.tf   # Service account setup
├── terraform.tfvars     # Variable values
├── index.html           # Website homepage
├── 404.html            # Error page
├── .gitignore          # Git exclusions
└── README.md           # Documentation
```

## Step 1: Setting Up Google Cloud

### 1.1 Authenticate with Google Cloud
```bash
gcloud auth login
gcloud config set account YOUR_EMAIL@domain.com
```

### 1.2 Get Your Billing Account ID
```bash
gcloud billing accounts list --format="table(name,displayName,open)"
```

Output example:
```
ACCOUNT_ID            NAME                  OPEN
01D7B7-328031-6B8063  My Billing Account    True
```

### 1.3 Create terraform.tfvars
```hcl
# terraform.tfvars
billing_account = "YOUR-BILLING-ACCOUNT-ID"
organization_id = ""  # Leave empty if not using organization
folder_id = ""        # Leave empty if not using folders
```

## Step 2: Creating the Terraform Configuration

### 2.1 Project Configuration (project.tf)

This file creates the GCP project and enables necessary APIs:

```hcl
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
  description = "The billing account ID"
  type        = string
}

variable "organization_id" {
  description = "Organization ID (optional)"
  type        = string
  default     = ""
}

variable "folder_id" {
  description = "Folder ID (optional)"
  type        = string
  default     = ""
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "web-page"
}

# Generate unique project ID
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
  org_id          = var.organization_id != "" ? var.organization_id : null
  folder_id       = var.folder_id != "" ? var.folder_id : null
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

output "project_id" {
  value       = google_project.web_page.project_id
  description = "The created project ID"
}
```

### 2.2 Infrastructure Configuration (main.tf)

This file defines all infrastructure resources:

```hcl
# Storage bucket for static website
resource "google_storage_bucket" "website" {
  name          = "website-${random_id.project_suffix.hex}"
  project       = google_project.web_page.project_id
  location      = "US"
  force_destroy = true
  
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
  
  cors {
    origin          = ["https://yourdomain.com"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
  
  uniform_bucket_level_access = true
  depends_on = [google_project_service.apis]
}

# Make bucket publicly accessible
resource "google_storage_bucket_iam_member" "public_access" {
  bucket = google_storage_bucket.website.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Upload website files
resource "google_storage_bucket_object" "index" {
  name         = "index.html"
  bucket       = google_storage_bucket.website.name
  source       = "index.html"
  content_type = "text/html"
}

resource "google_storage_bucket_object" "not_found" {
  name         = "404.html"
  bucket       = google_storage_bucket.website.name
  source       = "404.html"
  content_type = "text/html"
}

# Reserve static IP address
resource "google_compute_global_address" "website_ip" {
  name       = "website-ip"
  project    = google_project.web_page.project_id
  depends_on = [google_project_service.apis]
}

# SSL Certificate
resource "google_certificate_manager_certificate" "website_cert" {
  name     = "website-cert"
  project  = google_project.web_page.project_id
  location = "global"
  
  managed {
    domains = ["yourdomain.com", "www.yourdomain.com"]
  }
  
  depends_on = [google_project_service.apis]
}

# Certificate Map for HTTPS proxy
resource "google_certificate_manager_certificate_map" "website_cert_map" {
  name       = "website-cert-map"
  project    = google_project.web_page.project_id
  depends_on = [google_project_service.apis]
}

# Map certificate to domains
resource "google_certificate_manager_certificate_map_entry" "website_cert_entry" {
  name         = "website-cert-entry"
  project      = google_project.web_page.project_id
  map          = google_certificate_manager_certificate_map.website_cert_map.name
  hostname     = "yourdomain.com"
  certificates = [google_certificate_manager_certificate.website_cert.id]
}

resource "google_certificate_manager_certificate_map_entry" "website_cert_entry_www" {
  name         = "website-cert-entry-www"
  project      = google_project.web_page.project_id
  map          = google_certificate_manager_certificate_map.website_cert_map.name
  hostname     = "www.yourdomain.com"
  certificates = [google_certificate_manager_certificate.website_cert.id]
}

# Backend bucket for load balancer
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

# URL map for routing
resource "google_compute_url_map" "website" {
  name            = "website-url-map"
  project         = google_project.web_page.project_id
  default_service = google_compute_backend_bucket.website_backend.id
  depends_on      = [google_project_service.apis]
}

# HTTPS proxy
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

# HTTPS forwarding rule
resource "google_compute_global_forwarding_rule" "website_https" {
  name        = "website-https-rule"
  project     = google_project.web_page.project_id
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

# Cloud DNS zone
resource "google_dns_managed_zone" "website" {
  name        = "website-zone"
  project     = google_project.web_page.project_id
  dns_name    = "yourdomain.com."
  description = "DNS zone for website"
  depends_on  = [google_project_service.apis]
}

# DNS A records
resource "google_dns_record_set" "website_a" {
  name         = google_dns_managed_zone.website.dns_name
  project      = google_project.web_page.project_id
  managed_zone = google_dns_managed_zone.website.name
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_global_address.website_ip.address]
}

resource "google_dns_record_set" "website_www" {
  name         = "www.${google_dns_managed_zone.website.dns_name}"
  project      = google_project.web_page.project_id
  managed_zone = google_dns_managed_zone.website.name
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_global_address.website_ip.address]
}

# Outputs
output "website_ip" {
  value = google_compute_global_address.website_ip.address
}

output "name_servers" {
  value = google_dns_managed_zone.website.name_servers
}

output "bucket_url" {
  value = google_storage_bucket.website.url
}
```

## Step 3: Building the Static Website

### 3.1 Create index.html

Example with animated multi-language greeting:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World - Multiple Languages</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
        }

        .container {
            text-align: center;
            position: relative;
        }

        .greeting {
            font-size: 4rem;
            font-weight: bold;
            color: white;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            position: absolute;
            width: 100%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            animation: fadeInOut 3s ease-in-out;
            white-space: nowrap;
        }

        .language {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.9);
            margin-top: 1rem;
            font-weight: 300;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }

        @media (max-width: 768px) {
            .greeting { font-size: 2.5rem; }
            .language { font-size: 1rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="greeting-container"></div>
    </div>

    <script>
        const greetings = [
            { text: "Hello World!", language: "English" },
            { text: "¡Hola Mundo!", language: "Spanish" },
            { text: "Bonjour le Monde!", language: "French" },
            { text: "Hallo Welt!", language: "German" },
            { text: "Ciao Mondo!", language: "Italian" },
            { text: "Olá Mundo!", language: "Portuguese" },
            { text: "Привет мир!", language: "Russian" },
            { text: "你好世界!", language: "Chinese" },
            { text: "こんにちは世界!", language: "Japanese" },
            { text: "مرحبا بالعالم!", language: "Arabic" }
        ];

        let currentIndex = 0;
        const container = document.getElementById('greeting-container');

        function displayGreeting() {
            container.innerHTML = '';
            const greetingDiv = document.createElement('div');
            greetingDiv.className = 'greeting';
            greetingDiv.innerHTML = `
                ${greetings[currentIndex].text}
                <div class="language">${greetings[currentIndex].language}</div>
            `;
            container.appendChild(greetingDiv);
            currentIndex = (currentIndex + 1) % greetings.length;
        }

        displayGreeting();
        setInterval(displayGreeting, 3000);
    </script>
</body>
</html>
```

### 3.2 Create 404.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .container {
            text-align: center;
            color: white;
        }

        .error-code {
            font-size: 8rem;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            margin: 0;
        }

        .error-message {
            font-size: 1.5rem;
            margin: 1rem 0;
        }

        .back-link {
            display: inline-block;
            margin-top: 2rem;
            padding: 0.8rem 2rem;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            transition: background 0.3s ease;
        }

        .back-link:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="error-code">404</h1>
        <p class="error-message">Page Not Found</p>
        <a href="/" class="back-link">Go Home</a>
    </div>
</body>
</html>
```

## Step 4: Configuring the Service Account

### 4.1 Create service-account.tf

```hcl
# Service Account for Terraform Management
resource "google_service_account" "terraform" {
  account_id   = "terraform-sa"
  display_name = "Terraform Service Account"
  project      = google_project.web_page.project_id
  description  = "Service account for managing infrastructure via Terraform"
}

# Assign necessary roles
resource "google_project_iam_member" "terraform_roles" {
  for_each = toset([
    "roles/editor",
    "roles/storage.admin",
    "roles/compute.admin",
    "roles/dns.admin",
    "roles/certificatemanager.editor",
    "roles/serviceusage.serviceUsageAdmin"
  ])
  
  project = google_project.web_page.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

# Create service account key
resource "google_service_account_key" "terraform_key" {
  service_account_id = google_service_account.terraform.name
  key_algorithm      = "KEY_ALG_RSA_2048"
  private_key_type   = "TYPE_GOOGLE_CREDENTIALS_FILE"
}

# Output service account details
output "service_account_email" {
  value = google_service_account.terraform.email
}

output "service_account_key" {
  value     = google_service_account_key.terraform_key.private_key
  sensitive = true
}
```

### 4.2 Create .gitignore

```gitignore
# Terraform files
*.tfstate
*.tfstate.*
.terraform/
.terraform.lock.hcl
terraform.tfvars
*.auto.tfvars

# Service account keys
sa-key.json
*.json
credentials.json

# IDE files
.DS_Store
.idea/
.vscode/
*.swp

# Logs
*.log
```

## Step 5: Deployment

### 5.1 Initialize Terraform
```bash
cd google_cloud_website
terraform init
```

Expected output:
```
Initializing the backend...
Initializing provider plugins...
- Installing hashicorp/google v5.45.2...
- Installing hashicorp/random v3.7.2...
Terraform has been successfully initialized!
```

### 5.2 Set up Authentication
```bash
# Option 1: Use gcloud authentication
export GOOGLE_OAUTH_ACCESS_TOKEN=$(gcloud auth print-access-token)

# Option 2: Use service account (after first deployment)
export GOOGLE_APPLICATION_CREDENTIALS="sa-key.json"
```

### 5.3 Plan the Deployment
```bash
terraform plan -out=tfplan
```

Review the plan - it should show ~35 resources to create.

### 5.4 Apply the Configuration
```bash
terraform apply tfplan
```

This process takes 3-5 minutes. Save the outputs:
```
Outputs:
project_id = "web-page-8ce1f44f"
website_ip = "34.111.242.155"
name_servers = [
  "ns-cloud-c1.googledomains.com.",
  "ns-cloud-c2.googledomains.com.",
  "ns-cloud-c3.googledomains.com.",
  "ns-cloud-c4.googledomains.com.",
]
```

### 5.5 Extract Service Account Key (Optional)
```bash
terraform output -raw service_account_key | base64 --decode > sa-key.json
```

## Step 6: DNS Configuration

### 6.1 Update Domain Name Servers

1. Log into your domain registrar
2. Navigate to DNS management
3. Replace existing name servers with Google's:
   ```
   ns-cloud-c1.googledomains.com
   ns-cloud-c2.googledomains.com
   ns-cloud-c3.googledomains.com
   ns-cloud-c4.googledomains.com
   ```

### 6.2 Verify DNS Propagation
```bash
# Check name servers
dig +short NS yourdomain.com

# Check A record
dig +short A yourdomain.com

# Expected output: Your static IP address
```

### 6.3 Monitor SSL Certificate Provisioning
```bash
# Check certificate status
gcloud certificate-manager certificates describe website-cert \
  --location=global \
  --project=YOUR_PROJECT_ID \
  --format=json | jq '.managed.state'
```

States progression:
- `PROVISIONING` → `AUTHORIZING` → `AUTHORIZED` → `ACTIVE`

### 6.4 Test the Website
```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://yourdomain.com

# Test HTTPS (after certificate is active)
curl -I https://yourdomain.com

# Direct bucket access (immediate)
curl https://storage.googleapis.com/YOUR_BUCKET_NAME/index.html
```

## Cost Analysis

### Monthly Cost Breakdown
| Service | Cost | Details |
|---------|------|---------|
| Load Balancer | ~$18 | Global forwarding rules |
| Cloud DNS | $0.20 | Per managed zone |
| Static IP | $0 | Free when in use |
| Cloud Storage | ~$0.02 | For HTML files |
| Network Egress | $0-12 | First 1GB free, then $0.12/GB |
| SSL Certificate | $0 | Google-managed certificates free |
| **Total** | **~$18-30** | Varies with traffic |

### Cost Optimization Tips
1. **For Development**: Use `terraform destroy` when not needed
2. **For Low Traffic**: Consider Firebase Hosting (free tier)
3. **For High Traffic**: CDN caching reduces egress costs

## Troubleshooting

### Common Issues and Solutions

#### 1. Terraform Authentication Error
```bash
Error: Attempted to load application default credentials
```
**Solution:**
```bash
export GOOGLE_OAUTH_ACCESS_TOKEN=$(gcloud auth print-access-token)
terraform plan
```

#### 2. SSL Certificate Not Working
```bash
curl: (35) SSL_ERROR_SYSCALL
```
**Solution:** Wait 15-30 minutes for certificate provisioning. Check status:
```bash
gcloud certificate-manager certificates list --project=PROJECT_ID
```

#### 3. DNS Not Resolving
**Solution:** DNS propagation takes 24-48 hours. Verify with:
```bash
nslookup yourdomain.com 8.8.8.8
```

#### 4. 403 Forbidden on Bucket
**Solution:** Ensure public access is configured:
```bash
gsutil iam ch allUsers:objectViewer gs://YOUR_BUCKET_NAME
```

#### 5. Billing Account Issues
```bash
Error: Billing account is not active
```
**Solution:** Verify billing account:
```bash
gcloud billing accounts list --filter="open=true"
```

### Debug Commands
```bash
# Check project status
gcloud projects describe PROJECT_ID

# List all resources
gcloud compute backend-buckets list --project=PROJECT_ID
gcloud compute url-maps list --project=PROJECT_ID
gcloud compute target-https-proxies list --project=PROJECT_ID

# View logs
gcloud logging read "resource.type=http_load_balancer" --project=PROJECT_ID --limit=10

# Test load balancer directly
curl -H "Host: yourdomain.com" http://YOUR_IP_ADDRESS
```

## Clean Up

### Destroy All Resources
```bash
# Remove all infrastructure
terraform destroy

# Confirm by typing 'yes'
```

### Manual Cleanup (if needed)
```bash
# Delete project entirely
gcloud projects delete PROJECT_ID

# Remove local files
rm -rf .terraform/
rm terraform.tfstate*
```

## Advanced Topics

### Adding More Pages
1. Create new HTML files
2. Add to Terraform:
```hcl
resource "google_storage_bucket_object" "new_page" {
  name         = "about.html"
  bucket       = google_storage_bucket.website.name
  source       = "about.html"
  content_type = "text/html"
}
```
3. Run `terraform apply`

### Custom Domain Redirects
Add redirect rules in URL map:
```hcl
host_rule {
  hosts        = ["old-domain.com"]
  path_matcher = "redirect"
}

path_matcher {
  name = "redirect"
  default_url_redirect {
    host_redirect = "new-domain.com"
    https_redirect = true
    strip_query = false
  }
}
```

### Monitoring and Alerts
```hcl
resource "google_monitoring_uptime_check_config" "website" {
  display_name = "Website Uptime Check"
  timeout      = "10s"
  period       = "60s"

  http_check {
    path         = "/"
    port         = "443"
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      host       = "yourdomain.com"
      project_id = google_project.web_page.project_id
    }
  }
}
```

## Best Practices

1. **Security**
   - Never commit `terraform.tfvars` or service account keys
   - Use least-privilege IAM roles
   - Enable Cloud Audit Logging

2. **Performance**
   - Optimize images before uploading
   - Use appropriate cache headers
   - Enable Gzip compression

3. **Maintenance**
   - Use Terraform workspaces for staging/production
   - Tag resources for cost tracking
   - Regular security updates

4. **Backup**
   - Version control your Terraform code
   - Backup Terraform state files
   - Document infrastructure changes

## Conclusion

You've successfully deployed a production-ready static website on Google Cloud Platform using Terraform. This setup provides:
- Global content delivery via CDN
- Automatic SSL certificate management
- Infrastructure as code for reproducibility
- Professional-grade performance and security

For updates or changes, simply modify your Terraform configuration and run `terraform apply`. The infrastructure will update automatically while maintaining consistency and reliability.

## Resources

- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Cloud Storage Static Website](https://cloud.google.com/storage/docs/hosting-static-website)
- [Certificate Manager](https://cloud.google.com/certificate-manager/docs)
- [Cloud CDN](https://cloud.google.com/cdn/docs)