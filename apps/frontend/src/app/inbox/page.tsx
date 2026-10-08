'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  UserCheck,
  Bot,
  Zap,
  Phone,
  Clock,
  Sparkles,
  CheckCheck,
  Calendar,
  Tag,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { fetchWithAuth } from '@/lib/api';

export default function LiveInboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([
    'Hello Robert! I can definitely reserve a campus tour for your family this Saturday at 10:00 AM. May I confirm Liam\'s grade is Grade 6?',
    'Hi! Our admissions office offers multiple scholarship tracks for Cambridge students. Shall I email you the application packet?',
  ]);

  useEffect(() => {
    async function load() {
      const convs = await fetchWithAuth('/whatsapp/conversations');
      setConversations(convs);
      if (convs.length > 0) {
        setSelectedConv(convs[0]);
      }
    }
    load();
  }, []);

  const handleTakeover = () => {
    if (!selectedConv) return;
    const isCurrentlyHuman = selectedConv.status === 'HUMAN_TAKEOVER';
    const newStatus = isCurrentlyHuman ? 'ACTIVE_AI' : 'HUMAN_TAKEOVER';

    const updated = { ...selectedConv, status: newStatus };
    setSelectedConv(updated);
    setConversations(conversations.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConv) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      direction: 'OUTBOUND',
      content: replyText,
      timestamp: new Date().toISOString(),
    };

    const updatedConv = {
      ...selectedConv,
      messages: [...(selectedConv.messages || []), newMsg],
    };
    setSelectedConv(updatedConv);
    setConversations(conversations.map((c) => (c.id === updatedConv.id ? updatedConv : c)));
    setReplyText('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-4 px-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-whatsapp-light/10 text-whatsapp-teal flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-whatsapp-light" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">WhatsApp Omnichannel Inbox</h1>
            <p className="text-xs text-slate-500">Live multi-turn customer chats with AI & Human Takeover capability.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-whatsapp-light/10 text-whatsapp-teal border border-whatsapp-light/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-whatsapp-light animate-pulse" />
            Meta WhatsApp Online
          </span>
        </div>
      </div>

      {/* Main Inbox 3-Pane Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Left Pane: Conversations List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col min-h-0">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Conversations ({conversations.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;
              const isHuman = conv.status === 'HUMAN_TAKEOVER';

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-brand-50/60 border-l-4 border-brand-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{conv.contactName}</h4>
                    <span className="text-[10px] text-slate-400">10:42 AM</span>
                  </div>

                  <p className="text-xs text-slate-500 truncate mb-2">
                    {conv.messages?.[conv.messages.length - 1]?.content || conv.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono">{conv.contactPhoneNumber}</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full ${
                        isHuman
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isHuman ? 'Human Takeover' : 'AI Active'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Pane: Active WhatsApp Chat Stream (5 cols) */}
        {selectedConv ? (
          <div className="md:col-span-5 flex flex-col min-h-0 bg-[#EFEAE2]">
            {/* Chat Header */}
            <div className="p-3 px-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                  {selectedConv.contactName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">{selectedConv.contactName}</h3>
                  <p className="text-[10px] text-slate-500 font-mono">{selectedConv.contactPhoneNumber}</p>
                </div>
              </div>

              {/* Takeover Toggle Button */}
              <button
                onClick={handleTakeover}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                  selectedConv.status === 'HUMAN_TAKEOVER'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                }`}
              >
                {selectedConv.status === 'HUMAN_TAKEOVER' ? (
                  <>
                    <Bot className="w-3.5 h-3.5" />
                    <span>Return to AI</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Take Over Chat</span>
                  </>
                )}
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {selectedConv.messages?.map((msg: any, idx: number) => {
                const isOutbound = msg.direction === 'OUTBOUND';
                return (
                  <div
                    key={idx}
                    className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm space-y-1 ${
                        isOutbound
                          ? 'bg-[#DCF8C6] text-slate-900 rounded-tr-none'
                          : 'bg-white text-slate-900 rounded-tl-none'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.content}</p>
                      <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400">
                        <span>10:45 AM</span>
                        {isOutbound && <CheckCheck className="w-3 h-3 text-brand-600" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Suggested Replies Banner */}
            {suggestedReplies.length > 0 && (
              <div className="p-2.5 bg-brand-50 border-t border-brand-100 space-y-1.5">
                <div className="flex items-center gap-1 text-[10px] font-bold text-brand-800 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-brand-600" />
                  <span>Gemini Suggested Replies (Click to use)</span>
                </div>
                <div className="space-y-1">
                  {suggestedReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReplyText(reply)}
                      className="w-full text-left p-1.5 px-2 rounded-lg bg-white border border-brand-200 text-[11px] text-slate-700 hover:bg-brand-100/50 transition-colors truncate"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Composer */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                placeholder={
                  selectedConv.status === 'HUMAN_TAKEOVER'
                    ? 'Type reply as human agent...'
                    : 'AI is answering automatically (or take over)...'
                }
                className="flex-1 px-4 py-2 text-xs rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
              />
              <button
                onClick={handleSendReply}
                className="p-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : null}

        {/* Right Pane: Customer CRM & Lead Profile (3 cols) */}
        {selectedConv && (
          <div className="md:col-span-3 border-l border-slate-200 p-5 space-y-5 overflow-y-auto">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Profile</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">{selectedConv.contactName}</h3>
              <p className="text-xs text-slate-500 font-mono">{selectedConv.contactPhoneNumber}</p>
            </div>

            {/* Lead Scoring */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Lead Score</span>
                <span className="text-brand-600 font-bold">85 / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-brand-600 rounded-full w-[85%]" />
              </div>
              <p className="text-[10px] text-slate-400">High intent: Asked for Grade 6 & tour booking</p>
            </div>

            {/* Conversation Summary */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Memory & Summary</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedConv.summary}
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  Grade 6
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Tour Requested
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  High Priority
                </span>
              </div>
            </div>

            {/* Assigned Employee */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Bot className="w-4 h-4 text-brand-600" />
              <div>
                <p className="text-xs font-semibold text-slate-900">{selectedConv.employee?.name || 'Maya'}</p>
                <p className="text-[10px] text-slate-500">{selectedConv.employee?.role || 'Admissions Officer'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
