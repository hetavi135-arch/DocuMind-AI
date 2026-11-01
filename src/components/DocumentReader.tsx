import React, { useState } from 'react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Copy,
  Check,
  Hash,
} from 'lucide-react';
import { DocumentItem } from '../types/document.js';

interface DocumentReaderProps {
  document: DocumentItem;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({ document }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const totalPages = document.pageCount || document.pages.length || 1;
  const activePageData = document.pages.find((p) => p.pageNumber === currentPage) || {
    pageNumber: currentPage,
    text: 'No text extracted for this page.',
    wordCount: 0,
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleCopyPage = () => {
    navigator.clipboard.writeText(activePageData.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple text highlight for search term
  const renderHighlightedText = (text: string, term: string) => {
    if (!term.trim()) return text;
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-slate-900 rounded-xs px-0.5 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
      {/* Top Bar */}
      <div className="p-4 px-6 border-b border-slate-100 bg-[#FAF8F5]/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#192A43]">
              Page-by-Page Document Reader
            </h3>
            <p className="text-[11px] text-slate-400">
              {document.name} • {document.wordCount?.toLocaleString() || 0} total words
            </p>
          </div>
        </div>

        {/* Page Switcher & Search */}
        <div className="flex items-center space-x-3">
          {/* Quick Search inside page */}
          <div className="relative hidden sm:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Find in page..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 outline-hidden w-36 focus:w-48 transition-all"
            />
          </div>

          {/* Page Navigator */}
          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <button
              onClick={handlePrev}
              disabled={currentPage <= 1}
              className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>

            <span className="px-2 font-medium text-slate-700">
              Page <span className="font-bold text-[#192A43]">{currentPage}</span> of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <button
            onClick={handleCopyPage}
            className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
            title="Copy Page Text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Page Content Body */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10 font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-wrap selection:bg-[#4779E8]/20 bg-[#FAF8F5]/30">
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-xs border border-slate-100 min-h-full">
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100 font-sans text-xs text-slate-400">
            <span>DOCUMENT TEXT VERIFICATION</span>
            <span>Page {currentPage} of {totalPages} • {activePageData.wordCount || 0} words</span>
          </div>

          {renderHighlightedText(activePageData.text, searchTerm)}
        </div>
      </div>

      {/* Bottom Page Thumbnails */}
      <div className="p-3 border-t border-slate-100 bg-white flex items-center justify-center space-x-1 overflow-x-auto text-xs">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-7 h-7 rounded-lg font-mono font-medium transition-colors ${
                isActive
                  ? 'bg-[#192A43] text-white font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};
