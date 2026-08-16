import React, { useState } from 'react';
import { X, Star, BookOpen, Quote, Calendar, Trash2, CheckCircle2, Save, Sparkles, Layers, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookDetailsModal({
  isOpen,
  onClose,
  book,
  onUpdateBook,
  onDeleteBook
}) {
  if (!isOpen || !book) return null;

  const [currentPage, setCurrentPage] = useState(book.currentPage || 0);
  const [totalPages, setTotalPages] = useState(book.totalPages || 300);
  const [status, setStatus] = useState(book.status || 'currently_reading');
  const [rating, setRating] = useState(book.rating || 5);
  const [review, setReview] = useState(book.review || '');
  const [favoriteQuote, setFavoriteQuote] = useState(book.favoriteQuote || '');
  const [notes, setNotes] = useState(book.notes || '');
  const [finishDate, setFinishDate] = useState(book.finishDate || (book.status === 'completed' ? new Date().toISOString().split('T')[0] : ''));
  const [isSaving, setIsSaving] = useState(false);

  const progressPercent = totalPages > 0 ? Math.min(Math.round((currentPage / totalPages) * 100), 100) : 0;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = {
        currentPage: Number(currentPage),
        totalPages: Number(totalPages),
        status,
        rating: status === 'completed' ? Number(rating) : null,
        review: review.trim(),
        favoriteQuote: favoriteQuote.trim(),
        notes: notes.trim(),
        finishDate: status === 'completed' ? (finishDate || new Date().toISOString().split('T')[0]) : null
      };

      if (status === 'completed' && book.status !== 'completed') {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#38bdf8', '#2563eb', '#818cf8']
        });
      }

      await onUpdateBook(book.id, updates);
      onClose();
    } catch (err) {
      alert("Error saving updates: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}" from your library?`)) {
      await onDeleteBook(book.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#090d18] border border-cyber-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-glow-blue relative overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-750">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyber-500/20 text-cyber-300 border border-cyber-500/40 font-bold">
              Book Details & Review
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Overview Banner */}
        <div className="mt-5 flex flex-col sm:flex-row gap-5 items-start">
          
          <div className="shrink-0 w-32 h-44 rounded-2xl overflow-hidden book-spine-effect shadow-xl border border-obsidian-700 bg-obsidian-950 mx-auto sm:mx-0">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-cyber-300 font-mono font-medium px-2 py-0.5 rounded-lg bg-obsidian-850 border border-obsidian-750">
                {book.genre}
              </span>
              <span className="text-[11px] text-blue-400 font-mono font-medium px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
                {book.format}
              </span>
            </div>

            <h2 className="mt-2 font-display font-bold text-xl sm:text-2xl text-white leading-tight">
              {book.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">by <strong className="text-slate-200">{book.author}</strong></p>

            {/* Reading Progress Slider */}
            <div className="mt-4 bg-obsidian-900 p-3.5 rounded-2xl border border-obsidian-750">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-mono">
                  Progress: <strong className="text-cyber-400">{currentPage}</strong> / {totalPages} pages
                </span>
                <span className="font-mono font-bold text-cyber-400 text-xs">{progressPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentPage(val);
                  if (val >= totalPages && status !== 'completed') {
                    setStatus('completed');
                    if (!finishDate) setFinishDate(new Date().toISOString().split('T')[0]);
                  }
                }}
                className="w-full h-2 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-cyber-400"
              />
            </div>
          </div>

        </div>

        {/* Status & Rating */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Shelf Status</label>
            <select
              value={status}
              onChange={(e) => {
                const s = e.target.value;
                setStatus(s);
                if (s === 'completed') {
                  setCurrentPage(totalPages);
                  if (!finishDate) setFinishDate(new Date().toISOString().split('T')[0]);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white focus:outline-none focus:border-cyber-400"
            >
              <option value="currently_reading">Reading Now ⚡</option>
              <option value="completed">Completed 🎉</option>
              <option value="on_hold">On Hold ⏸️</option>
              <option value="unread">TBR Stack ⏳</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Personal Rating {status !== 'completed' && <span className="text-slate-500 font-normal">(if finished)</span>}
            </label>
            <div className="flex items-center gap-2 bg-obsidian-900 border border-obsidian-750 px-3.5 py-2 rounded-2xl">
              <div className="flex items-center text-cyber-400 gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 transition-transform hover:scale-110 ${
                        star <= rating
                          ? 'fill-cyber-400 text-cyber-400'
                          : 'text-obsidian-700 hover:text-cyan-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="font-mono font-bold text-xs text-cyber-400 ml-auto">
                {rating.toFixed(1)} / 5.0
              </span>
            </div>
          </div>

        </div>

        {/* Finished Date */}
        {status === 'completed' && (
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Completion Date</span>
            </label>
            <input
              type="date"
              value={finishDate}
              onChange={(e) => setFinishDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
        )}

        {/* Favorite Quote */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5 text-cyber-400" />
            <span>Favorite Highlight / Quote</span>
          </label>
          <input
            type="text"
            value={favoriteQuote}
            onChange={(e) => setFavoriteQuote(e.target.value)}
            placeholder="e.g. The sky above the port was the color of television..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs italic text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyber-400"
          />
        </div>

        {/* Personal Review */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Personal Review & Key Takeaways
          </label>
          <textarea
            rows="3"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Drop your honest review and thoughts on the read..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400 resize-none leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-obsidian-750 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-rose-400 hover:text-white hover:bg-rose-500/20 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Read</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-obsidian-850 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-glow-cyan transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Updates'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
