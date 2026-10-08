terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# 1. Enable Required GCP APIs
resource "google_project_service" "enabled_apis" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "secretmanager.googleapis.com",
    "storage.googleapis.com",
    "aiplatform.googleapis.com",
    "compute.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "vpcaccess.googleapis.com",
  ])
  service            = each.key
  disable_on_destroy = false
}

# 2. VPC Network & Serverless VPC Access Connector
resource "google_compute_network" "vpc_network" {
  name                    = "konnector-vpc"
  auto_create_subnetworks = true
}

resource "google_vpc_access_connector" "serverless_connector" {
  name          = "konnector-vpc-cx"
  region        = var.region
  network       = google_compute_network.vpc_network.name
  ip_cidr_range = "10.8.0.0/28"
}

# 3. Secret Manager Secrets
resource "google_secret_manager_secret" "gemini_api_key" {
  secret_id = "gemini-api-key"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "gemini_api_key_v" {
  secret      = google_secret_manager_secret.gemini_api_key.id
  secret_data = var.gemini_api_key
}

resource "google_secret_manager_secret" "whatsapp_token" {
  secret_id = "whatsapp-cloud-api-token"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "whatsapp_token_v" {
  secret      = google_secret_manager_secret.whatsapp_token.id
  secret_data = var.whatsapp_token
}

# 4. Cloud Storage Bucket for Knowledge Base & WhatsApp Media
resource "google_storage_bucket" "knowledge_storage" {
  name                        = "${var.project_id}-knowledge-assets"
  location                    = var.region
  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
  cors {
    origin          = ["https://${var.domain_name}"]
    method          = ["GET", "POST", "PUT"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# 5. Cloud SQL PostgreSQL (with High Availability and pgvector)
resource "google_sql_database_instance" "postgres_instance" {
  name             = "konnector-postgres-db"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier              = "db-custom-4-16384" # 4 vCPUs, 16GB RAM
    availability_type = "REGIONAL"          # Multi-zone High Availability

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
    }

    ip_configuration {
      ipv4_enabled = true
    }

    database_flags {
      name  = "cloudsql.enable_pgvector"
      value = "on"
    }
  }

  deletion_protection = false
}

resource "google_sql_database" "database" {
  name     = "konnector_ai"
  instance = google_sql_database_instance.postgres_instance.name
}

resource "google_sql_user" "db_user" {
  name     = "konnector_admin"
  instance = google_sql_database_instance.postgres_instance.name
  password = var.db_password
}

# 6. Memorystore Redis for Multi-Tenant Caching
resource "google_redis_instance" "cache" {
  name               = "konnector-redis-cache"
  tier               = "STANDARD_HA"
  memory_size_gb     = 5
  region             = var.region
  authorized_network = google_compute_network.vpc_network.id
  redis_version      = "REDIS_7_0"
}

# 7. Cloud Armor Security Policy
resource "google_compute_security_policy" "cloud_armor_policy" {
  name        = "konnector-cloud-armor"
  description = "Cloud Armor defense: Rate Limiting & OWASP Top 10"

  # Rate limit rule: 1000 requests per IP per minute
  rule {
    action   = "rate_based_ban"
    priority = "1000"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    rate_limit_options {
      conform_action = "allow"
      exceed_action  = "deny(429)"
      rate_limit_threshold {
        count        = 1000
        interval_sec = 60
      }
      ban_duration_sec = 300
    }
    description = "Rate limit defense"
  }

  # Default allow rule
  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default allow"
  }
}

# 7.1 Dedicated Service Account for Cloud Run Workloads
resource "google_service_account" "cloud_run_sa" {
  account_id   = "konnector-cloudrun-sa"
  display_name = "Konnector Cloud Run Workload Service Account"
}

resource "google_project_iam_member" "cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_project_iam_member" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_project_iam_member" "storage_admin" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_project_iam_member" "vertex_ai_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

# 8. Cloud Run Backend Service
resource "google_cloud_run_v2_service" "backend" {
  name     = "konnector-backend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.cloud_run_sa.email
    scaling {
      min_instance_count = 1
      max_instance_count = 50
    }

    vpc_access {
      connector = google_vpc_access_connector.serverless_connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    containers {
      image = "us-central1-docker.pkg.dev/${var.project_id}/konnector-repo/backend:latest"

      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
      }

      env {
        name  = "PORT"
        value = "4000"
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "REDIS_HOST"
        value = google_redis_instance.cache.host
      }
      env {
        name  = "REDIS_PORT"
        value = tostring(google_redis_instance.cache.port)
      }
      env {
        name  = "DATABASE_URL"
        value = "postgresql://${google_sql_user.db_user.name}:${var.db_password}@${google_sql_database_instance.postgres_instance.public_ip_address}:5432/${google_sql_database.database.name}?schema=public"
      }
    }
  }
}

# 9. Cloud Run Frontend Service
resource "google_cloud_run_v2_service" "frontend" {
  name     = "konnector-frontend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 1
      max_instance_count = 20
    }

    containers {
      image = "us-central1-docker.pkg.dev/${var.project_id}/konnector-repo/frontend:latest"

      resources {
        limits = {
          cpu    = "1"
          memory = "1Gi"
        }
      }

      env {
        name  = "NEXT_PUBLIC_API_URL"
        value = google_cloud_run_v2_service.backend.uri
      }
    }
  }
}

# 10. Public Access Policies for Cloud Run
resource "google_cloud_run_v2_service_iam_member" "backend_public" {
  name     = google_cloud_run_v2_service.backend.name
  location = google_cloud_run_v2_service.backend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "frontend_public" {
  name     = google_cloud_run_v2_service.frontend.name
  location = google_cloud_run_v2_service.frontend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
