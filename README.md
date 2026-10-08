# Konnector AI

> **Your Digital Workforce on WhatsApp**  
> *Autonomous AI Employees for Schools, Healthcare Providers, Real Estate Agencies, and High-Growth SMEs.*

[![CI/CD Pipeline](https://github.com/your-org/konnector-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/konnector-ai/actions/workflows/ci.yml)
[![GCP Cloud Run](https://img.shields.io/badge/GCP-Cloud%20Run%20Deployed-4285F4?logo=googlecloud)](https://cloud.google.com/run)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![NestJS 10](https://img.shields.io/badge/NestJS-10.4-red?logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20pgvector-blue?logo=postgresql)](https://www.postgresql.org/)
[![Meta WhatsApp](https://img.shields.io/badge/WhatsApp%20Cloud%20API-v21.0-25D366?logo=whatsapp)](https://developers.facebook.com/docs/whatsapp/cloud-api)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

---

## 🌟 What is Konnector AI?

The goal of Konnector AI is **NOT** to build another chatbot platform.  
The goal is to deploy **AI Employees that perform autonomous business functions**:

| Digital Employee | Target Vertical | Core Autonomous Functions |
|---|---|---|
| **Admissions Officer (Maya)** | K-12 Schools & Universities | Answers curriculum & fee inquiries, shares document checklists, books campus tours, executes 14-day parent nurture sequences. |
| **Appointment Coordinator (Dr. Chloe AI)** | Healthcare & Medical Practices | Checks doctor availability, triages non-emergency inquiries, explains fasting/lab preparation rules, coordinates bookings. |
| **Property Sales SDR (Alex)** | Real Estate Agencies & Developers | Qualifies buyer budget, bedroom configuration, timeline, shares digital brochures, schedules VIP site walkthroughs. |
| **Collections & Customer Support** | SMEs & Professional Services | Handles invoice inquiries, payment reminders, and Tier-1 issue resolution. |

---

## 📂 Repository Structure

```
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                     # Continuous Integration: Lint, Test, Typecheck, Build
│   │   └── deploy-gcp.yml             # Continuous Deployment: Build, Push & Deploy to GCP Cloud Run
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md              # Standardized bug reporting template
│   │   └── feature_request.md         # Feature request template
│   └── pull_request_template.md       # PR checklist and verification rules
├── apps/
│   ├── backend/                       # NestJS 10 Multi-Tenant Engine
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # PostgreSQL 16 schema with 20 models & pgvector
│   │   │   └── seed.ts                # Production & demo seeder (Schools, Health, Real Estate)
│   │   ├── src/
│   │   │   ├── common/                # Guards (TenantGuard, RolesGuard), decorators, filters
│   │   │   └── modules/               # 15 domain modules (AI, WhatsApp, CRM, RAG, Billing)
│   │   ├── Dockerfile                 # Multi-stage production container build
│   │   ├── jest.config.js             # Automated unit testing configuration
│   │   └── .env.example               # Backend environment variables reference
│   └── frontend/                      # Next.js 15 App Router Frontend
│       ├── src/
│       │   ├── app/                   # Setup Wizard, ROI Dashboard, Live Inbox, CRM, Billing
│       │   ├── components/            # Sidebar, Navbar, Live chat components
│       │   └── lib/                   # API client layer with mock/offline fallback
│       ├── Dockerfile                 # Multi-stage production container build
│       └── .env.example               # Frontend environment variables reference
├── terraform/                         # Infrastructure as Code (GCP)
│   ├── main.tf                        # VPC, Cloud SQL PG16, Redis, Cloud Run, Cloud Armor
│   ├── variables.tf                   # Parameter definitions
│   ├── outputs.tf                     # Deployed URIs and connection endpoints
│   └── terraform.tfvars.example       # Example variable definitions
├── docs/                              # Comprehensive Documentation
│   ├── ARCHITECTURE.md                # System topology, sequence diagrams, isolation model
│   ├── DATABASE_SCHEMA.md             # Mermaid ER diagram and data dictionary
│   ├── DEPLOYMENT_GUIDE.md            # Production deployment walkthrough
│   ├── USER_MANUAL.md                 # Business owner zero-code operating guide
│   └── ADMIN_MANUAL.md                # Platform super admin governance guide
├── docker-compose.yml                 # Multi-container orchestration (PG, Redis, Backend, Frontend)
├── cloudbuild.yaml                    # Google Cloud Build CI/CD pipeline
├── BRANCHING_STRATEGY.md              # GitFlow, Conventional Commits & Release governance
├── CONTRIBUTING.md                    # Contributor guide and environment setup
├── LICENSE                            # Apache 2.0 Open Source Enterprise License
└── .env.example                       # Master environment configuration
```

---

## 🏗 System Architecture & Technology Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Zustand.
- **Backend:** Node.js, NestJS, TypeScript, Prisma 5 ORM, Passport JWT.
- **Database & Vectors:** PostgreSQL 16 on Cloud SQL with `pgvector` for semantic knowledge retrieval.
- **Caching & Pub/Sub:** Redis 7 on GCP Memorystore.
- **AI Reasoning:** Google Gemini 2.5 Pro & Gemini 2.5 Flash via Google GenAI SDK.
- **Messaging:** Meta WhatsApp Cloud API v21.0 (Text, Audio Notes, Images, Document checklists).
- **Infrastructure:** Google Cloud Platform (Cloud Run, Cloud Armor, Secret Manager, Cloud Storage, VPC Connector).
- **Infrastructure as Code:** Terraform v1.5+.
- **Payment Gateways:** Stripe & Razorpay (with Indian 18% GST compliance).

---

## 🧪 Automated Testing

Automated unit tests cover all mission-critical business logic without mock stubs:

```bash
# Run all unit tests in the backend:
cd apps/backend
npm run test

# Run tests with coverage reporting:
npm run test -- --coverage
```

### Verified Test Suites:
- **`ai-engine.service.spec.ts`:** Tests prompt injection defense guardrail, intent classification, sentiment analysis, and 768-dim vector embeddings.
- **`knowledge-base.service.spec.ts`:** Tests text chunking with overlap, vector cosine similarity calculation, and RAG candidate ranking.
- **`leads.service.spec.ts`:** Tests 0-100 scoring algorithm, pipeline stage transitions (`NEW` -> `WON`), and conversion rate metrics.
- **`appointments.service.spec.ts`:** Tests slot availability calculation within business hours and lead stage advancement.
- **`follow-ups.service.spec.ts`:** Tests multi-day sequence delays and automated stop conditions when leads reply or book.
- **`whatsapp.service.spec.ts`:** Tests Meta webhook verification challenge and inbound message JSON payload parsing.

---

## 🚀 Quick Start Guide

### Option 1: Docker Compose (Full Stack in 1 Command)
```bash
# 1. Clone repository
git clone https://github.com/your-org/konnector-ai.git
cd konnector-ai

# 2. Start PostgreSQL with pgvector, Redis, Backend, and Frontend
docker-compose up -d --build

# 3. Seed demo tenants (Schools, Healthcare, Real Estate)
docker-compose exec backend npm run seed
```

Access the application:
- **Frontend SaaS App:** [http://localhost:3000](http://localhost:3000)
- **Zero-Code Setup Wizard:** [http://localhost:3000/setup-wizard](http://localhost:3000/setup-wizard)
- **Executive ROI Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Interactive Swagger API Documentation:** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

### Option 2: Local Monorepo Development
```bash
# 1. Install dependencies
npm run install:all

# 2. Setup backend environment and Prisma
cd apps/backend
cp .env.example .env
npx prisma generate
npx prisma db push
npm run seed

# 3. Start Backend (Port 4000)
npm run start:dev

# 4. In a separate terminal, start Frontend (Port 3000)
cd ../frontend
npm run dev
```

---

## 🚢 Automated Deployment to GCP Cloud Run

Continuous deployment is fully automated through two native pipelines:

### 1. GitHub Actions ([`.github/workflows/deploy-gcp.yml`](./.github/workflows/deploy-gcp.yml))
Triggered automatically on every push to `main`:
1. Authenticates to Google Cloud via Workload Identity Federation / Service Account Key.
2. Builds and pushes versioned Docker container images to **Artifact Registry** (`us-central1-docker.pkg.dev`).
3. Deploys Backend to **Cloud Run** with automated Secret Manager bindings.
4. Deploys Frontend to **Cloud Run** referencing the live backend URL.
5. Performs post-deployment health check verification.

### 2. Google Cloud Build ([`cloudbuild.yaml`](./cloudbuild.yaml))
Triggered via Cloud Build GitHub App or CLI:
```bash
gcloud builds submit --config=cloudbuild.yaml
```

### 3. Terraform Infrastructure as Code ([`terraform/`](./terraform))
Provision the entire production GCP architecture in minutes:
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Update your GCP project ID and domain name
terraform init
terraform plan
terraform apply
```

---

## 🌿 Git Branching Strategy & Conventions

We follow a GitFlow-inspired model designed for zero-downtime continuous delivery.  
See [`BRANCHING_STRATEGY.md`](./BRANCHING_STRATEGY.md) for full details:

- **`main`:** Production code. Protected. Triggers automated Cloud Run deployment.
- **`develop`:** Staging / integration branch.
- **`feature/*`:** Short-lived feature branches merged via PR into `develop`.
- **`release/*`:** Release candidates with version bump.
- **`hotfix/*`:** Urgent production patches applied directly to `main` and `develop`.

---

## 🔒 Security & Compliance

- **Multi-Tenant Logical Isolation:** Tenant boundary guards on all API routes and database queries.
- **Prompt Injection Defense:** Regex and pattern analysis sanitizes jailbreak attempts before reaching Gemini.
- **Google Cloud Armor:** Rate limiting (1,000 req/min) and OWASP Top 10 mitigation.
- **Enterprise Ready:** SOC2 and HIPAA compliant architectural patterns on Google Cloud Platform.
