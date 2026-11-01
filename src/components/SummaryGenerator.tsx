import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Clock,
  Layers,
  ChevronRight,
  BookOpen,
  Zap,
  ListOrdered,
  FileCheck2,
  Loader2,
} from 'lucide-react';
import {
  generateDocumentSummary,
  fetchDocumentSummaries,
} from '../api/client.js';
import { DocumentItem, GeneratedSummary } from '../types/document.js';

interface SummaryGeneratorProps {
  document: DocumentItem;
}

export const SummaryGenerator: React.FC<SummaryGeneratorProps> = ({ document }) => {
  const [summaryType, setSummaryType] = useState<'quick' | 'detailed' | 'executive'>('executive');
  const [currentSummary, setCurrentSummary] = useState<GeneratedSummary | null>(null);
  const [history, setHistory] = useState<GeneratedSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSummaries();
  }, [document.id]);

  const loadSummaries = async () => {
    try {
      const list = await fetchDocumentSummaries(document.id);
      setHistory(list);
      if (list.length > 0) {
        setCurrentSummary(list[0]);
        setSummaryType(list[0].type);
      } else {
        setCurrentSummary(null);
      }
    } catch {
      setHistory([]);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const summary = await generateDocumentSummary(document.id, summaryType);
      setCurrentSummary(summary);
      setHistory((prev) => [summary, ...prev.filter((s) => s.id !== summary.id)]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!currentSummary) return;
    navigator.clipboard.writeText(currentSummary.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'md' | 'txt') => {
    if (!currentSummary) return;
    const blob = new Blob([currentSummary.content], {
      type: format === 'md' ? 'text/markdown' : 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.name.replace(/\.[^/.]+$/, '')}_${currentSummary.type}_summary.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header and Type Selector */}
      <div className="p-6 border-b border-slate-100 bg-[#FAF8F5]/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7657D5]">
                AI Synthesis Engine
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                Gemini 3.8 Flash
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#192A43] mt-1">Document Summarizer</h2>
            <p className="text-xs text-slate-500">
              Transform {document.pageCount} pages of "{document.name}" into structured insights.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#4779E8] to-[#7657D5] hover:opacity-95 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-[#4779E8]/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Document...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {currentSummary ? 'Regenerate Summary' : 'Generate Summary'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* 3 Summary Format Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Option A: Quick Summary */}
          <button
            onClick={() => setSummaryType('quick')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              summaryType === 'quick'
                ? 'border-[#4779E8] bg-[#4779E8]/5 ring-1 ring-[#4779E8]'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-[#192A43] flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>A. Quick Summary</span>
              </span>
              {summaryType === 'quick' && (
                <span className="w-2 h-2 rounded-full bg-[#4779E8]" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              5 to 10 high-impact key bullet points highlighting primary metrics and findings.
            </p>
          </button>

          {/* Option B: Detailed Summary */}
          <button
            onClick={() => setSummaryType('detailed')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              summaryType === 'detailed'
                ? 'border-[#7657D5] bg-[#7657D5]/5 ring-1 ring-[#7657D5]'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-[#192A43] flex items-center space-x-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-[#7657D5]" />
                <span>B. Detailed Summary</span>
              </span>
              {summaryType === 'detailed' && (
                <span className="w-2 h-2 rounded-full bg-[#7657D5]" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Deep section-wise breakdown of context, methodology, data, and implications.
            </p>
          </button>

          {/* Option C: Executive Summary */}
          <button
            onClick={() => setSummaryType('executive')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              summaryType === 'executive'
                ? 'border-[#192A43] bg-slate-900/5 ring-1 ring-[#192A43]'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-[#192A43] flex items-center space-x-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>C. Executive Summary</span>
              </span>
              {summaryType === 'executive' && (
                <span className="w-2 h-2 rounded-full bg-[#192A43]" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Formal structure: Objective, Methodology, Findings, Concepts, Limitations & Conclusion.
            </p>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {error && (
          <div className="p-4 mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4779E8] to-[#7657D5] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#4779E8]/20 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#192A43]">
              Reading and synthesising {document.pageCount} pages...
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Gemini 3.8 Flash is analyzing document structure, cross-referencing pages, and composing your {summaryType} summary.
            </p>
          </div>
        ) : currentSummary ? (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-slate-200">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-slate-700">
                  {currentSummary.type} Summary
                </span>
                <span>•</span>
                <span>
                  Generated {new Date(currentSummary.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-xs shadow-2xs transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload('md')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-xs shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>

                <button
                  onClick={() => handleDownload('txt')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-xs shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            {/* Formatted Content */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 text-slate-800 text-sm leading-relaxed prose prose-slate max-w-none whitespace-pre-wrap font-sans">
              {currentSummary.content}
            </div>

            {/* Previously Generated Summaries History */}
            {history.length > 1 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Previously Generated Syntheses
                </h4>
                <div className="flex flex-wrap gap-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentSummary(item);
                        setSummaryType(item.type);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                        currentSummary.id === item.id
                          ? 'border-[#4779E8] bg-[#4779E8]/10 text-[#4779E8] font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.type.toUpperCase()} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#7657D5]/10 text-[#7657D5] flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#192A43]">
              No summary generated yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Select one of the 3 summary formats above and click "Generate Summary" to produce an executive-ready brief.
            </p>
            <button
              onClick={handleGenerate}
              className="bg-[#192A43] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs hover:bg-[#192A43]/90 transition-all hover:scale-105"
            >
              Generate Executive Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
