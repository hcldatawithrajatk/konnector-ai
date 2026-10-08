# Konnector AI - Backend Engine

The backend of Konnector AI is an enterprise-grade multi-tenant platform built on **NestJS 10**, **TypeScript**, and **Prisma 5**. It natively interfaces with **PostgreSQL 16 (pgvector)**, **Redis Memorystore**, **Google Gemini 2.5**, and the **Meta WhatsApp Cloud API (v21.0)**.

---

## Architecture Highlights
- **Multi-Tenant Logical Isolation:** All API routes enforce `TenantGuard`, resolving tenant identity from signed JWT claims or the `X-Tenant-Id` header (for Super Admins).
- **Security & Prompt Injection Guardrails:** Regex and pattern analysis sanitizes inbound messages before passing to LLM reasoning pipelines.
- **RAG Vector Engine:** Chunking engine (800 chars / 100 overlap) and 768-dimensional normalized cosine similarity retrieval.
- **Resilient AI Execution:** Graceful offline/test fallback when operating without live external API keys.

---

## Scripts & Testing
```bash
# Install dependencies
npm ci

# Validate database schema
npx prisma validate

# Run automated unit tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run local development server
npm run start:dev

# Build production distribution
npm run build
```

---

## Interactive API Docs
When running locally:
- Swagger UI: `http://localhost:4000/api/docs`
