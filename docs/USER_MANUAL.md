# Konnector AI - Business Owner User Manual

Welcome to **Konnector AI: Your Digital Workforce on WhatsApp**. This manual explains how non-technical business owners (Schools, Healthcare Providers, Real Estate Agencies, and SMEs) can deploy and operate AI Employees without writing code.

---

## 1. Quick Onboarding: The 4-Step Setup Wizard

Navigate to `http://localhost:3000/setup-wizard`:
1. **Connect WhatsApp Cloud API:** Enter your Meta Phone Number ID and WABA ID. Konnector automatically verifies your webhook.
2. **Select Industry Solution Pack:**
   - **Schools:** Installs Admissions Officer (Maya).
   - **Healthcare:** Installs Patient Coordinator (Dr. Chloe AI).
   - **Real Estate:** Installs Property SDR (Alex).
3. **Upload Knowledge Base & FAQs:** Drop your institution prospectus, fee structure PDF, or type your top 5 customer questions.
4. **Deploy & Test Chat:** Chat with your digital employee directly in the interactive sandbox to verify responses before opening to real customers.

---

## 2. Managing Your AI Employees

Navigate to **AI Employee Studio** (`/employees`):
- **Personality & Tone:** Adjust how formal, warm, or academic your employee sounds.
- **Confidence Threshold:** Set the confidence bar (default: 75%). Any customer query the AI is unsure of will instantly escalate to a human.
- **Business Hours & Out-of-Hours Auto-Responder:** Configure your physical working hours while enabling 24/7 lead capture.

---

## 3. WhatsApp Live Inbox & Human Takeover

Navigate to **WhatsApp Live Inbox** (`/inbox`):
- **Green Badge ("AI Active"):** Your AI Employee is answering customer inquiries autonomously.
- **Amber Badge ("Human Takeover"):** A human team member has intervened.
- **Take Over Chat:** Click **"Take Over Chat"** to pause the AI and send manual messages.
- **Gemini Suggested Replies:** Click any suggested response to pre-fill your message composer with high-quality answers.
- **Return to AI:** Click **"Return to AI"** to hand conversation control back to your digital employee.

---

## 4. CRM Pipeline & Appointment Booking

- **Leads Board (`/leads`):** View inbound leads categorized into `New`, `Contacted`, `Qualified`, `Appointment Scheduled`, and `Won`.
- **Lead Scoring (0-100):** Understand customer purchase intent based on responses to key qualification questions.
- **Calendar (`/calendar`):** View campus walkthroughs, clinic appointments, or site visits booked autonomously and synced to Google Calendar.

---

## 5. Automated Follow-Up Sequences

Navigate to **Follow-Up Sequences** (`/sequences`):
- Pre-built flows nurture leads at **Day 1, Day 3, Day 7, and Day 14**.
- **Auto-Stop Safety:** If a customer replies on WhatsApp or books an appointment, all automated follow-up sequences halt immediately to prevent awkward redundant messages.
