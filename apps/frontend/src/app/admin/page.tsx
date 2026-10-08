'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Server,
  Building,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Users,
} from 'lucide-react';

export default function SuperAdminPage() {
  const [tenants, setTenants] = useState([
    {
      id: 'org-greenfield',
      name: 'GreenField International Academy',
      industry: 'Schools & Higher Education',
      plan: 'GROWTH ($149/mo)',
      phone: '+1 (555) 019-2831',
      status: 'ACTIVE',
      leads: 420,
      conversations: 940,
    },
    {
      id: 'org-apex',
      name: 'Apex Multi-Specialty Clinic',
      industry: 'Healthcare Providers',
      plan: 'GROWTH ($149/mo)',
      phone: '+1 (555) 302-8812',
      status: 'ACTIVE',
      leads: 310,
      conversations: 680,
    },
    {
      id: 'org-prestige',
      name: 'Prestige Realty Group',
      industry: 'Real Estate Agencies',
      plan: 'ENTERPRISE ($399/mo)',
      phone: '+1 (555) 441-9920',
      status: 'ACTIVE',
      leads: 560,
      conversations: 1240,
    },
  ]);

  const toggleTenantStatus = (id: string) => {
    setTenants(
      tenants.map((t) =>
        t.id === id ? { ...t, status: t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : t,
      ),
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-2 border border-brand-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Master Platform Control</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Super Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Global tenant oversight, platform infrastructure health, and aggregated usage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All GCP Services Operational
          </span>
        </div>
      </div>

      {/* Infrastructure Health Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Server className="w-4 h-4 text-brand-600" />
          <span>Google Cloud Platform & AI Infrastructure Health</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">PostgreSQL (Cloud SQL)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-bold text-slate-900">Online (pgvector)</p>
            <p className="text-[10px] text-slate-400">us-central1-a</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Memorystore Redis</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-bold text-slate-900">Online (Caching)</p>
            <p className="text-[10px] text-slate-400">1.2 GB / 5 GB</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Vertex AI Gemini</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-bold text-slate-900">Gemini 2.5 Pro & Flash</p>
            <p className="text-[10px] text-slate-400">Lat: 1.8s</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">WhatsApp Cloud API</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-bold text-slate-900">Meta Graph v21.0</p>
            <p className="text-[10px] text-slate-400">Webhooks 100% SLA</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">GCP Cloud Run</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-bold text-slate-900">Auto-Scaling 1-100</p>
            <p className="text-[10px] text-slate-400">CPU 14%</p>
          </div>
        </div>
      </div>

      {/* Master Tenants Table */}
      <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Tenant Organizations ({tenants.length})</h3>
          <span className="text-xs text-slate-500">Platform Scale: 10,000 Org Architecture</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Organization</th>
                <th className="pb-3">Vertical Industry</th>
                <th className="pb-3">Active Plan</th>
                <th className="pb-3">WhatsApp Number</th>
                <th className="pb-3">Total Leads</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((t) => (
                <tr key={t.id} className="text-slate-700">
                  <td className="py-3 font-semibold text-slate-900">{t.name}</td>
                  <td className="py-3 text-slate-500">{t.industry}</td>
                  <td className="py-3 font-medium text-brand-600">{t.plan}</td>
                  <td className="py-3 font-mono text-slate-600">{t.phone}</td>
                  <td className="py-3 font-bold text-slate-900">{t.leads}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => toggleTenantStatus(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        t.status === 'ACTIVE'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {t.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
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
