import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  CheckCircle2,
  BookmarkCheck,
  Download,
  BookOpen,
  LayoutGrid,
  CreditCard,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  generateFlashcards,
  fetchFlashcardSet,
  updateCardMastery,
} from '../api/client.js';
import { DocumentItem, Flashcard, FlashcardSet } from '../types/document.js';

interface FlashcardsViewProps {
  document: DocumentItem;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ document }) => {
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardCount, setCardCount] = useState<10 | 20 | 30>(10);
  const [viewMode, setViewMode] = useState<'study' | 'grid'>('study');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFlashcards();
  }, [document.id]);

  // Keyboard navigation for study mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'study' || !flashcardSet || flashcardSet.cards.length === 0) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, flashcardSet, currentIndex]);

  const loadFlashcards = async () => {
    try {
      const data = await fetchFlashcardSet(document.id);
      setFlashcardSet(data);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch {
      setFlashcardSet(null);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newSet = await generateFlashcards(document.id, cardCount);
      setFlashcardSet(newSet);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err: any) {
      setError(err.message || 'Failed to generate flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!flashcardSet) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcardSet.cards.length);
  };

  const handlePrev = () => {
    if (!flashcardSet) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcardSet.cards.length) % flashcardSet.cards.length);
  };

  const toggleMastery = async (card: Flashcard) => {
    if (!flashcardSet) return;
    const newMastered = !card.mastered;
    const updatedCards = flashcardSet.cards.map((c) =>
      c.id === card.id ? { ...c, mastered: newMastered } : c
    );
    setFlashcardSet({ ...flashcardSet, cards: updatedCards });

    try {
      await updateCardMastery(document.id, card.id, newMastered);
    } catch {
      // Revert if error
      setFlashcardSet(flashcardSet);
    }
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (!flashcardSet) return;
    let content = '';
    let mime = '';
    if (format === 'json') {
      content = JSON.stringify(flashcardSet.cards, null, 2);
      mime = 'application/json';
    } else {
      content =
        'Question,Answer,Difficulty,PageNumber,Tag,Mastered\n' +
        flashcardSet.cards
          .map(
            (c) =>
              `"${c.question.replace(/"/g, '""')}","${c.answer.replace(/"/g, '""')}","${c.difficulty}",${c.pageNumber},"${c.tag || ''}",${c.mastered ? 'Yes' : 'No'}`
          )
          .join('\n');
      mime = 'text/csv';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.name.replace(/\.[^/.]+$/, '')}_flashcards.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentCard = flashcardSet?.cards[currentIndex];
  const masteredCount = flashcardSet?.cards.filter((c) => c.mastered).length || 0;
  const totalCount = flashcardSet?.cards.length || 0;
  const masteryPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Hard: 'bg-violet-50 text-violet-700 border-violet-200',
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Controls */}
      <div className="p-6 border-b border-slate-100 bg-[#FAF8F5]/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Active Study Studio
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
              Interactive Deck
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#192A43] mt-1">Educational Flashcards</h2>
          <p className="text-xs text-slate-500">
            Drill key findings, definitions, and equations grounded across {document.pageCount} pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Card Count Selector */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs">
            <span className="text-slate-400 px-2 font-medium">Count:</span>
            {[10, 20, 30].map((num) => (
              <button
                key={num}
                onClick={() => setCardCount(num as any)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  cardCount === num
                    ? 'bg-[#192A43] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('study')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors ${
                viewMode === 'study' ? 'bg-[#4779E8] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Study Mode (One card at a time)"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Study</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors ${
                viewMode === 'grid' ? 'bg-[#4779E8] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View (All cards)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating {cardCount} Cards...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{flashcardSet ? `Regenerate (${cardCount})` : `Generate ${cardCount} Cards`}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Flashcard Body */}
      <div className="p-6">
        {error && (
          <div className="p-4 mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 animate-pulse">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#192A43]">
              Generating {cardCount} rigorous flashcards...
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Synthesizing core concepts, calculating difficulty tiers, and pinning source pages with Gemini 3.8 Flash.
            </p>
          </div>
        ) : !flashcardSet || flashcardSet.cards.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#192A43]">
              No flashcards generated yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the "Generate {cardCount} Cards" button above to automatically extract study questions and answers from this PDF.
            </p>
            <button
              onClick={handleGenerate}
              className="bg-[#192A43] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs hover:bg-[#192A43]/90 transition-all hover:scale-105"
            >
              Generate Flashcards Now
            </button>
          </div>
        ) : viewMode === 'study' ? (
          /* STUDY MODE: 3D Flip Card */
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Stats Header & Mastery Progress */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-700">
                  Card {currentIndex + 1} of {totalCount}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-semibold">
                  {masteredCount} Mastered ({masteryPercent}%)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 text-[11px] p-1.5 rounded-lg hover:bg-slate-100"
                  title="Export to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-[#4779E8] transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
              />
            </div>

            {/* Interactive 3D Flip Card */}
            {currentCard && (
              <div
                onClick={() => setIsFlipped((prev) => !prev)}
                className="cursor-pointer group relative min-h-[320px] rounded-3xl p-8 border border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between bg-gradient-to-br from-white to-[#FAF8F5]"
              >
                {/* Card Top Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        difficultyColors[currentCard.difficulty] || difficultyColors.Medium
                      }`}
                    >
                      {currentCard.difficulty}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {currentCard.tag || 'Topic'}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-[#4779E8] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                    Source: Page {currentCard.pageNumber}
                  </span>
                </div>

                {/* Card Center Content */}
                <div className="py-6 text-center">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {isFlipped ? 'Answer' : 'Question'} (Click or press Space to flip)
                  </div>
                  <h3
                    className={`text-lg sm:text-xl font-bold leading-relaxed transition-all ${
                      isFlipped ? 'text-slate-800' : 'text-[#192A43]'
                    }`}
                  >
                    {isFlipped ? currentCard.answer : currentCard.question}
                  </h3>
                </div>

                {/* Card Bottom Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5 group-hover:text-[#4779E8] transition-colors">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Flip Card</span>
                  </div>

                  {currentCard.mastered ? (
                    <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mastered</span>
                    </span>
                  ) : (
                    <span>Review Needed</span>
                  )}
                </div>
              </div>
            )}

            {/* Navigation & Mastery Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrev}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {currentCard && (
                <button
                  onClick={() => toggleMastery(currentCard)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    currentCard.mastered
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-[#192A43] hover:bg-[#192A43]/90 text-white shadow-xs'
                  }`}
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>{currentCard.mastered ? 'Mastered ✓' : 'Mark as Mastered'}</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Pro-tip: Use <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">Space</kbd> to flip, and <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">→</kbd> arrows to navigate.
            </p>
          </div>
        ) : (
          /* GRID VIEW: All Cards */
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-500 pb-2">
              <span>Showing all {flashcardSet.cards.length} flashcards</span>
              <button
                onClick={() => handleExport('json')}
                className="text-[#4779E8] font-semibold hover:underline flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcardSet.cards.map((card, idx) => (
                <div
                  key={card.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-mono text-slate-400">#{idx + 1}</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-full border ${
                          difficultyColors[card.difficulty] || difficultyColors.Medium
                        }`}
                      >
                        {card.difficulty}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#192A43] leading-snug">
                      {card.question}
                    </h4>

                    <p className="text-xs text-slate-600 mt-2 bg-[#FAF8F5] p-3 rounded-xl border border-slate-100 leading-relaxed">
                      {card.answer}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <span className="text-[#4779E8] font-medium">Page {card.pageNumber}</span>
                    <button
                      onClick={() => toggleMastery(card)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                        card.mastered
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {card.mastered ? 'Mastered ✓' : 'Review'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
