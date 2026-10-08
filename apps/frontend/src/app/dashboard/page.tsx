'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CalendarCheck,
  Zap,
  TrendingUp,
  MessageSquare,
  Clock,
  HeartHandshake,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  Bot,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { fetchWithAuth } from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await fetchWithAuth('/analytics/dashboard');
      setData(res);
      setLoading(false);
    }
    loadData();
  }, []);

  const kpis = data?.kpis || {
    totalConversations: 940,
    leadsCaptured: 420,
    leadsQualified: 288,
    appointmentsBooked: 190,
    conversionRate: '68.5%',
    aiResolutionRate: '94.2%',
    averageResponseTime: '1.8s',
    estimatedPipelineValue: '$432,000',
    csatScore: '4.8 / 5.0',
  };

  const trends = data?.monthlyTrends || [
    { month: 'May', conversations: 120, leads: 45, appointments: 18 },
    { month: 'Jun', conversations: 240, leads: 92, appointments: 35 },
    { month: 'Jul', conversations: 410, leads: 168, appointments: 72 },
    { month: 'Aug', conversations: 580, leads: 240, appointments: 104 },
    { month: 'Sep', conversations: 790, leads: 310, appointments: 145 },
    { month: 'Oct', conversations: 940, leads: 420, appointments: 190 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive ROI & Operations Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time performance metrics for your digital workforce on WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/inbox"
            className="px-4 py-2 rounded-xl bg-whatsapp-light/10 text-whatsapp-teal border border-whatsapp-light/30 text-xs font-semibold flex items-center gap-2 hover:bg-whatsapp-light/20 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-whatsapp-light" />
            <span>Open WhatsApp Inbox</span>
          </Link>

          <Link
            href="/employees"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Configure AI Employees</span>
          </Link>
        </div>
      </div>

      {/* KPI 8-Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: AI Resolution Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">AI Resolution Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{kpis.aiResolutionRate}</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>94% handled with 0 human effort</span>
          </div>
        </div>

        {/* KPI 2: Leads Captured & Qualified */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Leads Qualified</span>
            <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{kpis.leadsQualified}</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Out of {kpis.leadsCaptured} total inbound inquiries
          </div>
        </div>

        {/* KPI 3: Appointments Booked */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Appointments Booked</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{kpis.appointmentsBooked}</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>Conversion rate: {kpis.conversionRate}</span>
          </div>
        </div>

        {/* KPI 4: Pipeline Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pipeline Attribution</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{kpis.estimatedPipelineValue}</div>
          <div className="mt-1 text-[11px] text-slate-500">
            From qualified student & buyer leads
          </div>
        </div>

        {/* KPI 5: Average Response Speed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Avg Response Speed</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{kpis.averageResponseTime}</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            99.4% within 2.5s SLA
          </div>
        </div>

        {/* KPI 6: Total Conversations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Conversations</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{kpis.totalConversations}</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Across WhatsApp Cloud API
          </div>
        </div>

        {/* KPI 7: Customer Satisfaction */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">CSAT Score</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{kpis.csatScore}</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            96% positive/neutral sentiment
          </div>
        </div>

        {/* KPI 8: Active Employees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">AI Employees Active</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">2 Live</div>
          <div className="mt-1 text-[11px] text-slate-500">
            Maya (Admissions) & Dr. Chloe AI
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Conversation & Lead Growth</h3>
              <p className="text-xs text-slate-500">WhatsApp volume progression over the last 6 months</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
              Last 6 Months
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F52BA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0F52BA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#25D366" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Area type="monotone" dataKey="conversations" stroke="#0F52BA" strokeWidth={2} fillOpacity={1} fill="url(#convGrad)" name="Conversations" />
                <Area type="monotone" dataKey="leads" stroke="#25D366" strokeWidth={2} fillOpacity={1} fill="url(#leadGrad)" name="Leads" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Lead Conversion Pipeline</h3>
            <p className="text-xs text-slate-500">Autonomous WhatsApp journey</p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Total Conversations</span>
                <span className="text-slate-900 font-bold">940 (100%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-brand-600 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Qualified Inquiries</span>
                <span className="text-slate-900 font-bold">288 (30.6%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full w-[30.6%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Appointments / Tours Booked</span>
                <span className="text-slate-900 font-bold">190 (20.2%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-whatsapp-light rounded-full w-[20.2%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Human Escalation Needed</span>
                <span className="text-slate-900 font-bold">54 (5.8%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[5.8%]" />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mt-4 leading-relaxed">
            🚀 <strong>ROI Impact:</strong> 94.2% of interactions resolved autonomously saves approximately <strong>115 staff hours/month</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
