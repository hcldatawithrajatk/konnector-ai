'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Plus,
  Settings2,
  Clock,
  ShieldAlert,
  Sparkles,
  Sliders,
  CheckCircle2,
  Globe,
  Trash2,
} from 'lucide-react';
import { fetchWithAuth } from '@/lib/api';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const emps = await fetchWithAuth('/ai-employees');
      const tmpls = await fetchWithAuth('/ai-employees/templates');
      setEmployees(emps);
      setTemplates(tmpls);
      if (emps.length > 0) {
        setSelectedEmployee(emps[0]);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Digital Workforce Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Employee Studio</h1>
          <p className="text-xs text-slate-500 mt-1">
            Build, train, and deploy specialized autonomous employees for your WhatsApp numbers.
          </p>
        </div>

        <button
          onClick={() => {
            const newEmp = {
              id: `emp-${Date.now()}`,
              name: 'New AI Employee',
              role: 'Customer Support Executive',
              department: 'Support & Experience',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              voiceTone: 'Professional & Helpful',
              confidenceThreshold: 0.70,
              isActive: true,
              instructions: 'Help customers resolve inquiries and coordinate human escalation when needed.',
            };
            setEmployees([newEmp, ...employees]);
            setSelectedEmployee(newEmp);
            setIsEditing(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Hire New AI Employee</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List of Employees */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Employees ({employees.length})</h3>

          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => {
                setSelectedEmployee(emp);
                setIsEditing(false);
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedEmployee?.id === emp.id
                  ? 'border-brand-600 bg-brand-50/30 shadow-md ring-2 ring-brand-500/20'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={emp.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                  alt={emp.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{emp.name}</h4>
                    {emp.isDefault && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-600 font-medium truncate">{emp.role}</p>
                  <p className="text-[11px] text-slate-400 truncate">{emp.department}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-whatsapp-light" />
                  Active on WhatsApp
                </span>
                <span className="font-medium text-slate-700">Conf: {(emp.confidenceThreshold * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: AI Employee Configuration Studio */}
        {selectedEmployee && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <img
                  src={selectedEmployee.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                  alt={selectedEmployee.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow"
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedEmployee.name}</h2>
                  <p className="text-sm font-medium text-brand-600">{selectedEmployee.role} • {selectedEmployee.department}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Powered by Google Gemini 2.5 Flash</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Saved configuration updates for ${selectedEmployee.name}`)}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>

            {/* Prompt Instructions */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                System Instructions & Business Mission
              </label>
              <textarea
                rows={4}
                value={selectedEmployee.instructions}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, instructions: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none font-sans leading-relaxed text-slate-700"
              />
              <p className="text-[11px] text-slate-400">
                Define what this employee should achieve on WhatsApp (e.g. qualify leads, answer curriculum questions, book tours).
              </p>
            </div>

            {/* Tone & Personality Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Voice Tone & Personality
                </label>
                <input
                  type="text"
                  value={selectedEmployee.voiceTone || 'Warm & Professional'}
                  onChange={(e) =>
                    setSelectedEmployee({ ...selectedEmployee, voiceTone: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <span>Confidence Threshold</span>
                  <span className="text-brand-600 font-extrabold">
                    {Math.round((selectedEmployee.confidenceThreshold || 0.75) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.05"
                  value={selectedEmployee.confidenceThreshold || 0.75}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      confidenceThreshold: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Any answer with confidence below this threshold triggers instant escalation to a human agent.
                </p>
              </div>
            </div>

            {/* Business Hours & Escalation Rules */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Business Hours Active</span>
                </div>
                <p className="text-[11px] text-slate-500">Mon - Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM</p>
                <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  24/7 After-Hours Auto-Responder Enabled
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Escalation Rules</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Triggers human handoff on: Keywords: <code>human, complaint, agent, discount</code>
                </p>
                <span className="inline-block text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Route to: Sarah Jenkins (Director)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
