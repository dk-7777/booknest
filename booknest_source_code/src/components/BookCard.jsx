import React, { useState } from 'react';
import { BookOpen, Star, Plus, CheckCircle2, MoreVertical, Edit3, Trash2, ArrowRight, Sparkles, Clock, Flame, Zap } from 'lucide-react';

export default function BookCard({
  book,
  onOpenDetails,
  onQuickLog,
  onQuickStatusChange,
  onStartTimer
}) {
  const [showMenu, setShowMenu] = useState(false);

  const progressPercent = book.totalPages > 0
    ? Math.min(Math.round((book.currentPage / book.totalPages) * 100), 100)
    : 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'currently_reading':
        return { label: 'Reading Now ⚡', bg: 'bg-cyber-500/20 text-cyber-300 border-cyber-500/40' };
      case 'completed':
        return { label: 'Completed 🎉', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'on_hold':
        return { label: 'On Hold ⏸️', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'unread':
      default:
        return { label: 'TBR Stack ⏳', bg: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
    }
  };

  const badge = getStatusBadge(book.status);

  return (
    <div className="bg-[#090d18] hover:bg-[#0e1424] border border-obsidian-750 hover:border-cyber-500/40 rounded-3xl p-4 sm:p-5 transition-all duration-300 shadow-glass-card hover:shadow-glow-blue flex flex-col justify-between group relative overflow-hidden">
      
      {/* Top Section */}
      <div>
        <div className="flex gap-4">
          
          {/* 3D Book Cover Spine */}
          <div
            onClick={() => onOpenDetails(book)}
            className="shrink-0 w-24 h-36 sm:w-28 sm:h-40 rounded-2xl overflow-hidden book-spine-effect shadow-lg cursor-pointer bg-obsidian-950 border border-obsidian-700 relative"
          >
            <img
              src={book.coverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80"}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {book.status === 'completed' && (
              <div className="absolute top-1 right-1 bg-emerald-500 text-obsidian-950 p-1 rounded-full shadow-md">
                <CheckCircle2 className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>

          {/* Book Metadata */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                  {badge.label}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {book.format}
                </span>
              </div>

              <h3
                onClick={() => onOpenDetails(book)}
                className="font-display font-bold text-sm sm:text-base text-white hover:text-cyber-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
              >
                {book.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                by {book.author}
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-cyber-300 font-mono font-medium px-2 py-0.5 rounded-lg bg-obsidian-850 border border-obsidian-750">
                {book.genre}
              </span>
              {book.rating && (
                <div className="flex items-center text-cyber-400 text-xs font-mono font-bold gap-0.5">
                  <Star className="w-3 h-3 fill-cyber-400 text-cyber-400" />
                  <span>{book.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Reading Progress Bar */}
        <div className="mt-4 bg-obsidian-900/80 p-2.5 rounded-2xl border border-obsidian-750">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[11px] text-slate-400 font-mono">
              <strong className="text-white font-bold">{book.currentPage}</strong> / {book.totalPages} pgs
            </span>
            <span className="text-xs font-mono font-bold text-cyber-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden border border-obsidian-750">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyber-500 to-cyan-300 rounded-full transition-all duration-500 shadow-glow-blue"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Quick Action Buttons */}
      <div className="mt-3.5 pt-3 border-t border-obsidian-750 flex items-center justify-between gap-1.5 flex-wrap">
        
        {/* 20m Timer Trigger */}
        <button
          onClick={() => onStartTimer && onStartTimer(book)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-500/15 hover:bg-cyber-500 text-cyber-300 hover:text-obsidian-950 font-bold text-[11px] border border-cyber-500/30 hover:border-cyber-400 transition-all transform active:scale-95 shadow-sm"
          title="Start 20-minute reading timer for this book"
        >
          <Clock className="w-3 h-3" />
          <span>⚡ 20m Timer</span>
        </button>

        {/* Quick Log Buttons (+10, +25) */}
        {book.status !== 'completed' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onQuickLog(book, 10)}
              className="px-2 py-1 rounded-xl bg-obsidian-850 hover:bg-cyber-500/20 text-slate-300 hover:text-cyan-300 font-mono font-bold text-[10px] border border-obsidian-750 transition-colors"
              title="Log 10 pages"
            >
              +10p
            </button>
            <button
              onClick={() => onQuickLog(book, 25)}
              className="px-2 py-1 rounded-xl bg-obsidian-850 hover:bg-cyber-500/20 text-slate-300 hover:text-cyan-300 font-mono font-bold text-[10px] border border-obsidian-750 transition-colors"
              title="Log 25 pages"
            >
              +25p
            </button>
          </div>
        )}

        <button
          onClick={() => onOpenDetails(book)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-obsidian-800 rounded-xl transition-colors"
          title="View full details & review"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
