import React from 'react';
import {
  Sparkles,
  Upload,
  ArrowRight,
  FileSearch,
  MessageSquare,
  FileText,
  Brain,
  ShieldCheck,
  Zap,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Briefcase,
  Layers,
} from 'lucide-react';
import { NavTab } from './Sidebar.js';

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
  onSelectSampleDoc?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSelectSampleDoc,
}) => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#192A43] flex flex-col selection:bg-[#4779E8]/20">
      {/* Navigation */}
      <nav className="h-20 border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4779E8] to-[#7657D5] flex items-center justify-center shadow-md shadow-[#4779E8]/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#192A43]">DocuMind</span>
            <span className="ml-1 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#4779E8]/10 text-[#4779E8] border border-[#4779E8]/20">
              AI
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-[#192A43] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#192A43] transition-colors">How It Works</a>
          <a href="#benefits" className="hover:text-[#192A43] transition-colors">Benefits</a>
          <button
            onClick={() => onNavigate('dashboard')}
            className="hover:text-[#4779E8] transition-colors"
          >
            Dashboard
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hidden sm:inline-flex text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center space-x-2 bg-[#192A43] hover:bg-[#192A43]/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-[#192A43]/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Upload className="w-4 h-4 text-[#4779E8]" />
            <span>Upload PDF</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32 px-6 sm:px-12 max-w-6xl mx-auto text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#4779E8]/15 via-[#7657D5]/15 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-8">
          <span className="w-2 h-2 rounded-full bg-[#4779E8] animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">
            Next-Gen Document Intelligence Engine with Grounded Citations
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#192A43] tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Understand Any Document. <br />
          <span className="bg-gradient-to-r from-[#4779E8] via-[#7657D5] to-[#4779E8] bg-clip-text text-transparent">
            Instantly.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Turn lengthy PDFs, academic papers, and technical manuals into instant knowledge. Ask questions with page-accurate citations, generate executive summaries, and master concepts with auto-generated flashcards.
        </p>

        {/* Hero CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('upload')}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-gradient-to-r from-[#4779E8] to-[#7657D5] hover:opacity-95 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-[#4779E8]/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Your First PDF</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-[#192A43] border border-slate-300/80 font-semibold px-8 py-4 rounded-2xl shadow-xs transition-all hover:border-slate-400 text-base"
          >
            <span>Explore Dashboard</span>
          </button>
        </div>

        {/* Quick sample preview callout */}
        <div className="mt-8 text-xs text-slate-500 flex items-center justify-center space-x-2">
          <span>No PDF right now?</span>
          <button
            onClick={() => {
              if (onSelectSampleDoc) onSelectSampleDoc();
              else onNavigate('assistant');
            }}
            className="font-semibold text-[#4779E8] hover:underline flex items-center space-x-1"
          >
            <span>Try our pre-loaded Transformer Architecture paper</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Hero Graphic / Preview Card */}
        <div className="mt-16 bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200/80 text-left relative max-w-4xl mx-auto overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-slate-400 ml-2">DocuMind AI Workspace</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              Grounded Analysis
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 p-4 bg-[#FAF8F5] rounded-2xl border border-slate-200/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Indexed Document</span>
              <p className="mt-1 font-semibold text-xs text-[#192A43]">Attention_Is_All_You_Need.pdf</p>
              <div className="mt-3 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Pages</span>
                  <span className="font-semibold text-slate-700">6 pages</span>
                </div>
                <div className="flex justify-between">
                  <span>Embeddings</span>
                  <span className="font-semibold text-slate-700">gemini-embedding-2</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-semibold text-[#23865B]">Ready & Indexed</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 p-4 bg-white rounded-2xl border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 mb-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">Q</span>
                  <span>"Why does the Transformer discard recurrence?"</span>
                </div>
                <div className="p-3 bg-[#4779E8]/5 rounded-xl border border-[#4779E8]/20 text-xs text-slate-700 leading-relaxed">
                  <p>
                    Recurrent models generate hidden states sequentially, which prohibits parallelization within training examples and causes memory bottlenecks at longer sequence lengths <span className="font-bold text-[#4779E8] bg-[#4779E8]/10 px-1 py-0.5 rounded text-[11px]">[Page 2]</span>. The Transformer draws global dependencies solely through attention mechanisms in parallel.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified against document chunks with 98% relevance</span>
                <span className="text-[#4779E8] font-medium">Source: Page 2, Paragraph 1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4779E8]">Key Capabilities</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#192A43] tracking-tight">
              Engineered for Deep Document Intelligence
            </p>
            <p className="mt-4 text-slate-600 text-sm sm:text-base">
              DocuMind AI combines page-level PDF extraction with vector embeddings and Gemini Flash for unmatched speed and grounding accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200/80 hover:border-[#4779E8]/50 transition-all hover:shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#192A43]">1. Intelligent PDF Processing</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Extracts text page-by-page, preserves metadata, calculates word frequencies, and flags scanned image PDFs requiring OCR.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200/80 hover:border-[#7657D5]/50 transition-all hover:shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-[#7657D5]/10 text-[#7657D5] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#192A43]">2. Ask Questions Naturally</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Semantic vector retrieval pinpoints the exact sections of your document, returning answers with clickable page citations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200/80 hover:border-[#4779E8]/50 transition-all hover:shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#192A43]">3. AI-Powered Summaries</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Choose between Quick Bullets, Detailed Section Analyses, or formal Executive Summaries with objectives, limitations and data.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-slate-200/80 hover:border-[#7657D5]/50 transition-all hover:shadow-lg group">
              <div className="w-12 h-12 rounded-2xl bg-[#7657D5]/10 text-[#7657D5] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#192A43]">4. Automatic Flashcards</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Transform any 50-page manual or study deck into 10, 20, or 30 interactive flip cards with difficulty ratings and mastery tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#7657D5]">The Complete Workflow</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#192A43] tracking-tight">
            How DocuMind AI Transforms Documents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs relative">
            <span className="text-4xl font-extrabold text-slate-200">01</span>
            <h4 className="mt-4 text-xl font-bold text-[#192A43]">Upload & Extract</h4>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Drag and drop any PDF. The engine performs page-by-page extraction, validating digital text streams and extracting exact word counts.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs relative">
            <span className="text-4xl font-extrabold text-slate-200">02</span>
            <h4 className="mt-4 text-xl font-bold text-[#192A43]">Index & Retrieve</h4>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Text is sliced into contextual chunks and indexed with dense vector embeddings to power sub-second semantic retrieval.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs relative">
            <span className="text-4xl font-extrabold text-slate-200">03</span>
            <h4 className="mt-4 text-xl font-bold text-[#192A43]">Interact & Learn</h4>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Ask natural questions with source page citations, generate 3 structured summary formats, and drill flashcards in study mode.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white border-t border-slate-200/80 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4779E8]">Who Benefits</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#192A43] tracking-tight">
              Designed for Professionals, Researchers & Students
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <GraduationCap className="w-5 h-5 text-[#4779E8]" />
                <h4 className="font-bold text-[#192A43]">Students & Academics</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Skim 40-page papers in minutes. Turn dense textbook chapters into exam-ready flashcard decks with automatic mastery ratings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <Briefcase className="w-5 h-5 text-[#7657D5]" />
                <h4 className="font-bold text-[#192A43]">Executives & Analysts</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate executive-level memos with quantitative findings, methodology, and risks for board meetings and investor reviews.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-[#23865B]" />
                <h4 className="font-bold text-[#192A43]">Strictly Grounded & Safe</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero AI hallucinations. The assistant refuses to invent facts and tells you directly if a topic is not discussed in the document.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-[#192A43] text-white px-6 sm:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to unlock instant knowledge from your PDFs?
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Experience real AI-driven document intelligence. Upload any PDF document or explore our pre-indexed research papers.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#4779E8] to-[#7657D5] hover:opacity-95 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              <Upload className="w-4 h-4" />
              <span>Get Started Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#121f31] text-slate-400 py-8 px-6 sm:px-12 text-xs text-center flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto w-full gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-white">DocuMind AI</span>
          <span>© 2026. All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-6">
          <span>Powered by Google Gemini 3.8 Flash</span>
          <span>Zero-Pill Architecture</span>
          <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
            App Dashboard
          </button>
        </div>
      </footer>
    </div>
  );
};
