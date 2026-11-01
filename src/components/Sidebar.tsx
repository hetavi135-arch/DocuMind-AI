import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  FolderOpen,
  BotMessageSquare,
  FileText,
  Layers,
  History,
  Settings,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'upload'
  | 'documents'
  | 'assistant'
  | 'summaries'
  | 'flashcards'
  | 'history'
  | 'settings'
  | 'landing';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  selectedDocName?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  selectedDocName,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload' as NavTab, label: 'Upload Document', icon: UploadCloud, highlight: true },
    { id: 'documents' as NavTab, label: 'My Documents', icon: FolderOpen },
    { id: 'assistant' as NavTab, label: 'AI Assistant', icon: BotMessageSquare, docBound: true },
    { id: 'summaries' as NavTab, label: 'Summaries', icon: FileText, docBound: true },
    { id: 'flashcards' as NavTab, label: 'Flashcards', icon: Layers, docBound: true },
    { id: 'history' as NavTab, label: 'History', icon: History },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 bg-[#192A43] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="p-6">
          <div
            onClick={() => onSelectTab('landing')}
            className="cursor-pointer flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4779E8] to-[#7657D5] flex items-center justify-center shadow-lg shadow-[#4779E8]/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">DocuMind</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#4779E8]/30 text-[#4779E8] border border-[#4779E8]/50">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Intelligent Document Assistant</p>
            </div>
          </div>

          {/* Active Document Indicator */}
          {selectedDocName ? (
            <div className="mt-6 p-3 bg-slate-800/70 rounded-xl border border-slate-700/60 backdrop-blur-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="uppercase font-semibold tracking-wider">Active Workspace</span>
                <span className="w-2 h-2 rounded-full bg-[#23865B] animate-pulse" />
              </div>
              <p className="text-xs font-medium text-slate-200 truncate" title={selectedDocName}>
                {selectedDocName}
              </p>
            </div>
          ) : (
            <div className="mt-6 p-3 bg-slate-800/40 rounded-xl border border-dashed border-slate-700 text-center">
              <p className="text-xs text-slate-400">Select or upload a PDF to unlock full Q&A and Flashcards</p>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4779E8] to-[#4779E8]/80 text-white shadow-md shadow-[#4779E8]/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : item.highlight ? 'text-[#4779E8]' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="text-[10px] bg-[#4779E8]/20 text-[#4779E8] px-2 py-0.5 rounded-full font-semibold border border-[#4779E8]/30">
                      New
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-6 border-t border-slate-800/80 bg-slate-900/30">
          <button
            onClick={() => onSelectTab('landing')}
            className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 py-2 group"
          >
            <span>Landing Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </button>
          <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-500">
            <span>Powered by Gemini Flash</span>
            <span className="text-[#23865B] font-medium flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#23865B]" />
              <span>Live Engine</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
