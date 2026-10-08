# Konnector AI - Platform Super Admin Manual

This manual provides operating procedures for platform operators and system administrators managing the Konnector AI multi-tenant SaaS platform.

---

## 1. Platform Super Admin Capabilities

Super Admins have access to the **Master Platform Portal** (`/admin`):
- **Tenant Directory:** View all organizations, active plan tiers, connected WhatsApp numbers, total conversations, and lead counts.
- **Tenant Lifecycle Operations:** Suspend or reactivate tenants with one click.
- **System Health Monitor:** Live telemetry across GCP Cloud SQL (PostgreSQL 16), Memorystore Redis, Gemini 2.5 Flash, WhatsApp Cloud API v21.0, and Cloud Run autoscalers.

---

## 2. Multi-Tenant Role-Based Access Control (RBAC)

Konnector AI enforces 7 hierarchical user roles:

| Role | Scope | Permissions |
|---|---|---|
| `SUPER_ADMIN` | Global Platform | Cross-tenant inspection, tenant suspension, global telemetry |
| `PARTNER_ADMIN` | Reseller / Agency | Manage child organizations under partner agency program |
| `TENANT_OWNER` | Single Organization | Billing management, team invitations, channel credentials |
| `MANAGER` | Single Organization | AI Employee configuration, knowledge base, CRM pipelines |
| `AGENT` | Single Organization | Live inbox takeover, lead updates, manual outbound chat |
| `VIEWER` | Single Organization | Read-only analytics, lead reports |

---

## 3. Subscription & Billing Operations

- **Plans Supported:**
  - `STARTER`: $49/mo (1,000 conversations, 2 AI employees)
  - `GROWTH`: $149/mo (5,000 conversations, 5 AI employees, sequences, live takeover)
  - `ENTERPRISE`: $399/mo (25,000 conversations, 20 AI employees, white label)
- **Payment Gateways:**
  - **Stripe:** Card payments, global recurring billing.
  - **Razorpay:** UPI, NetBanking, cards, and Indian GST compliant invoicing.
- **Usage Enforcement:**
  - Monthly usage records in `UsageMeter`. Automated warnings dispatched when tenants cross 80% and 100% of their conversation quotas.

---

## 4. Security & Incident Response

1. **Prompt Injection Defense:** Inbound WhatsApp messages are filtered for jailbreak patterns before passing to Gemini.
2. **Cloud Armor Defense:** WAF rules throttle malicious IPs exceeding 1,000 requests per minute with HTTP 429.
3. **Data Residency & Isolation:** All SQL queries include tenant ID filters. Cross-tenant leakage is strictly blocked by the database layer and NestJS guards.
