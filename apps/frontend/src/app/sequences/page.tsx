'use client';

import React, { useState } from 'react';
import {
  GitFork,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function SequencesPage() {
  const [sequences, setSequences] = useState([
    {
      id: 'seq-1',
      name: 'Prospective Parent 14-Day Nurture Flow',
      trigger: 'When Lead is Created via WhatsApp',
      stopOnReply: true,
      stopOnBooking: true,
      activeEnrolled: 84,
      convertedCount: 42,
      steps: [
        {
          order: 1,
          delay: 'Day 1 (24 Hours After Inquiry)',
          template:
            'Hi {{name}}! Thank you for connecting with GreenField International. Here is a quick video tour of our campus: https://youtu.be/campus-tour. Would you like to schedule a visit this week?',
        },
        {
          order: 2,
          delay: 'Day 3 (72 Hours After Inquiry)',
          template:
            'Hello {{name}}, our admissions team prepared an overview of our Cambridge & IB curriculum tracks. What grade is {{studentName}} entering so I can share specific subject lists?',
        },
        {
          order: 3,
          delay: 'Day 7 (1 Week After Inquiry)',
          template:
            'Good morning! Term 1 admissions for Cambridge Grade 6 are now 80% filled. We would love to hold a priority assessment slot for your family if you are still looking.',
        },
        {
          order: 4,
          delay: 'Day 14 (Final Follow-Up & Escalation)',
          template:
            'Hi {{name}}, I will close your inquiry ticket for now so we do not bother you. You can message me here anytime 24/7 if you would like to resume!',
        },
      ],
    },
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <GitFork className="w-3.5 h-3.5" />
            <span>Automated Follow-Up Sequences</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">No-Code WhatsApp Nurture Flows</h1>
          <p className="text-xs text-slate-500 mt-1">
            Re-engage cold leads automatically over WhatsApp without any manual outreach.
          </p>
        </div>

        <button
          onClick={() => alert('New sequence builder modal')}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Sequence</span>
        </button>
      </div>

      {/* Sequence Timeline */}
      {sequences.map((seq) => (
        <div
          key={seq.id}
          className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{seq.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Trigger: <strong>{seq.trigger}</strong></p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stop on Customer Reply</span>
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Stop on Appointment Booked</span>
              </span>
            </div>
          </div>

          {/* Steps Timeline Grid */}
          <div className="relative pl-6 border-l-2 border-brand-200 space-y-8">
            {seq.steps.map((step) => (
              <div key={step.order} className="relative space-y-2">
                {/* Node dot */}
                <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-brand-600 text-white font-bold text-[10px] flex items-center justify-center ring-4 ring-brand-100">
                  {step.order}
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-800">{step.delay}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 max-w-3xl">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-whatsapp-teal mb-1">
                    <MessageSquare className="w-3 h-3 text-whatsapp-light" />
                    <span>WhatsApp Message Template</span>
                  </div>
                  <p className="text-xs text-slate-700 font-sans leading-relaxed">
                    {step.template}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Metrics Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Enrolled Leads: <strong>{seq.activeEnrolled} active</strong></span>
            <span>Converted to Tour/Meeting: <strong className="text-emerald-600">{seq.convertedCount} (50.0%)</strong></span>
          </div>
        </div>
      ))}
    </div>
  );
}
