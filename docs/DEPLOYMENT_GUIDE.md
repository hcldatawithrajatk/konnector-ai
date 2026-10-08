# Konnector AI - Production Deployment Guide (GCP & Docker)

This guide walks through deploying Konnector AI to production on **Google Cloud Platform (GCP)** using **Terraform, Cloud Run, Cloud SQL, Memorystore Redis, and Vertex AI**.

---

## 1. Quick Start (Local Development)

### 1.1 Prerequisites
- Node.js `v20.x` or higher
- Docker & Docker Compose
- Meta WhatsApp Developer Account (or sandbox credentials)

### 1.2 Running with Docker Compose
```bash
# 1. Clone repository and navigate to root
cd "Konnector AI"

# 2. Start PostgreSQL with pgvector, Redis, Backend, and Frontend
docker-compose up -d --build

# 3. Seed demo tenants (GreenField Academy, Apex Clinic, Prestige Realty)
docker-compose exec backend npm run seed
```

Access the interfaces:
- **Frontend SaaS App:** `http://localhost:3000`
- **Backend API & Swagger Docs:** `http://localhost:4000/api/docs`
- **Setup Wizard:** `http://localhost:3000/setup-wizard`

---

## 2. Google Cloud Platform Production Architecture

```
[Internet Traffic]
       │
[Cloud Armor Security Policy]
       │
[Global HTTPS External Load Balancer]
       ├─── /api/v1/* ────> [Cloud Run: Backend (NestJS)]
       └─── /*         ────> [Cloud Run: Frontend (Next.js 15)]
                                      │
               ┌──────────────────────┼──────────────────────┐
               ▼                      ▼                      ▼
        [Cloud SQL PG16]      [Memorystore Redis]      [Cloud Storage]
       (pgvector enabled)     (Standard HA Cache)    (Documents & Media)
```

---

## 3. Terraform Infrastructure Provisioning

### Step 1: GCP Authentication & Project Setup
```bash
gcloud auth login
gcloud config set project your-gcp-project-id
```

### Step 2: Configure Terraform Variables
Create `terraform/terraform.tfvars`:
```hcl
project_id     = "konnector-ai-production"
region         = "us-central1"
db_password    = "YourHighEntropyPasswordHere!"
gemini_api_key = "AIzaSyYourActualGoogleGeminiKey"
whatsapp_token = "EAAG_your_meta_permanent_system_user_token"
domain_name    = "konnector.ai"
```

### Step 3: Run Terraform
```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
```

---

## 4. Meta WhatsApp Cloud API Configuration

1. Log in to [Meta Developers Portal](https://developers.facebook.com/).
2. Create an App of type **Business** and select **WhatsApp**.
3. Under **WhatsApp > Configuration**:
   - **Callback URL:** `https://api.yourdomain.com/api/v1/whatsapp/webhook`
   - **Verify Token:** `konnector_secure_verify_token_2026`
   - Click **Verify and Save**.
4. Under **Webhook fields**, subscribe to:
   - `messages` (Inbound customer messages, audio notes, images)
   - `message_template_status_update`
5. Note down your:
   - **Phone Number ID** (e.g. `108492039485721`)
   - **WhatsApp Business Account (WABA) ID**
   - **Permanent System User Access Token**

---

## 5. Continuous Deployment with Google Cloud Build

Trigger deployments automatically on push to the `main` branch:
```bash
gcloud builds submit --config=cloudbuild.yaml .
```

---

## 6. Disaster Recovery & Backups

1. **Cloud SQL PostgreSQL:** Point-in-time recovery (PITR) enabled with 7-day automated backups.
2. **Cloud Storage:** Bucket object versioning is enabled to prevent accidental document loss.
3. **Health Check Endpoint:** `GET /api/v1/super-admin/health` continuously monitors Cloud SQL, Redis, Gemini AI, and Meta WhatsApp uptime.
