import React, { useState } from 'react';
import { X, Flame, BookOpen, Clock, Calendar, Check, Sparkles, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LogReadingModal({
  isOpen,
  onClose,
  books,
  currentUser,
  onSubmitLog,
  initialBook = null
}) {
  if (!isOpen) return null;

  const [selectedBookId, setSelectedBookId] = useState(initialBook ? initialBook.id : (books.find(b => b.status === 'currently_reading')?.id || ''));
  const [pagesRead, setPagesRead] = useState('25');
  const [minutesRead, setMinutesRead] = useState('30');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBook = books.find(b => b.id === selectedBookId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pagesRead && !minutesRead) return;

    setIsSubmitting(true);
    try {
      const res = await onSubmitLog({
        userId: currentUser.id,
        bookId: selectedBookId || null,
        pagesRead: Number(pagesRead) || 0,
        minutesRead: Number(minutesRead) || 0,
        date: sessionDate,
        note: note.trim()
      });

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#38bdf8', '#2563eb', '#818cf8']
      });

      onClose();
    } catch (err) {
      alert("Failed to log reading session: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#090d18] border border-cyber-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-glow-blue relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-750">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyber-500/10 text-cyber-400 border border-cyber-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Log Reading Session</h2>
              <p className="text-xs text-slate-400">Lock in your streak and track pages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Book Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyber-400" />
              <span>Select Book from Library</span>
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white focus:outline-none focus:border-cyber-400"
            >
              <option value="">General Reading (No specific book)</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.currentPage}/{b.totalPages} pgs) — {b.status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Dual Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Pages Read</span>
              </label>
              <input
                type="number"
                min="0"
                max="2000"
                value={pagesRead}
                onChange={(e) => setPagesRead(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-sm font-mono text-white focus:outline-none focus:border-cyber-400"
                placeholder="e.g. 25"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Minutes Spent</span>
              </label>
              <input
                type="number"
                min="0"
                max="1440"
                value={minutesRead}
                onChange={(e) => setMinutesRead(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-sm font-mono text-white focus:outline-none focus:border-cyber-400"
                placeholder="e.g. 30"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Session Date</span>
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white focus:outline-none focus:border-cyber-400 font-mono"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Quick Reflection / Session Drop (Optional)
            </label>
            <textarea
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., The plot twist at Chapter 10 went crazy!"
              className="w-full px-3.5 py-2 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || (!pagesRead && !minutesRead)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-glow-cyan transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{isSubmitting ? 'Logging...' : 'Save & Boost Streak 🔥⚡'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
