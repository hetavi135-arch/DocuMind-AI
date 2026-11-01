import React from 'react';
import {
  FileText,
  UploadCloud,
  Layers,
  Sparkles,
  BotMessageSquare,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Calendar,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { DocumentItem, AppStats } from '../types/document.js';
import { NavTab } from './Sidebar.js';

interface DashboardViewProps {
  stats: AppStats | null;
  documents: DocumentItem[];
  onNavigate: (tab: NavTab) => void;
  onSelectDocument: (doc: DocumentItem, targetTab?: NavTab) => void;
  onDeleteDocument: (id: string) => void;
  onResetSamples: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  documents,
  onNavigate,
  onSelectDocument,
  onDeleteDocument,
  onResetSamples,
}) => {
  const formatBytes = (bytes: number) => {
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

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#192A43] via-[#1f3453] to-[#263e63] text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-[#192A43]/15 border border-slate-700/60 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#4779E8]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-semibold text-slate-200 mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#4779E8]" />
            <span>Document Intelligence Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome to DocuMind AI
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
            Extract insights, chat with citations, generate executive summaries, and drill educational flashcards from your documents.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-3">
          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#4779E8] to-[#7657D5] hover:opacity-95 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Real Application Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Documents</span>
            <div className="w-9 h-9 rounded-xl bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#192A43]">{stats?.totalDocuments ?? documents.length}</span>
            <span className="text-xs text-slate-400 font-medium">files</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Stored in persistent JSON DB</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processed & Ready</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#23865B] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#192A43]">
              {stats?.processedDocuments ?? documents.filter((d) => d.status === 'ready').length}
            </span>
            <span className="text-xs text-[#23865B] font-semibold">100% indexed</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Embedded with vector chunks</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Summaries Created</span>
            <div className="w-9 h-9 rounded-xl bg-[#7657D5]/10 text-[#7657D5] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#192A43]">{stats?.totalSummaries ?? 0}</span>
            <span className="text-xs text-slate-400 font-medium">syntheses</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Quick, Detailed & Executive</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Flashcards Active</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#192A43]">{stats?.totalFlashcards ?? 0}</span>
            <span className="text-xs text-slate-400 font-medium">cards</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Mastery and study mode ready</p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('upload')}
          className="text-left p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4779E8] hover:shadow-md transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#192A43]">Ingest New Document</h4>
          <p className="text-xs text-slate-500 mt-1">Upload PDF, extract text, and index vectors</p>
        </button>

        <button
          onClick={() => {
            if (documents.length > 0) onSelectDocument(documents[0], 'assistant');
            else onNavigate('upload');
          }}
          className="text-left p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#7657D5] hover:shadow-md transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#7657D5]/10 text-[#7657D5] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BotMessageSquare className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#192A43]">Ask Natural Questions</h4>
          <p className="text-xs text-slate-500 mt-1">Grounded Q&A with direct page excerpts</p>
        </button>

        <button
          onClick={() => {
            if (documents.length > 0) onSelectDocument(documents[0], 'summaries');
            else onNavigate('upload');
          }}
          className="text-left p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#4779E8] hover:shadow-md transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#192A43]">Generate Summaries</h4>
          <p className="text-xs text-slate-500 mt-1">Executive, Detailed & Quick Bullet points</p>
        </button>

        <button
          onClick={() => {
            if (documents.length > 0) onSelectDocument(documents[0], 'flashcards');
            else onNavigate('upload');
          }}
          className="text-left p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#192A43]">Educational Flashcards</h4>
          <p className="text-xs text-slate-500 mt-1">Practice with 10, 20 or 30 auto-generated cards</p>
        </button>
      </div>

      {/* Recent Documents Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#192A43]">Recent Documents</h3>
            <p className="text-xs text-slate-500 mt-0.5">Documents indexed and available for AI querying</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('documents')}
              className="text-xs font-semibold text-[#4779E8] hover:text-[#4779E8]/80 flex items-center space-x-1"
            >
              <span>View All ({documents.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#192A43]">No documents yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              Upload your first PDF document or reset the pre-indexed sample papers to begin chatting and studying.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => onNavigate('upload')}
                className="bg-[#192A43] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:bg-[#192A43]/90"
              >
                Upload PDF
              </button>
              <button
                onClick={onResetSamples}
                className="bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-200"
              >
                Load Sample Papers
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Document Name</th>
                  <th className="py-3 px-4">Pages</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {documents.slice(0, 5).map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p
                            onClick={() => onSelectDocument(doc, 'assistant')}
                            className="font-semibold text-slate-800 hover:text-[#4779E8] cursor-pointer truncate max-w-xs sm:max-w-md"
                            title={doc.name}
                          >
                            {doc.name}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            {doc.wordCount ? `${doc.wordCount.toLocaleString()} words` : 'Calculating...'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {doc.pageCount} {doc.pageCount === 1 ? 'page' : 'pages'}
                    </td>

                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {formatBytes(doc.fileSize)}
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      {formatDate(doc.createdAt)}
                    </td>

                    <td className="py-4 px-4">
                      {doc.status === 'ready' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#23865B] border border-emerald-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#23865B]" />
                          <span>Ready</span>
                        </span>
                      )}
                      {doc.status === 'extracting' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#4779E8] border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4779E8] animate-ping" />
                          <span>Extracting</span>
                        </span>
                      )}
                      {doc.status === 'indexing' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-50 text-[#7657D5] border border-violet-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7657D5] animate-pulse" />
                          <span>Indexing</span>
                        </span>
                      )}
                      {doc.status === 'failed' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-[#D9534F] border border-rose-200" title={doc.errorMessage}>
                          <AlertCircle className="w-3 h-3 text-[#D9534F]" />
                          <span>Failed (OCR needed)</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onSelectDocument(doc, 'assistant')}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#4779E8] text-slate-700 hover:text-white font-medium text-xs transition-colors"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => onSelectDocument(doc, 'assistant')}
                          className="p-1.5 text-slate-400 hover:text-[#4779E8] rounded-lg hover:bg-slate-100"
                          title="Ask AI"
                        >
                          <BotMessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectDocument(doc, 'summaries')}
                          className="p-1.5 text-slate-400 hover:text-[#7657D5] rounded-lg hover:bg-slate-100"
                          title="Generate Summary"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectDocument(doc, 'flashcards')}
                          className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100"
                          title="Study Flashcards"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
