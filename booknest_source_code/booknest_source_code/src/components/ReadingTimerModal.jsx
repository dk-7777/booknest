import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Square, Flame, BookOpen, Clock, CheckCircle2, RotateCcw, Volume2, VolumeX, Sparkles, Zap, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReadingTimerModal({
  isOpen,
  onClose,
  books,
  currentUser,
  onSubmitLog,
  initialBook = null
}) {
  if (!isOpen) return null;

  // Selected Book
  const [selectedBookId, setSelectedBookId] = useState(
    initialBook?.id || books.find(b => b.status === 'currently_reading')?.id || books[0]?.id || ''
  );
  const selectedBook = books.find(b => b.id === selectedBookId);

  // Timer Duration Presets (in minutes)
  const [targetDurationMinutes, setTargetDurationMinutes] = useState(20);
  const [secondsRemaining, setSecondsRemaining] = useState(20 * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Post-session page inputs
  const [startPage, setStartPage] = useState(selectedBook ? selectedBook.currentPage : 0);
  const [endPage, setEndPage] = useState(selectedBook ? selectedBook.currentPage + 15 : 15);
  const [sessionNote, setSessionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interval Ref
  const timerRef = useRef(null);

  // Update starting page when book changes
  useEffect(() => {
    if (selectedBook) {
      setStartPage(selectedBook.currentPage);
      setEndPage(Math.min(selectedBook.currentPage + 15, selectedBook.totalPages));
    }
  }, [selectedBookId, selectedBook]);

  // Timer Countdown Logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (!isActive && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  // Synthesize a pleasant chime using Web Audio API
  const playChimeSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.5); // D6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch (e) {
      console.warn("Audio playback not allowed:", e);
    }
  };

  const handleStartTimer = (mins) => {
    const duration = mins || targetDurationMinutes;
    setTargetDurationMinutes(duration);
    setSecondsRemaining(duration * 60);
    setElapsedSeconds(0);
    setIsActive(true);
    setIsFinished(false);
  };

  const handlePauseResume = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsFinished(false);
    setSecondsRemaining(targetDurationMinutes * 60);
    setElapsedSeconds(0);
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    setIsFinished(true);
    playChimeSound();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#38bdf8', '#2563eb', '#818cf8']
    });
  };

  const handleManualFinish = () => {
    setIsActive(false);
    setIsFinished(true);
    playChimeSound();
  };

  // Format mm:ss
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Total elapsed minutes (at least 1 min if tested briefly)
  const actualMinutesRead = Math.max(Math.round(elapsedSeconds / 60), 1);
  const totalPagesRead = Math.max(Number(endPage) - Number(startPage), 0);

  // Submit Verified Session
  const handleSaveVerifiedSession = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitLog({
        userId: currentUser.id,
        bookId: selectedBookId || null,
        pagesRead: totalPagesRead,
        minutesRead: actualMinutesRead,
        date: new Date().toISOString().split('T')[0],
        note: sessionNote.trim() || `Verified ${actualMinutesRead}-min reading session (p.${startPage} → p.${endPage})`
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#00f2fe', '#38bdf8', '#2563eb', '#10b981']
      });

      onClose();
    } catch (err) {
      alert("Error saving session: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Circular progress calculation
  const totalTargetSecs = targetDurationMinutes * 60;
  const progressFraction = totalTargetSecs > 0 ? (totalTargetSecs - secondsRemaining) / totalTargetSecs : 0;
  const strokeDashoffset = 440 - (440 * progressFraction);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#090d18] border border-cyber-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-glow-blue relative overflow-hidden">
        
        {/* Ambient Neon Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-56 h-56 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-obsidian-750">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyber-500/15 text-cyber-400 border border-cyber-500/30 shadow-glow-blue">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Live Reading Timer</h2>
              <p className="text-xs text-slate-400">Lock in your 20-minute focus session & track true pages</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-cyber-300 hover:bg-obsidian-800 transition-colors"
              title={soundEnabled ? "Sound Chime On" : "Sound Muted"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isFinished ? (
          /* Active / Setup Timer Screen */
          <div className="mt-5 space-y-5">
            
            {/* Book Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyber-400" />
                <span>Reading Book:</span>
              </label>
              <select
                disabled={isActive}
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white focus:outline-none focus:border-cyber-400 disabled:opacity-60"
              >
                {books.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} (Currently at p.{b.currentPage}/{b.totalPages})
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Preset Selector */}
            {!isActive && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Timer Duration:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 20, 25, 30].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handleStartTimer(mins)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold font-mono transition-all ${
                        targetDurationMinutes === mins
                          ? 'bg-cyber-500 text-obsidian-950 shadow-glow-cyan'
                          : 'bg-obsidian-900 text-slate-300 hover:bg-obsidian-850 border border-obsidian-750'
                      }`}
                    >
                      {mins === 20 ? '⚡ 20m' : `${mins}m`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Circular Timer Visual Display */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-52 h-52 flex items-center justify-center">
                
                {/* SVG Progress Ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    className="stroke-obsidian-850"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    className="stroke-cyber-400 transition-all duration-1000 ease-linear"
                    strokeWidth="8"
                    strokeDasharray="440"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Center Time Counter */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-wider">
                    {formatTime(secondsRemaining)}
                  </span>
                  <span className="text-xs font-mono font-bold text-cyber-400 mt-1 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-cyber-400 animate-pulse" />
                    <span>{isActive ? 'Session Active' : 'Ready to Read'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                    Elapsed: {formatTime(elapsedSeconds)}
                  </span>
                </div>

              </div>
            </div>

            {/* Main Timer Action Controls */}
            <div className="flex items-center gap-3 pt-2">
              {!isActive && elapsedSeconds === 0 ? (
                <button
                  type="button"
                  onClick={() => handleStartTimer(targetDurationMinutes)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-extrabold text-xs shadow-glow-cyan transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start 20-Min Reading Session ▶️</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handlePauseResume}
                    className="flex-1 py-3 px-4 rounded-2xl bg-obsidian-850 hover:bg-obsidian-800 text-white font-bold text-xs border border-obsidian-750 transition-all flex items-center justify-center gap-2"
                  >
                    {isActive ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pause Session</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current text-cyber-400" />
                        <span>Resume Session</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleManualFinish}
                    className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-obsidian-950 font-bold text-xs shadow-glow-cyan transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Finish & Record Pages</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-3 rounded-2xl bg-obsidian-900 hover:bg-obsidian-850 text-slate-400 hover:text-white border border-obsidian-750 transition-colors shrink-0"
                    title="Reset timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

          </div>
        ) : (
          /* Post-Session Verification & Page Logger Screen */
          <form onSubmit={handleSaveVerifiedSession} className="mt-5 space-y-4 animate-in fade-in duration-300">
            
            {/* Completion Banner */}
            <div className="bg-gradient-to-r from-cyber-500/20 via-cyan-500/10 to-blue-600/20 p-4 rounded-2xl border border-cyber-500/40 text-center">
              <span className="text-2xl block mb-1">🎉⚡</span>
              <h3 className="font-display font-extrabold text-lg text-white">
                Reading Session Completed!
              </h3>
              <p className="text-xs text-cyber-300 font-mono mt-0.5">
                Real Focus Time Logged: <strong>{actualMinutesRead} minutes</strong>
              </p>
            </div>

            {/* Page Count Inputs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pages Read During This Session:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-mono block mb-1">Starting Page:</span>
                  <input
                    type="number"
                    min="0"
                    value={startPage}
                    onChange={(e) => setStartPage(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs font-mono text-white focus:outline-none focus:border-cyber-400"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-mono block mb-1">Ending Page:</span>
                  <input
                    type="number"
                    min={startPage}
                    value={endPage}
                    onChange={(e) => setEndPage(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs font-mono text-white focus:outline-none focus:border-cyber-400"
                  />
                </div>
              </div>

              {/* Calculated Velocity Banner */}
              <div className="mt-2.5 p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-750 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Total Read:</span>
                <span className="font-bold text-cyber-400">
                  +{totalPagesRead} pages (~{(totalPagesRead / (actualMinutesRead || 1)).toFixed(2)} pgs/min) 🔥
                </span>
              </div>
            </div>

            {/* Session Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Session Reflection / Notes (Optional)
              </label>
              <textarea
                rows="2"
                value={sessionNote}
                onChange={(e) => setSessionNote(e.target.value)}
                placeholder="Key takeaways or quotes from this 20-min reading sprint..."
                className="w-full px-3.5 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400 resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsFinished(false)}
                className="px-4 py-3 rounded-2xl bg-obsidian-850 text-slate-300 text-xs font-semibold hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || totalPagesRead < 0}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-extrabold text-xs shadow-glow-cyan transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving Activity...' : 'Save Activity & Boost Streak 🔥⚡'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
