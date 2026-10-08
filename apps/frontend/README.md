# Konnector AI - Frontend SaaS Application

The frontend of Konnector AI is built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, **Lucide Icons**, **Zustand**, and **Recharts**.

---

## Core Pages & Features
- `/setup-wizard`: 4-step onboarding wizard with live interactive WhatsApp chat sandbox.
- `/dashboard`: Executive ROI analytics with 8 KPI cards, Recharts growth trends, and conversion funnels.
- `/employees`: AI Employee Studio (Archetypes, tone sliders, confidence thresholds, business hours).
- `/inbox`: WhatsApp Live Omnichannel Inbox with AI/Human takeover toggle and suggested responses.
- `/leads`: CRM Kanban pipeline (stages, 0-100 scoring, timeline logs).
- `/calendar`: Appointment scheduler with Google Calendar sync indicator.
- `/sequences`: No-code 14-day WhatsApp follow-up sequence builder.
- `/knowledge-base`: Multi-format document ingestion (PDF, DOCX, CSV, URLs) and vector retrieval tester.
- `/billing`: Subscription catalog (Starter, Growth, Enterprise) with Stripe & Razorpay checkout.
- `/settings`: WhatsApp Cloud API webhook credentials, team RBAC, and white-labeling.
- `/admin`: Super Admin platform directory and GCP infrastructure health checks.

---

## Scripts
```bash
# Install dependencies
npm ci

# Run development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm start
```
