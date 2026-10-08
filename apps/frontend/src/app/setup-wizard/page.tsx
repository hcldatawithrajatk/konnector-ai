'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wand2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  Bot,
  BookOpen,
  Send,
  Sparkles,
  Building2,
  GraduationCap,
  Stethoscope,
  Briefcase,
} from 'lucide-react';

export default function SetupWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [industry, setIndustry] = useState('schools');
  const [employeeName, setEmployeeName] = useState('Maya');
  const [phoneId, setPhoneId] = useState('108492039485721');
  const [displayPhone, setDisplayPhone] = useState('+1 (555) 019-2831');
  const [faqs, setFaqs] = useState([
    { q: 'What is the annual tuition fee?', a: 'Tuition fees are $12,500 annually, payable in 3 quarterly installments.' },
    { q: 'What are the school timings?', a: 'Monday to Friday, 8:15 AM to 3:15 PM with sports clubs till 4:45 PM.' },
  ]);
  const [testChatMessages, setTestChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am Maya, your AI Admissions Officer on WhatsApp. How can I assist you today?' },
  ]);
  const [userQuery, setUserQuery] = useState('');

  const handleSendMessage = () => {
    if (!userQuery.trim()) return;
    const msg = userQuery;
    setTestChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: msg },
      {
        sender: 'ai',
        text: `Based on GreenField Academy's verified knowledge base: Annual tuition is $12,500 payable in 3 installments. Would you like me to reserve a family campus tour for Liam this Saturday at 10:00 AM?`,
      },
    ]);
    setUserQuery('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Wizard Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Zero-Code Setup Wizard</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Deploy Your AI Employee in 4 Steps</h1>
          <p className="text-sm text-slate-500">Go live on WhatsApp with enterprise AI in under 5 minutes.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${
                currentStep === step
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : currentStep > step
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Connect WhatsApp */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-whatsapp-light/10 text-whatsapp-teal flex items-center justify-center">
              <Phone className="w-5 h-5 text-whatsapp-light" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Connect WhatsApp Cloud API</h2>
              <p className="text-xs text-slate-500">Link your official Meta Business Account or use our instant sandbox phone number.</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Display Phone Number
              </label>
              <input
                type="text"
                value={displayPhone}
                onChange={(e) => setDisplayPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number ID (Meta Graph)
                </label>
                <input
                  type="text"
                  value={phoneId}
                  onChange={(e) => setPhoneId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  WABA ID (WhatsApp Business Account)
                </label>
                <input
                  type="text"
                  defaultValue="WABA_EDU_9921"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Meta Webhook URL verified: <strong>https://api.konnector.ai/v1/whatsapp/webhook</strong></span>
              </div>
              <span className="font-semibold text-emerald-700">Online & Verified</span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center gap-2"
            >
              <span>Continue to Step 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Choose Industry Pack */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Select Industry Solution Pack</h2>
              <p className="text-xs text-slate-500">Pick a pre-configured AI Employee archetype tailored for your vertical.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            {/* School */}
            <div
              onClick={() => {
                setIndustry('schools');
                setEmployeeName('Maya');
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                industry === 'schools'
                  ? 'border-brand-600 bg-brand-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <GraduationCap className="w-8 h-8 text-brand-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm">School Admissions</h3>
              <p className="text-xs text-slate-600 mt-1">Admissions Officer (Maya). Curriculum, fee plans, tour bookings.</p>
            </div>

            {/* Healthcare */}
            <div
              onClick={() => {
                setIndustry('healthcare');
                setEmployeeName('Dr. Chloe AI');
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                industry === 'healthcare'
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Stethoscope className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm">Healthcare Clinic</h3>
              <p className="text-xs text-slate-600 mt-1">Patient Coordinator (Dr. Chloe AI). Consultations, doctor availability.</p>
            </div>

            {/* Real Estate */}
            <div
              onClick={() => {
                setIndustry('real-estate');
                setEmployeeName('Alex');
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                industry === 'real-estate'
                  ? 'border-amber-600 bg-amber-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Building2 className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="font-bold text-slate-900 text-sm">Real Estate Agency</h3>
              <p className="text-xs text-slate-600 mt-1">Property SDR (Alex). Budget qualification, floor plans, site visits.</p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center gap-2"
            >
              <span>Continue to Step 3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Knowledge Base & FAQs */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Upload Knowledge Base & FAQs</h2>
              <p className="text-xs text-slate-500">Provide facts so your AI employee never hallucinates.</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <p className="text-sm font-semibold text-slate-700">Drop PDF, DOCX, TXT or CSV files here</p>
              <p className="text-xs text-slate-400 mt-1">Automatic semantic chunking & Vertex AI embedding generation</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pre-loaded FAQs</h4>
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <p className="font-semibold text-slate-800">Q: {faq.q}</p>
                  <p className="text-slate-600">A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center gap-2"
            >
              <span>Deploy & Test</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Live Test Chat Sandbox */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 4: AI Employee Deployed & Ready!</h2>
                <p className="text-xs text-slate-500">Test how {employeeName} responds to customer queries in real-time.</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Live on WhatsApp
            </span>
          </div>

          {/* Interactive Chat Sandbox */}
          <div className="rounded-2xl border border-slate-200 bg-[#EFEAE2] overflow-hidden shadow-inner flex flex-col h-96">
            <div className="bg-[#075E54] text-white p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white text-slate-800 font-bold flex items-center justify-center text-xs">
                {employeeName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{employeeName}</p>
                <p className="text-[10px] text-emerald-200 leading-tight">Digital Employee • Online</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {testChatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 shadow-sm leading-relaxed ${
                      m.sender === 'user' ? 'bg-[#DCF8C6] text-slate-900' : 'bg-white text-slate-900'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about fees, timings, or book a visit..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 text-xs rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-whatsapp-light bg-white"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 rounded-full bg-[#075E54] hover:bg-[#128C7E] text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center gap-2"
            >
              <span>Go to Executive Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
