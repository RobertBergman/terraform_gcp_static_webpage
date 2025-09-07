# Website Files Upload Configuration

# Main index page (menu)
resource "google_storage_bucket_object" "index" {
  name         = "index.html"
  bucket       = google_storage_bucket.website.name
  source       = "index.html"
  content_type = "text/html"
}

# 404 error page
resource "google_storage_bucket_object" "not_found" {
  name         = "404.html"
  bucket       = google_storage_bucket.website.name
  source       = "404.html"
  content_type = "text/html"
}

# Hello World animation page
resource "google_storage_bucket_object" "hello_index" {
  name         = "hello/index.html"
  bucket       = google_storage_bucket.website.name
  source       = "hello/index.html"
  content_type = "text/html"
}

# Asteroids game files
resource "google_storage_bucket_object" "asteroids_index" {
  name         = "asteroids/index.html"
  bucket       = google_storage_bucket.website.name
  source       = "asteroids/index.html"
  content_type = "text/html"
}

resource "google_storage_bucket_object" "asteroids_js" {
  name         = "asteroids/asteroids.js"
  bucket       = google_storage_bucket.website.name
  source       = "asteroids/asteroids.js"
  content_type = "application/javascript"
}

resource "google_storage_bucket_object" "asteroids_wasm" {
  name         = "asteroids/asteroids.wasm"
  bucket       = google_storage_bucket.website.name
  source       = "asteroids/asteroids.wasm"
  content_type = "application/wasm"
}