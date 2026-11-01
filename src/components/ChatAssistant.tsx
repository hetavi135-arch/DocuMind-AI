import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  BotMessageSquare,
  User,
  Copy,
  Check,
  Volume2,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import {
  sendChatMessage,
  fetchChatHistory,
  clearChatHistory,
} from '../api/client.js';
import { DocumentItem, ChatMessage, GroundedSource } from '../types/document.js';

interface ChatAssistantProps {
  document: DocumentItem;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ document }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'What is the primary objective of this document?',
    'Summarize the core methodology and architecture.',
    'What are the key quantitative findings and data points?',
    'What limitations, caveats, or risks are mentioned?',
    'Explain the most technical concept in simple language.',
  ];

  useEffect(() => {
    loadHistory();
  }, [document.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const loadHistory = async () => {
    try {
      const history = await fetchChatHistory(document.id);
      setMessages(history);
    } catch {
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    setInputQuery('');
    const tempUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const result = await sendChatMessage(document.id, text.trim());
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        result.userMessage,
        result.assistantMessage,
      ]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Error processing question: ${err.message || 'Gemini service unavailable'}. Please verify server connection.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove citation brackets for cleaner speech
      const clean = text.replace(/\[Page \d+\]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Clear chat history for this document?')) {
      await clearChatHistory(document.id);
      setMessages([]);
    }
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px] bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-[#FAF8F5]/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center">
            <BotMessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#192A43] flex items-center space-x-2">
              <span>Grounded Document Assistant</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Grounded in {document.name}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Only answers from {document.pageCount} pages • Cites exact source pages
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center space-x-1 text-slate-400 hover:text-rose-500 text-xs px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#192A43]">
              Ask anything about this document
            </h4>
            <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
              DocuMind AI retrieves relevant semantic chunks across all {document.pageCount} pages and produces accurate, cited answers.
            </p>

            {/* Suggested Prompt Chips */}
            <div className="w-full space-y-2 text-left">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Suggested Prompts
              </span>
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-[#4779E8]/10 border border-slate-200/70 hover:border-[#4779E8]/30 text-xs text-slate-700 font-medium transition-all flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{prompt}</span>
                  <Send className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#4779E8] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isExpanded = expandedSources[msg.id];
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isUser
                      ? 'bg-[#192A43] text-white'
                      : 'bg-gradient-to-br from-[#4779E8] to-[#7657D5] text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className={`space-y-2 max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#192A43] text-white rounded-tr-none'
                        : 'bg-[#FAF8F5] text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Grounded Source Citations */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60">
                        <button
                          onClick={() => toggleSources(msg.id)}
                          className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#4779E8] hover:text-[#4779E8]/80"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>
                            {msg.sources.length} Grounded {msg.sources.length === 1 ? 'Source' : 'Sources'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 ml-1" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 ml-1" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 space-y-2 animate-in fade-in duration-150">
                            {msg.sources.map((src, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between text-[11px] font-semibold">
                                  <span className="text-[#192A43] px-2 py-0.5 rounded bg-blue-50 text-[#4779E8]">
                                    Page {src.pageNumber}
                                  </span>
                                  <span className="text-slate-400 text-[10px]">
                                    {src.relevanceScore}% match
                                  </span>
                                </div>
                                <p className="text-slate-600 italic text-[11px] leading-snug">
                                  "{src.excerpt}"
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions under assistant message */}
                  {!isUser && (
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 px-1">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center space-x-1 hover:text-slate-700 p-1 rounded"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="flex items-center space-x-1 hover:text-slate-700 p-1 rounded"
                        title="Read Aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Speak</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-center space-x-3 text-xs text-slate-500 py-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4779E8] to-[#7657D5] text-white flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-slate-200/80 flex items-center space-x-2 text-slate-600 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#4779E8]" />
              <span>Searching semantic chunks and generating grounded response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-100 bg-[#FAF8F5]/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs focus-within:border-[#4779E8] transition-colors"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question about this document in natural English..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent outline-hidden text-[#192A43] placeholder-slate-400"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="flex items-center space-x-1.5 bg-[#192A43] disabled:opacity-40 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all hover:bg-[#192A43]/90"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5 text-[#4779E8]" />
          </button>
        </form>
      </div>
    </div>
  );
};
