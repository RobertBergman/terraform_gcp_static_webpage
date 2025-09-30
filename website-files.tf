# Website Files Upload Configuration
# DISABLED: Using App Engine with Next.js instead of static files in Cloud Storage
# All website content is now served through the Next.js application deployed to App Engine

# # Main index page (menu) - generated from template with OAuth client ID
# resource "google_storage_bucket_object" "index" {
#   name         = "index.html"
#   bucket       = google_storage_bucket.website.name
#   source       = local_file.index_html.filename
#   content_type = "text/html"
#
#   depends_on = [local_file.index_html]
# }

# # 404 error page
# resource "google_storage_bucket_object" "not_found" {
#   name         = "404.html"
#   bucket       = google_storage_bucket.website.name
#   source       = "404.html"
#   content_type = "text/html"
# }

# # Hello World animation page
# resource "google_storage_bucket_object" "hello_index" {
#   name         = "hello/index.html"
#   bucket       = google_storage_bucket.website.name
#   source       = "hello/index.html"
#   content_type = "text/html"
# }

# # Asteroids game files
# resource "google_storage_bucket_object" "asteroids_index" {
#   name         = "asteroids/index.html"
#   bucket       = google_storage_bucket.website.name
#   source       = "asteroids/index.html"
#   content_type = "text/html"
# }

# resource "google_storage_bucket_object" "asteroids_js" {
#   name         = "asteroids/asteroids.js"
#   bucket       = google_storage_bucket.website.name
#   source       = "asteroids/asteroids.js"
#   content_type = "application/javascript"
# }

# resource "google_storage_bucket_object" "asteroids_wasm" {
#   name         = "asteroids/asteroids.wasm"
#   bucket       = google_storage_bucket.website.name
#   source       = "asteroids/asteroids.wasm"
#   content_type = "application/wasm"
# }

# resource "google_storage_bucket_object" "asteroids_data" {
#   name         = "asteroids/asteroids.data"
#   bucket       = google_storage_bucket.website.name
#   source       = "asteroids/asteroids.data"
#   content_type = "application/octet-stream"
# }

# # Assets directory files (at root level as expected by the game)
# resource "google_storage_bucket_object" "assets_readme" {
#   name         = "assets/README.md"
#   bucket       = google_storage_bucket.website.name
#   source       = "assets/README.md"
#   content_type = "text/markdown"
# }