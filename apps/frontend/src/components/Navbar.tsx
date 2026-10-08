'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Search, ExternalLink, HelpCircle, PhoneCall } from 'lucide-react';

export function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search leads, phone numbers, knowledge articles..."
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-700"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* WhatsApp Test Callout */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-whatsapp-light/10 text-whatsapp-teal border border-whatsapp-light/30 text-xs font-semibold">
          <PhoneCall className="w-3.5 h-3.5 text-whatsapp-light" />
          <span>Meta Phone: +1 (555) 019-2831</span>
        </div>

        {/* API Docs link */}
        <a
          href="http://localhost:4000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-slate-600 hover:text-brand-600 flex items-center gap-1 transition-colors"
        >
          <span>Swagger API</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* User profile avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            SJ
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Sarah Jenkins</p>
            <p className="text-[10px] text-slate-500 leading-tight">Admissions Director</p>
          </div>
        </div>
      </div>
    </header>
  );
}
