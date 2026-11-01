import React from 'react';
import {
  History,
  FileText,
  BotMessageSquare,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { DocumentItem } from '../types/document.js';
import { NavTab } from './Sidebar.js';

interface HistoryViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem, targetTab?: NavTab) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  documents,
  onSelectDocument,
}) => {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192A43] tracking-tight">
          Document History & Activity
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review recent queries, indexing timestamps, and access your previously generated summaries.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#192A43] uppercase tracking-wider text-slate-400">
          Recent Document Sessions
        </h3>

        {documents.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No document history recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#192A43] group-hover:text-[#4779E8] transition-colors">
                      {doc.name}
                    </h4>
                    <span className="text-xs text-slate-400">
                      Processed on {new Date(doc.createdAt).toLocaleDateString()} • {doc.pageCount} pages • {doc.chunks?.length || 0} vector chunks
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => onSelectDocument(doc, 'assistant')}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#4779E8] text-slate-700 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <BotMessageSquare className="w-3.5 h-3.5" />
                    <span>Open Chat</span>
                  </button>

                  <button
                    onClick={() => onSelectDocument(doc, 'summaries')}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#7657D5] text-slate-700 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Summary</span>
                  </button>

                  <button
                    onClick={() => onSelectDocument(doc, 'flashcards')}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-500 text-slate-700 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Cards</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
