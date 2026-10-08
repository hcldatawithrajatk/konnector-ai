'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Download,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [selectedGateway, setSelectedGateway] = useState<'STRIPE' | 'RAZORPAY'>('STRIPE');

  const plans = [
    {
      id: 'STARTER',
      name: 'Starter Plan',
      description: 'Ideal for small schools and boutique medical clinics starting with AI.',
      monthlyPrice: 49,
      annualPrice: 39,
      conversations: '1,000 WhatsApp conversations / mo',
      employees: '2 AI Employees',
      team: '5 Team Members',
      features: [
        'WhatsApp Cloud API Integration',
        'Gemini 2.5 Flash Engine',
        'Lead CRM & Scoring',
        'Google Calendar Integration',
        'Standard Email Support',
      ],
      current: false,
    },
    {
      id: 'GROWTH',
      name: 'Growth Plan',
      description: 'For growing academies, multi-specialty clinics, and high-volume real estate brokers.',
      monthlyPrice: 149,
      annualPrice: 119,
      conversations: '5,000 WhatsApp conversations / mo',
      employees: '5 AI Employees',
      team: '15 Team Members',
      features: [
        'Everything in Starter',
        'Gemini 2.5 Pro Hybrid Reasoning',
        'Automated Follow-Up Sequences (Day 1/3/7/14)',
        'Human Handoff & Live Takeover Console',
        'Voice Message & Image Understanding',
        'Priority SLA Support',
      ],
      current: true,
      popular: true,
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise Plan',
      description: 'For large school chains, hospital networks, and national brokerage agencies.',
      monthlyPrice: 399,
      annualPrice: 319,
      conversations: '25,000 WhatsApp conversations / mo',
      employees: '20 AI Employees',
      team: '50 Team Members',
      features: [
        'Everything in Growth',
        'Custom Brand & White-Label Domain',
        'Custom RAG Vector Engine & Fine-tuning',
        'Dedicated Technical Account Manager',
        'SOC2 & HIPAA Compliance Guarantee',
        '99.9% Uptime SLA',
      ],
      current: false,
    },
  ];

  const invoices = [
    {
      id: 'INV-2026-918231',
      date: 'Oct 01, 2026',
      amount: '$149.00',
      gst: '$26.82 (18% GST)',
      gateway: 'Stripe',
      status: 'PAID',
    },
    {
      id: 'INV-2026-817294',
      date: 'Sep 01, 2026',
      amount: '$149.00',
      gst: '$26.82 (18% GST)',
      gateway: 'Stripe',
      status: 'PAID',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Subscription & Invoicing</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Plans & Billing</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your subscription tier, payment gateways, and download tax invoices.
          </p>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              billingCycle === 'MONTHLY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('YEARLY')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              billingCycle === 'YEARLY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const price = billingCycle === 'YEARLY' ? p.annualPrice : p.monthlyPrice;

          return (
            <div
              key={p.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                p.popular
                  ? 'bg-slate-900 text-white shadow-xl ring-2 ring-brand-500 relative'
                  : 'bg-white text-slate-900 border border-slate-200/80 shadow-sm'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-500 text-white font-bold text-[10px] tracking-wider uppercase shadow-sm">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-base">{p.name}</h3>
                  <p className={`text-xs mt-1 ${p.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                    {p.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold">${price}</span>
                  <span className={`text-xs ${p.popular ? 'text-slate-400' : 'text-slate-500'}`}>/ month</span>
                </div>

                <div className={`p-3 rounded-xl text-xs space-y-1 ${p.popular ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className="font-semibold">{p.conversations}</p>
                  <p>{p.employees} • {p.team}</p>
                </div>

                <ul className="space-y-2 text-xs pt-2">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${p.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span className={p.popular ? 'text-slate-200' : 'text-slate-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/20">
                {p.current ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-center font-bold text-xs">
                    Current Active Plan
                  </div>
                ) : (
                  <button
                    onClick={() => alert(`Upgrading to ${p.name} via ${selectedGateway}`)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                      p.popular
                        ? 'bg-brand-500 hover:bg-brand-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    Upgrade Plan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoices History Table */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Billing History & GST Invoices</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Invoice Number</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">GST Details</th>
                <th className="pb-3">Gateway</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="text-slate-700">
                  <td className="py-3 font-mono font-medium text-slate-900">{inv.id}</td>
                  <td className="py-3">{inv.date}</td>
                  <td className="py-3 font-bold text-slate-900">{inv.amount}</td>
                  <td className="py-3 text-slate-500">{inv.gst}</td>
                  <td className="py-3">{inv.gateway}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => alert(`Downloading PDF invoice ${inv.id}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
