import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  Database,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { resetSampleDocs } from '../api/client.js';

interface SettingsViewProps {
  onRefreshData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onRefreshData }) => {
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = async () => {
    setResetting(true);
    setMessage(null);
    try {
      await resetSampleDocs();
      setMessage('Sample documents verified and re-indexed successfully.');
      onRefreshData();
    } catch {
      setMessage('Failed to re-index sample documents.');
    } finally {
      setResetting(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192A43] tracking-tight">
          System Settings & AI Diagnostics
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Inspect model configuration, vector retrieval pipeline status, and database diagnostics.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          {message}
        </div>
      )}

      {/* Model & AI Settings Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7657D5] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#192A43]">Active AI Models</h3>
            <p className="text-xs text-slate-400">Server-side managed via Google AI Studio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Generation Model</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-sm text-[#192A43]">Gemini 3.8 Flash</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Active
              </span>
            </div>
            <p className="mt-2 text-slate-500 text-[11px]">
              High-throughput multimodal model powering grounded Q&A, executive summaries, and structured flashcards.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vector Embedding Model</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-sm text-[#192A43]">gemini-embedding-2-preview</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                Active
              </span>
            </div>
            <p className="mt-2 text-slate-500 text-[11px]">
              Dense semantic embedding model generating high-dimensional vectors for chunk retrieval.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/60 text-xs text-slate-600 space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-[#192A43]">
            <ShieldCheck className="w-4 h-4 text-[#4779E8]" />
            <span>Server-Side Security Model</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            All AI operations run strictly through backend proxy endpoints (<code className="bg-white px-1 py-0.5 rounded text-[#4779E8] font-mono">/api/chat</code>, <code className="bg-white px-1 py-0.5 rounded text-[#4779E8] font-mono">/api/summary</code>, <code className="bg-white px-1 py-0.5 rounded text-[#4779E8] font-mono">/api/flashcards</code>). API keys are never exposed in browser bundles.
          </p>
        </div>
      </div>

      {/* Storage and Reset Diagnostics */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4779E8] flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#192A43]">Data Storage & Indexing</h3>
            <p className="text-xs text-slate-400">File-backed persistence</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-slate-200">
            <span>Persistent Document Store</span>
            <span className="font-mono text-slate-700 font-semibold">data/documents.json</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-slate-200">
            <span>Summary & Synthesis Archive</span>
            <span className="font-mono text-slate-700 font-semibold">data/summaries.json</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-slate-200">
            <span>Educational Flashcard Sets</span>
            <span className="font-mono text-slate-700 font-semibold">data/flashcards.json</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-[#192A43]">Sample Research Papers</h4>
            <p className="text-[11px] text-slate-400">Restore or re-index built-in sample papers</p>
          </div>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting...' : 'Re-verify Samples'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
