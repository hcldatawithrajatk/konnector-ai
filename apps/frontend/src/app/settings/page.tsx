'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Users,
  Phone,
  Palette,
  CheckCircle2,
  Key,
  Copy,
  Plus,
} from 'lucide-react';

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);
  const [team, setTeam] = useState([
    {
      id: 'u-1',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@greenfield.edu',
      role: 'TENANT_OWNER',
      status: 'ACTIVE',
    },
    {
      id: 'u-2',
      name: 'Michael Chang',
      email: 'm.chang@greenfield.edu',
      role: 'MANAGER',
      status: 'ACTIVE',
    },
    {
      id: 'u-3',
      name: 'Priya Sharma',
      email: 'p.sharma@greenfield.edu',
      role: 'AGENT',
      status: 'ACTIVE',
    },
  ]);

  const copyWebhook = () => {
    navigator.clipboard?.writeText('https://api.konnector.ai/v1/whatsapp/webhook');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Tenant Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization & Channel Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your WhatsApp Cloud API credentials, white-label branding, and team RBAC permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: WhatsApp Cloud API & Webhook (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* WhatsApp API Configuration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-whatsapp-light" />
              <span>Meta WhatsApp Cloud API Connection</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Display Phone Number</label>
                <input
                  type="text"
                  defaultValue="+1 (555) 019-2831"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number ID</label>
                  <input
                    type="text"
                    defaultValue="108492039485721"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 font-mono text-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp Business Account (WABA) ID</label>
                  <input
                    type="text"
                    defaultValue="WABA_EDU_9921"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 font-mono text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meta Inbound Webhook URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://api.konnector.ai/v1/whatsapp/webhook"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 font-mono text-slate-500 bg-slate-50"
                  />
                  <button
                    onClick={copyWebhook}
                    className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Webhook Verify Token</label>
                <input
                  type="password"
                  defaultValue="konnector_secure_verify_token_2026"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 font-mono text-slate-700"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => alert('WhatsApp credentials updated')}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs"
              >
                Save WhatsApp Settings
              </button>
            </div>
          </div>

          {/* Team Members & RBAC */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-600" />
                  <span>Team Members & Roles</span>
                </h3>
                <p className="text-xs text-slate-500">RBAC permissions for dashboard and human handoff takeover.</p>
              </div>

              <button
                onClick={() => alert('Invite Team Member modal')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Invite Member</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {team.map((member) => (
                <div key={member.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-900">{member.name}</h4>
                    <p className="text-[11px] text-slate-400">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px]">
                      {member.role}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Custom Branding & White Label */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Palette className="w-4 h-4 text-brand-600" />
              <span>Branding & White Label</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  defaultValue="GreenField International Academy"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Custom Portal Domain</label>
                <input
                  type="text"
                  defaultValue="admissions.greenfield.edu"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Brand Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    defaultValue="#0F52BA"
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <span className="font-mono text-slate-600">#0F52BA</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-600" />
                  <span className="font-medium text-slate-700">Remove "Powered by Konnector AI" badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-600" />
                  <span className="font-medium text-slate-700">Enable custom WhatsApp welcome banner</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
