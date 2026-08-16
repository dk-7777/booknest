import React, { useState, useMemo } from 'react';
import { Clock, Star, Quote, Calendar, Award, BookCheck, Sparkles, Filter, Edit3, ChevronRight, Zap } from 'lucide-react';

export default function ReadingHistoryShelf({
  books,
  currentUser,
  onOpenDetails
}) {
  const [selectedYear, setSelectedYear] = useState('All');
  const [minRating, setMinRating] = useState('All');

  const completedBooks = useMemo(() => {
    return books
      .filter(b => b.status === 'completed')
      .sort((a, b) => new Date(b.finishDate || b.updatedAt || 0) - new Date(a.finishDate || a.updatedAt || 0));
  }, [books]);

  const years = useMemo(() => {
    const set = new Set();
    completedBooks.forEach(b => {
      if (b.finishDate) {
        set.add(new Date(b.finishDate).getFullYear());
      }
    });
    return ['All', ...Array.from(set).sort((a, b) => b - a)];
  }, [completedBooks]);

  const filteredList = useMemo(() => {
    return completedBooks.filter(book => {
      if (selectedYear !== 'All' && book.finishDate) {
        if (new Date(book.finishDate).getFullYear().toString() !== selectedYear.toString()) return false;
      }
      if (minRating !== 'All') {
        const r = book.rating || 0;
        if (r < Number(minRating)) return false;
      }
      return true;
    });
  }, [completedBooks, selectedYear, minRating]);

  const totalPagesRead = useMemo(() => {
    return completedBooks.reduce((acc, b) => acc + (b.totalPages || 0), 0);
  }, [completedBooks]);

  const avgRating = useMemo(() => {
    const rated = completedBooks.filter(b => b.rating);
    if (!rated.length) return 0;
    const sum = rated.reduce((acc, b) => acc + b.rating, 0);
    return (sum / rated.length).toFixed(1);
  }, [completedBooks]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0a0f1d] via-[#090d18] to-[#0a0f1d] p-6 rounded-3xl border border-cyber-500/25 shadow-glow-blue">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">Reading Era & Archives (Shelf 2)</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                {completedBooks.length} Conquered 👑
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Your timeline of completed masterpieces, personal review drops, and treasured quotes.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-obsidian-900 border border-obsidian-750 px-4 py-2.5 rounded-2xl text-center shadow-sm">
              <div className="text-[10px] uppercase font-mono text-slate-400">Total Read</div>
              <div className="text-lg font-extrabold font-mono text-emerald-400">{completedBooks.length}</div>
            </div>
            <div className="bg-obsidian-900 border border-obsidian-750 px-4 py-2.5 rounded-2xl text-center shadow-sm">
              <div className="text-[10px] uppercase font-mono text-slate-400">Avg Rating</div>
              <div className="text-lg font-extrabold font-mono text-cyber-400 flex items-center justify-center gap-1">
                <span>{avgRating || '—'}</span>
                <Star className="w-3.5 h-3.5 fill-cyber-400" />
              </div>
            </div>
            <div className="bg-obsidian-900 border border-obsidian-750 px-4 py-2.5 rounded-2xl text-center shadow-sm">
              <div className="text-[10px] uppercase font-mono text-slate-400">Pages Read</div>
              <div className="text-lg font-extrabold font-mono text-blue-400">{totalPagesRead.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-[#090d18] p-4 rounded-2xl border border-obsidian-750">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-4 h-4 text-cyber-400" />
          <span className="font-bold text-slate-200">Filter Archives:</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-obsidian-900 border border-obsidian-750 px-3 py-1.5 rounded-xl text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-semibold"
            >
              {years.map(y => (
                <option key={y} value={y} className="bg-obsidian-900 text-slate-200">
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-obsidian-900 border border-obsidian-750 px-3 py-1.5 rounded-xl text-xs">
            <Star className="w-3.5 h-3.5 text-cyber-400" />
            <span className="text-slate-400">Rating:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-semibold"
            >
              <option value="All" className="bg-obsidian-900 text-slate-200">All Ratings</option>
              <option value="4.5" className="bg-obsidian-900 text-slate-200">4.5+ ⭐ Elite</option>
              <option value="4.0" className="bg-obsidian-900 text-slate-200">4.0+ ⭐ Great</option>
              <option value="3.0" className="bg-obsidian-900 text-slate-200">3.0+ ⭐ Good</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {filteredList.length > 0 ? (
        <div className="relative border-l-2 border-cyber-500/30 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8 py-2">
          {filteredList.map((book) => {
            return (
              <div key={book.id} className="relative group">
                
                {/* Node */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-cyber-500/20 border-2 border-cyber-400 text-cyber-300 flex items-center justify-center text-[10px] font-extrabold shadow-glow-cyan">
                  ⚡
                </div>

                {/* Card */}
                <div className="bg-[#090d18] hover:bg-[#0e1424] border border-obsidian-750 hover:border-cyber-500/40 rounded-3xl p-5 sm:p-6 transition-all shadow-glass-card">
                  
                  <div className="flex flex-col sm:flex-row gap-5">
                    
                    {/* Cover image */}
                    <div 
                      onClick={() => onOpenDetails(book)}
                      className="cursor-pointer shrink-0 w-28 sm:w-32 h-40 sm:h-44 rounded-xl overflow-hidden book-spine-effect shadow-md border border-obsidian-700 bg-obsidian-950"
                    >
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              Completed 🎉
                            </span>
                            <span className="text-xs text-cyber-300 px-2 py-0.5 rounded-lg bg-obsidian-850 font-mono">
                              {book.genre}
                            </span>
                            <span className="text-xs text-slate-400">
                              • {book.totalPages} pgs ({book.format})
                            </span>
                          </div>

                          {book.finishDate && (
                            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-cyber-400" />
                              <span>Finished on <strong className="text-white">{book.finishDate}</strong></span>
                            </div>
                          )}
                        </div>

                        <h2 
                          onClick={() => onOpenDetails(book)}
                          className="mt-2 font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyber-300 cursor-pointer transition-colors"
                        >
                          {book.title}
                        </h2>
                        <p className="text-xs text-slate-400">by <span className="text-slate-200 font-semibold">{book.author}</span></p>

                        {/* Rating */}
                        {book.rating && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center text-cyber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(book.rating)
                                      ? 'fill-cyber-400 text-cyber-400'
                                      : i < book.rating
                                      ? 'fill-cyber-400/50 text-cyber-400'
                                      : 'text-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-cyber-300 font-mono">
                              {book.rating.toFixed(1)} / 5.0
                            </span>
                          </div>
                        )}

                        {/* Review text */}
                        {book.review ? (
                          <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed bg-obsidian-850 p-3.5 rounded-2xl border border-obsidian-750">
                            {book.review}
                          </p>
                        ) : (
                          <p className="mt-3 text-xs text-slate-500 italic">
                            No review dropped yet. Click to share your thoughts!
                          </p>
                        )}

                        {/* Favorite Quote */}
                        {book.favoriteQuote && (
                          <div className="mt-3 flex items-start gap-2 bg-cyber-500/10 border border-cyber-500/30 p-3 rounded-2xl">
                            <Quote className="w-4 h-4 text-cyber-400 shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm italic text-cyan-200 font-medium">
                              "{book.favoriteQuote}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-obsidian-750 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {book.startDate ? `Window: ${book.startDate} → ${book.finishDate || 'Done'}` : 'Conquered'}
                        </span>
                        <button
                          onClick={() => onOpenDetails(book)}
                          className="flex items-center gap-1 text-xs font-bold text-cyber-400 hover:text-cyber-300 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Review & Notes</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#090d18] rounded-3xl border border-obsidian-750 p-12 text-center max-w-md mx-auto shadow-glass-card">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-glow-blue">
            <BookCheck className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">No books conquered yet</h3>
          <p className="text-xs text-slate-400 mt-1.5 mb-4">
            Finish a book in your library or log reading progress to 100% to unlock your Reading Era archives!
          </p>
        </div>
      )}

    </div>
  );
}
