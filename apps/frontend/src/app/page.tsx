'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  Bot,
  GraduationCap,
  Stethoscope,
  Building2,
  ShieldCheck,
  Zap,
  CalendarCheck,
  GitFork,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center py-10 relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white p-8 lg:p-14 shadow-2xl border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-whatsapp-light/10 text-whatsapp-light border border-whatsapp-light/30 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Next-Generation Digital Workforce on WhatsApp</span>
        </div>

        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Stop using chatbots. <br />
          Hire <span className="bg-gradient-to-r from-brand-400 via-whatsapp-light to-emerald-400 bg-clip-text text-transparent">AI Employees</span> on WhatsApp.
        </h1>

        <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Konnector AI deploys autonomous digital staff that answer customer inquiries, qualify leads, schedule appointments, handle voice notes, and nurture pipelines 24/7 on WhatsApp.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/setup-wizard"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-whatsapp-dark to-whatsapp-light hover:from-whatsapp-teal hover:to-whatsapp-dark text-white font-semibold text-sm shadow-lg shadow-whatsapp-light/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Launch Tenant Setup Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-brand-400" />
            <span>Open Executive ROI Dashboard</span>
          </Link>

          <Link
            href="/inbox"
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-whatsapp-light" />
            <span>Live WhatsApp Inbox</span>
          </Link>
        </div>

        {/* Live Metrics Proof */}
        <div className="mt-12 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-white">94.2%</div>
            <div className="text-xs text-slate-400 mt-1">Autonomous Resolution</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-whatsapp-light">&lt; 2.0s</div>
            <div className="text-xs text-slate-400 mt-1">Average Response Speed</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-brand-400">10,000+</div>
            <div className="text-xs text-slate-400 mt-1">Multi-Tenant Scale</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-400">SOC2 Ready</div>
            <div className="text-xs text-slate-400 mt-1">GCP Cloud SQL & Armor</div>
          </div>
        </div>
      </section>

      {/* Primary Customer Industry Packs */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Primary Industry Solutions</h2>
            <p className="text-sm text-slate-500">Pre-built AI digital employees trained for specific business verticals.</p>
          </div>
          <Link href="/setup-wizard" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            <span>Install Pack</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pack 1: Schools */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Schools & Universities</span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">Admissions Officer (Maya)</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Handles parent tuition inquiries, curriculum comparisons (IB/Cambridge), document checklists, and campus tour bookings.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Automated Campus Visit Scheduling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>14-Day WhatsApp Parent Nurture Flow</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Scholarship & Fee Calculation</span>
              </li>
            </ul>
          </div>

          {/* Pack 2: Healthcare */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Healthcare Providers</span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">Appointment Coordinator (Dr. Chloe AI)</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Coordinates specialist doctor slots, delivers fasting preparation instructions, and sends consultation reminders.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Doctor Availability & Triage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Emergency Symptom Red-Flagging</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Lab Test Fasting Guidelines</span>
              </li>
            </ul>
          </div>

          {/* Pack 3: Real Estate */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Real Estate Agencies</span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">Property Sales SDR (Alex)</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Captures buyer budget, desired BHK, and purchase timeline. Sends floor plans and books VIP on-site walkthroughs.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>VIP Site Visit Booking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant Digital Brochure Dispatch</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Lead Scoring (0-100 Algorithm)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities Grid */}
      <section className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Architecture & Features</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <Bot className="w-5 h-5 text-brand-600 mb-2" />
            <h4 className="font-semibold text-slate-900 text-sm">Gemini 2.5 Pro & Flash</h4>
            <p className="text-xs text-slate-500 mt-1">Multi-turn memory, entity extraction, sentiment detection, and prompt injection defense.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <Zap className="w-5 h-5 text-whatsapp-light mb-2" />
            <h4 className="font-semibold text-slate-900 text-sm">WhatsApp Cloud API</h4>
            <p className="text-xs text-slate-500 mt-1">Official Meta Graph API v21.0 integration with audio transcription and vision understanding.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <GitFork className="w-5 h-5 text-purple-600 mb-2" />
            <h4 className="font-semibold text-slate-900 text-sm">No-Code Follow-Up Engine</h4>
            <p className="text-xs text-slate-500 mt-1">Day 1, 3, 7, 14 nurture flows with automatic pause on customer reply or appointment booking.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
            <h4 className="font-semibold text-slate-900 text-sm">Multi-Tenant Isolation</h4>
            <p className="text-xs text-slate-500 mt-1">PostgreSQL Cloud SQL with pgvector, RBAC permissions, and Google Cloud Armor defense.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
