import React, { useState } from 'react';
import {
  FileText,
  Search,
  UploadCloud,
  BotMessageSquare,
  Sparkles,
  Layers,
  Trash2,
  ExternalLink,
  Calendar,
  Layers2,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { DocumentItem } from '../types/document.js';
import { NavTab } from './Sidebar.js';

interface MyDocumentsViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem, targetTab?: NavTab) => void;
  onDeleteDocument: (id: string) => void;
  onNavigateToUpload: () => void;
}

export const MyDocumentsView: React.FC<MyDocumentsViewProps> = ({
  documents,
  onSelectDocument,
  onDeleteDocument,
  onNavigateToUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'pages'>('date');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  const filteredDocs = documents
    .filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'pages') return (b.pageCount || 0) - (a.pageCount || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192A43] tracking-tight">
            My Documents
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse, search and launch AI workspaces for all your uploaded PDFs.
          </p>
        </div>

        <button
          onClick={onNavigateToUpload}
          className="flex items-center space-x-2 bg-[#192A43] hover:bg-[#192A43]/90 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95"
        >
          <UploadCloud className="w-4 h-4 text-[#4779E8]" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title or topic..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-transparent rounded-xl outline-hidden text-[#192A43] placeholder-slate-400"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto text-xs text-slate-500">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-medium uppercase tracking-wider">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 outline-hidden focus:border-[#4779E8]"
          >
            <option value="date">Most Recent</option>
            <option value="name">Alphabetical</option>
            <option value="pages">Page Count</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200/80 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#192A43]">No documents found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            {searchQuery
              ? `No documents matching "${searchQuery}". Try a different keyword.`
              : 'Upload your first PDF document to build your intelligent knowledge library.'}
          </p>
          <button
            onClick={onNavigateToUpload}
            className="bg-[#192A43] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:bg-[#192A43]/90"
          >
            Upload PDF Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-6 group"
            >
              <div>
                {/* Status & Date */}
                <div className="flex items-center justify-between text-xs mb-3">
                  {doc.status === 'ready' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#23865B] border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ready</span>
                    </span>
                  )}
                  {doc.status === 'extracting' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#4779E8] border border-blue-200">
                      <Clock className="w-3 h-3 animate-spin" />
                      <span>Extracting</span>
                    </span>
                  )}
                  {doc.status === 'indexing' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-[#7657D5] border border-violet-200">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      <span>Indexing</span>
                    </span>
                  )}
                  {doc.status === 'failed' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-[#D9534F] border border-rose-200">
                      <AlertCircle className="w-3 h-3" />
                      <span>OCR Required</span>
                    </span>
                  )}

                  <span className="text-[11px] text-slate-400">{formatDate(doc.createdAt)}</span>
                </div>

                {/* Title */}
                <div
                  onClick={() => onSelectDocument(doc, 'assistant')}
                  className="cursor-pointer group-hover:text-[#4779E8] transition-colors"
                >
                  <h3 className="font-bold text-sm text-[#192A43] line-clamp-2 leading-snug" title={doc.name}>
                    {doc.name}
                  </h3>
                </div>

                {/* Specs */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-[#FAF8F5] p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.pageCount} {doc.pageCount === 1 ? 'Page' : 'Pages'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{formatFileSize(doc.fileSize)}</span>
                  </div>
                  <div className="col-span-2 text-slate-400 text-[10px] truncate">
                    {doc.wordCount ? `${doc.wordCount.toLocaleString()} words indexed` : 'Document ready'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => onSelectDocument(doc, 'assistant')}
                  className="w-full flex items-center justify-center space-x-1.5 bg-[#192A43] hover:bg-[#192A43]/90 text-white font-semibold text-xs py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#4779E8]" />
                  <span>Open Workspace</span>
                </button>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button
                    onClick={() => onSelectDocument(doc, 'assistant')}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-[#4779E8]/10 text-slate-600 hover:text-[#4779E8] flex flex-col items-center text-[10px] font-medium transition-colors"
                    title="Ask AI"
                  >
                    <BotMessageSquare className="w-3.5 h-3.5 mb-0.5" />
                    <span>Ask AI</span>
                  </button>

                  <button
                    onClick={() => onSelectDocument(doc, 'summaries')}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-[#7657D5]/10 text-slate-600 hover:text-[#7657D5] flex flex-col items-center text-[10px] font-medium transition-colors"
                    title="Summary"
                  >
                    <FileText className="w-3.5 h-3.5 mb-0.5" />
                    <span>Summary</span>
                  </button>

                  <button
                    onClick={() => onSelectDocument(doc, 'flashcards')}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100/50 text-slate-600 hover:text-amber-600 flex flex-col items-center text-[10px] font-medium transition-colors"
                    title="Flashcards"
                  >
                    <Layers className="w-3.5 h-3.5 mb-0.5" />
                    <span>Cards</span>
                  </button>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100/50 text-slate-600 hover:text-[#D9534F] flex flex-col items-center text-[10px] font-medium transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5 mb-0.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
