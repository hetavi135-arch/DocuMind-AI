import React, { useState } from 'react';
import {
  BotMessageSquare,
  FileText,
  Layers,
  BookOpen,
  ArrowLeft,
  Share2,
  Download,
  CheckCircle2,
  HardDrive,
  Calendar,
} from 'lucide-react';
import { DocumentItem } from '../types/document.js';
import { ChatAssistant } from './ChatAssistant.js';
import { SummaryGenerator } from './SummaryGenerator.js';
import { FlashcardsView } from './FlashcardsView.js';
import { DocumentReader } from './DocumentReader.js';
import { NavTab } from './Sidebar.js';

interface DocumentWorkspaceProps {
  document: DocumentItem;
  initialTab?: 'assistant' | 'summaries' | 'flashcards' | 'reader';
  onBackToDocuments: () => void;
}

export const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({
  document,
  initialTab = 'assistant',
  onBackToDocuments,
}) => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'summaries' | 'flashcards' | 'reader'>(
    initialTab
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Document Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onBackToDocuments}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
            title="Back to Documents"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-[#23865B] border border-emerald-200 shrink-0">
                Indexed & Ready
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {document.pageCount} pages • {document.wordCount?.toLocaleString() || 0} words
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#192A43] truncate mt-0.5" title={document.name}>
              {document.name}
            </h1>
          </div>
        </div>

        {/* Workspace Tab Buttons */}
        <div className="flex items-center space-x-1.5 bg-[#FAF8F5] p-1.5 rounded-2xl border border-slate-200/80 self-start md:self-auto overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'assistant'
                ? 'bg-[#192A43] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <BotMessageSquare className="w-4 h-4 text-[#4779E8]" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('summaries')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'summaries'
                ? 'bg-[#192A43] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <FileText className="w-4 h-4 text-[#7657D5]" />
            <span>Summaries</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-[#192A43] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab('reader')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'reader'
                ? 'bg-[#192A43] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Document Reader</span>
          </button>
        </div>
      </div>

      {/* Workspace Active View */}
      <div>
        {activeTab === 'assistant' && <ChatAssistant document={document} />}
        {activeTab === 'summaries' && <SummaryGenerator document={document} />}
        {activeTab === 'flashcards' && <FlashcardsView document={document} />}
        {activeTab === 'reader' && <DocumentReader document={document} />}
      </div>
    </div>
  );
};
