import React, { useState, useMemo } from 'react';
import BookCard from './BookCard';
import { Plus, Search, Filter, BookOpen, Sparkles, Layers, SlidersHorizontal, Flame, Clock } from 'lucide-react';

export default function LibraryShelf({
  books,
  currentUser,
  onOpenDetails,
  onQuickLog,
  onQuickStatusChange,
  onOpenAddBookModal,
  onStartTimer
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState('All');
  const [formatFilter, setFormatFilter] = useState('All');
  const [sortBy, setSortBy] = useState('updated'); // 'updated', 'title', 'progress', 'rating'

  const safeBooks = books || [];

  // Extract unique genres
  const availableGenres = useMemo(() => {
    const set = new Set(safeBooks.map(b => b.genre).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [safeBooks]);

  // Filter & Sort Logic
  const filteredBooks = useMemo(() => {
    return safeBooks.filter(b => {
      if (statusFilter !== 'All' && b.status !== statusFilter) return false;
      if (genreFilter !== 'All' && b.genre !== genreFilter) return false;
      if (formatFilter !== 'All' && b.format !== formatFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (b.title || '').toLowerCase().includes(q);
        const matchesAuthor = (b.author || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'progress') {
        const progA = a.totalPages > 0 ? a.currentPage / a.totalPages : 0;
        const progB = b.totalPages > 0 ? b.currentPage / b.totalPages : 0;
        return progB - progA;
      }
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });
  }, [safeBooks, searchQuery, statusFilter, genreFilter, formatFilter, sortBy]);

  const currentlyReadingCount = safeBooks.filter(b => b.status === 'currently_reading').length;
  const completedCount = safeBooks.filter(b => b.status === 'completed').length;
  const unreadCount = safeBooks.filter(b => b.status === 'unread').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0a0f1d] via-[#090d18] to-[#0a0f1d] p-6 rounded-3xl border border-cyber-500/25 shadow-glow-blue">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">My Shelf (Books Owned)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyber-500/20 text-cyber-300 text-xs font-mono font-bold border border-cyber-500/40">
              {books.length} Books
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track reading progress, log 20-minute focus sessions, and manage your private library collection.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onStartTimer && onStartTimer()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyber-400 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-extrabold text-xs shadow-glow-cyan transition-all transform active:scale-95 shrink-0"
          >
            <Clock className="w-4 h-4 fill-current" />
            <span>⚡ Start 20m Timer</span>
          </button>

          <button
            onClick={onOpenAddBookModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-obsidian-850 hover:bg-obsidian-800 text-white font-bold text-xs border border-cyber-500/30 hover:border-cyber-400 transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-cyber-400" />
            <span>+ Add Book</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#090d18] p-4 sm:p-5 rounded-3xl border border-obsidian-750 shadow-glass-card space-y-3.5">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search your library by book title, author, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400 transition-colors"
          />
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-obsidian-750">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'All', label: 'All Reads', count: books.length },
              { id: 'currently_reading', label: 'Reading Now ⚡', count: currentlyReadingCount },
              { id: 'completed', label: 'Completed 🎉', count: completedCount },
              { id: 'unread', label: 'TBR Queue ⏳', count: unreadCount },
              { id: 'on_hold', label: 'On Hold ⏸️', count: books.filter(b => b.status === 'on_hold').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-cyber-500/20 text-cyber-300 border border-cyber-500/50 shadow-glow-blue'
                    : 'bg-obsidian-900 text-slate-400 hover:text-white hover:bg-obsidian-850 border border-obsidian-750'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-obsidian-950 text-slate-400 font-bold">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Genre & Format Filters */}
          <div className="flex items-center gap-2">
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-slate-300 focus:outline-none focus:border-cyber-400"
            >
              {availableGenres.map(g => (
                <option key={g} value={g}>{g === 'All' ? 'All Genres' : g}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-slate-300 focus:outline-none focus:border-cyber-400"
            >
              <option value="updated">Recently Active</option>
              <option value="progress">Highest Progress</option>
              <option value="rating">Top Rated</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onOpenDetails={onOpenDetails}
              onQuickLog={onQuickLog}
              onQuickStatusChange={onQuickStatusChange}
              onStartTimer={onStartTimer}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#090d18] rounded-3xl border border-obsidian-750 p-12 text-center max-w-md mx-auto shadow-glass-card">
          <div className="w-16 h-16 rounded-2xl bg-cyber-500/10 text-cyber-400 flex items-center justify-center mx-auto mb-4 border border-cyber-500/30 shadow-glow-blue">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">No books found</h3>
          <p className="text-xs text-slate-400 mt-1.5 mb-4">
            {searchQuery ? "No matches for your search filter." : "Your shelf is waiting for your next great read!"}
          </p>
          <button
            onClick={onOpenAddBookModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-500 text-obsidian-950 font-bold text-xs hover:bg-cyber-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add a Book Now</span>
          </button>
        </div>
      )}

    </div>
  );
}
