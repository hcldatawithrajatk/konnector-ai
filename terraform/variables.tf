variable "project_id" {
  description = "The Google Cloud Project ID"
  type        = string
  default     = "konnector-ai-prod"
}

variable "region" {
  description = "The primary Google Cloud region for compute and database resources"
  type        = string
  default     = "us-central1"
}

variable "db_password" {
  description = "The master password for Cloud SQL PostgreSQL"
  type        = string
  sensitive   = true
  default     = "ChangeMeToStrongMasterPass123!"
}

variable "gemini_api_key" {
  description = "Google Gemini 2.5 API Key stored securely in Secret Manager"
  type        = string
  sensitive   = true
  default     = "AIzaSyFakeKeyForTerraformInit"
}

variable "whatsapp_token" {
  description = "Meta WhatsApp Cloud API Access Token"
  type        = string
  sensitive   = true
  default     = "EAAG_meta_permanent_access_token"
}

variable "domain_name" {
  description = "Custom domain for the HTTPS Load Balancer"
  type        = string
  default     = "konnector.ai"
}
