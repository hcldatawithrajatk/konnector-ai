output "backend_cloud_run_url" {
  description = "The public URL of the deployed NestJS Backend on Cloud Run"
  value       = google_cloud_run_v2_service.backend.uri
}

output "frontend_cloud_run_url" {
  description = "The public URL of the deployed Next.js Frontend on Cloud Run"
  value       = google_cloud_run_v2_service.frontend.uri
}

output "cloud_sql_ip" {
  description = "The public IP address of the Cloud SQL PostgreSQL instance"
  value       = google_sql_database_instance.postgres_instance.public_ip_address
}

output "redis_memorystore_host" {
  description = "The internal host of the Memorystore Redis cache"
  value       = google_redis_instance.cache.host
}

output "storage_bucket_name" {
  description = "Google Cloud Storage bucket for knowledge documents and WhatsApp media"
  value       = google_storage_bucket.knowledge_storage.name
}
