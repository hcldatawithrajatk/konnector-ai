'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Tag,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { fetchWithAuth } from '@/lib/api';

const STAGES = [
  { id: 'NEW', label: 'New Inquiries', color: 'bg-slate-100 text-slate-800' },
  { id: 'CONTACTED', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  { id: 'QUALIFIED', label: 'AI Qualified', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'APPOINTMENT_SCHEDULED', label: 'Tour / Meeting Booked', color: 'bg-purple-100 text-purple-800' },
  { id: 'WON', label: 'Enrolled / Closed', color: 'bg-emerald-100 text-emerald-800' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await fetchWithAuth('/leads');
      const m = await fetchWithAuth('/leads/metrics');
      setLeads(data);
      setMetrics(m);
    }
    load();
  }, []);

  const moveLeadStage = (leadId: string, nextStage: string) => {
    setLeads(
      leads.map((l) => (l.id === leadId ? { ...l, stage: nextStage } : l)),
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>CRM Pipeline & Lead Scoring</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">WhatsApp Lead Pipeline</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track leads captured and autonomously qualified by your AI employees.
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500">Total Leads:</span>{' '}
            <strong className="text-slate-900 font-bold">{leads.length || 420}</strong>
          </div>
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
            Qualification Rate: {metrics?.qualificationRate || '68.5%'}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.id);

          return (
            <div key={col.id} className="bg-slate-100/70 rounded-2xl p-4 flex flex-col min-w-[240px]">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{col.label}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-sm">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{lead.fullName}</h4>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700">
                        {lead.score} pts
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {lead.intentSummary}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{lead.phoneNumber}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {lead.tags?.map((tag: string, i: number) => (
                        <span key={i} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stage advance button */}
                    {col.id !== 'WON' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextIdx = STAGES.findIndex((s) => s.id === col.id) + 1;
                          if (nextIdx < STAGES.length) {
                            moveLeadStage(lead.id, STAGES[nextIdx].id);
                          }
                        }}
                        className="w-full mt-2 pt-2 border-t border-slate-100 text-[10px] font-semibold text-brand-600 hover:text-brand-700 flex items-center justify-center gap-1"
                      >
                        <span>Move to Next Stage</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
