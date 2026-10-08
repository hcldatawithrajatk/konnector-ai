'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Users,
  Calendar,
  GitFork,
  BookOpen,
  Wand2,
  CreditCard,
  Settings,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Employee Studio', href: '/employees', icon: Bot },
  { name: 'WhatsApp Live Inbox', href: '/inbox', icon: MessageSquare, badge: '2 Active' },
  { name: 'Lead CRM', href: '/leads', icon: Users },
  { name: 'Appointments', href: '/calendar', icon: Calendar },
  { name: 'Follow-Up Sequences', href: '/sequences', icon: GitFork },
  { name: 'Knowledge Base (RAG)', href: '/knowledge-base', icon: BookOpen },
  { name: 'Setup Wizard', href: '/setup-wizard', icon: Wand2, highlight: true },
  { name: 'Billing & Plans', href: '/billing', icon: CreditCard },
  { name: 'Settings & Team', href: '/settings', icon: Settings },
  { name: 'Super Admin', href: '/admin', icon: ShieldAlert },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-whatsapp-light flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              Konnector <span className="text-whatsapp-light text-xs font-semibold px-1.5 py-0.5 rounded bg-whatsapp-light/10 border border-whatsapp-light/20">AI</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Digital Workforce on WhatsApp</p>
          </div>
        </Link>
      </div>

      {/* Tenant Indicator */}
      <div className="px-6 py-3 bg-slate-800/40 border-b border-slate-800/60 flex items-center justify-between">
        <div className="truncate">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tenant Workspace</span>
          <p className="text-xs font-medium text-slate-200 truncate">GreenField International</p>
        </div>
        <span className="inline-block w-2 h-2 rounded-full bg-whatsapp-light ring-4 ring-whatsapp-light/20" title="Connected to WhatsApp Cloud API" />
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : item.highlight
                  ? 'bg-brand-950/60 text-brand-300 border border-brand-800/50 hover:bg-brand-900/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-whatsapp-light/20 text-whatsapp-light">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <span>WhatsApp Cloud API</span>
          <span className="text-whatsapp-light font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-whatsapp-light animate-pulse" />
            Online
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">v21.0 | Gemini 2.5 Flash</p>
      </div>
    </aside>
  );
}
