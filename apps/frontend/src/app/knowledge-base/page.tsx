'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Upload,
  Globe,
  Plus,
  FileText,
  Search,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';

export default function KnowledgeBasePage() {
  const [faqs, setFaqs] = useState([
    {
      id: 'faq-1',
      question: 'What are the school operating hours?',
      answer: 'Classes run Monday through Friday from 8:15 AM to 3:15 PM. Extracurricular sports continue until 4:45 PM.',
      category: 'Timings',
    },
    {
      id: 'faq-2',
      question: 'What documents are required for Grade 6 Cambridge admission?',
      answer: '1. Child birth certificate, 2. Past 2 years academic report cards, 3. Immunization record, 4. Parent ID copies.',
      category: 'Admissions',
    },
    {
      id: 'faq-3',
      question: 'What is the annual tuition fee for middle school?',
      answer: 'Tuition fees range from $12,500 to $15,000 depending on grade, payable in 3 equal quarterly installments.',
      category: 'Fees',
    },
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      title: 'GreenField_Prospectus_2026_2027.pdf',
      type: 'PDF',
      chunks: 24,
      tokens: 9600,
      status: 'INDEXED',
      updatedAt: 'Today',
    },
    {
      id: 'doc-2',
      title: 'Fee_Schedule_and_Scholarship_Policy.docx',
      type: 'DOCX',
      chunks: 8,
      tokens: 3200,
      status: 'INDEXED',
      updatedAt: 'Yesterday',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [semanticMatches, setSemanticMatches] = useState<any[]>([]);

  const handleSemanticSearch = () => {
    if (!searchQuery.trim()) return;
    setSemanticMatches([
      {
        content:
          'Tuition fees range from $12,500 to $15,000 depending on grade, payable in 3 equal quarterly installments.',
        similarity: 0.94,
        source: 'Fee_Schedule_and_Scholarship_Policy.docx (Chunk #2)',
      },
    ]);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>RAG Semantic Grounding Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Knowledge Base & Facts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload institutional handbooks and policies so your AI employees reply with 100% verified accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Vertex AI Vector Embeddings</span>
          </span>
        </div>
      </div>

      {/* Upload and Ingest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Dropzone */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-600" />
            <span>Upload Document Files</span>
          </h3>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer space-y-2">
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">Click to upload or drag and drop</p>
            <p className="text-[11px] text-slate-400">PDF, DOCX, TXT, or CSV (Max 25MB each)</p>
          </div>
        </div>

        {/* Website URL Ingest */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-600" />
            <span>Crawl Website URL</span>
          </h3>
          <p className="text-xs text-slate-500">
            Ingest FAQs directly from your official school or clinic web pages.
          </p>
          <div className="flex gap-2 pt-2">
            <input
              type="url"
              placeholder="https://greenfield.edu/admissions"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <button
              onClick={() => alert('URL crawled and ingested into vector index')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              Crawl & Sync
            </button>
          </div>
        </div>
      </div>

      {/* RAG Semantic Retrieval Tester */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Search className="w-4 h-4 text-brand-600" />
          <span>Test Vector Semantic Retrieval (RAG Grounding)</span>
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSemanticSearch()}
            placeholder="Type a test question (e.g. 'How much does tuition cost for Grade 6?')..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <button
            onClick={handleSemanticSearch}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors"
          >
            Search Chunks
          </button>
        </div>

        {semanticMatches.length > 0 && (
          <div className="space-y-2 pt-2">
            {semanticMatches.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-500 font-mono">{m.source}</span>
                  <span className="font-bold text-emerald-600">Cosine Match: {(m.similarity * 100).toFixed(1)}%</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-sans">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents & FAQs Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Indexed Documents */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Indexed Documents ({documents.length})</h3>
          <div className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-brand-600" />
                  <div>
                    <h4 className="font-semibold text-slate-900">{doc.title}</h4>
                    <p className="text-[10px] text-slate-400">{doc.chunks} chunks • {doc.tokens.toLocaleString()} tokens</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Verified FAQs ({faqs.length})</h3>
            <button
              onClick={() => alert('Add FAQ Modal')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Q: {faq.question}</span>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {faq.category}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
