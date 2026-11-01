import React from 'react';
import {
  Menu,
  Sparkles,
  FileText,
  ChevronDown,
  Upload,
} from 'lucide-react';
import { DocumentItem } from '../types/document.js';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  documents: DocumentItem[];
  selectedDoc: DocumentItem | null;
  onSelectDocument: (doc: DocumentItem) => void;
  onUploadClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  documents,
  selectedDoc,
  onSelectDocument,
  onUploadClick,
}) => {
  return (
    <header className="h-16 border-b border-[#F0F1F4] bg-[#FAF8F5]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/50"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Document Selector Dropdown */}
        <div className="relative group">
          <div className="flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer">
            <FileText className="w-4 h-4 text-[#4779E8]" />
            <div className="max-w-[180px] sm:max-w-[280px] truncate text-xs sm:text-sm font-medium text-[#192A43]">
              {selectedDoc ? selectedDoc.name : 'Select a document...'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
          </div>

          {/* Dropdown Menu */}
          <div className="absolute left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              Your Documents ({documents.length})
            </div>
            <div className="max-h-60 overflow-y-auto">
              {documents.length === 0 ? (
                <div className="px-4 py-3 text-xs text-slate-400 text-center">
                  No documents uploaded yet
                </div>
              ) : (
                documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      selectedDoc?.id === doc.id ? 'bg-[#4779E8]/10 text-[#4779E8] font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <span className="truncate pr-2">{doc.name}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{doc.pageCount}p</span>
                  </button>
                ))
              )}
            </div>
            <div className="border-t border-slate-100 p-2">
              <button
                onClick={onUploadClick}
                className="w-full flex items-center justify-center space-x-2 text-xs font-medium text-[#4779E8] hover:bg-[#4779E8]/10 py-1.5 rounded-lg transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
          <span>Gemini 3.8 Flash Active</span>
        </div>

        <button
          onClick={onUploadClick}
          className="flex items-center space-x-2 bg-[#192A43] hover:bg-[#192A43]/90 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Upload className="w-4 h-4 text-[#4779E8]" />
          <span>Upload PDF</span>
        </button>
      </div>
    </header>
  );
};
