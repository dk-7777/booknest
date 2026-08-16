import React, { useState } from 'react';
import { Flame, Calendar, Award, Trophy, Zap, Sparkles, CheckCircle2, Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export default function StreakCalendar({ stats, currentUser, onOpenLogModal }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  if (!stats) {
    return (
      <div className="bg-[#090d18] rounded-3xl p-8 border border-obsidian-750 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyber-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-slate-400 mt-2">Loading reading streak engine...</p>
      </div>
    );
  }

  const {
    currentStreak = 0,
    longestStreak = 0,
    daysReadThisMonth = 0,
    dayOfMonth = 15,
    monthConsistencyPercent = 0,
    daysReadThisYear = 0,
    totalPages = 0,
    totalMinutes = 0,
    hasLoggedToday = false,
    heatmap = [],
    badges = []
  } = stats;

  const getIntensityColor = (level) => {
    switch (level) {
      case 4:
        return 'bg-cyan-300 shadow-glow-cyan border-white';
      case 3:
        return 'bg-cyber-400 shadow-glow-blue border-cyber-300';
      case 2:
        return 'bg-blue-600 border-blue-500';
      case 1:
        return 'bg-blue-950 border-blue-900';
      default:
        return 'bg-obsidian-900 border-obsidian-800 hover:border-cyber-500/40';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Streak Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1326] via-[#090d18] to-[#070911] p-6 sm:p-8 rounded-3xl border border-cyber-500/30 shadow-glow-blue">
        
        {/* Neon blue ambient glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Main Streak Counter */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-cyber-500 to-cyan-300 p-1 shadow-glow-cyan flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-obsidian-950 rounded-[22px] flex flex-col items-center justify-center relative">
                <span className="text-2xl sm:text-3xl cyber-fire-animated">⚡🔥</span>
                <span className="font-mono font-extrabold text-xs sm:text-sm text-cyber-300 mt-0.5">
                  {currentStreak}d
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                  {currentStreak > 0 ? `${currentStreak}-Day Reading Streak!` : 'Start Your Streak Era!'}
                </h1>
                {hasLoggedToday && (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    Locked In Today ⚡
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {hasLoggedToday
                  ? "Flawless consistency! You've locked in your reading session for today."
                  : "Streak is waiting! Log a quick reading session before midnight to keep your fire lit."}
              </p>

              {/* Action */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={onOpenLogModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-glow-cyan transition-all transform active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  <span>+ Log Today's Reading</span>
                </button>
                <span className="text-xs text-slate-400 font-mono">
                  Record: <strong className="text-cyber-400 font-bold">{longestStreak} days</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 shrink-0">
            <div className="bg-obsidian-900 border border-obsidian-750 p-3.5 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-cyber-400" />
                <span>Monthly Rate</span>
              </div>
              <div className="mt-1 text-lg font-bold font-mono text-white">
                {daysReadThisMonth} / {dayOfMonth} <span className="text-xs text-cyan-400">({monthConsistencyPercent}%)</span>
              </div>
            </div>

            <div className="bg-obsidian-900 border border-obsidian-750 p-3.5 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Total Pages</span>
              </div>
              <div className="mt-1 text-lg font-bold font-mono text-white">
                {totalPages.toLocaleString()}
              </div>
            </div>

            <div className="bg-obsidian-900 border border-obsidian-750 p-3.5 rounded-2xl col-span-2 sm:col-span-1 lg:col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Time Locked In</span>
              </div>
              <div className="mt-1 text-lg font-bold font-mono text-white">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* GitHub-style Activity Heatmap Matrix */}
      <div className="bg-[#090d18] rounded-3xl p-6 border border-obsidian-750 shadow-glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-obsidian-750">
          <div>
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyber-400" />
              <span>Consistency Heatmap Matrix</span>
            </h2>
            <p className="text-xs text-slate-400">
              Cyber grid tracking daily reading velocity. Hover to view reflections and pages logged.
            </p>
          </div>

          {/* Intensity Legend */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-[11px] font-mono">Chilling</span>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-sm bg-obsidian-900 border border-obsidian-800" title="0 pgs" />
              <div className="w-3.5 h-3.5 rounded-sm bg-blue-950 border border-blue-900" title="1-15 pgs" />
              <div className="w-3.5 h-3.5 rounded-sm bg-blue-600 border border-blue-500" title="16-30 pgs" />
              <div className="w-3.5 h-3.5 rounded-sm bg-cyber-400 shadow-glow-blue border border-cyber-300" title="31-50 pgs" />
              <div className="w-3.5 h-3.5 rounded-sm bg-cyan-300 shadow-glow-cyan" title="50+ pgs" />
            </div>
            <span className="text-[11px] font-mono">Locked In ⚡</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-3 pt-2 no-scrollbar">
          <div className="min-w-[700px]">
            <div className="flex flex-wrap gap-1.5">
              {heatmap.map((cell, idx) => {
                const colorClass = getIntensityColor(cell.level);
                return (
                  <div
                    key={cell.date || idx}
                    onMouseEnter={() => setHoveredDay(cell)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-4 h-4 rounded-sm border cursor-pointer heatmap-cell ${colorClass}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Hovered Day Tooltip Card */}
        <div className="min-h-[48px] bg-obsidian-900 rounded-2xl p-3.5 border border-obsidian-750 flex items-center justify-between text-xs text-slate-300">
          {hoveredDay ? (
            <div className="flex items-center justify-between w-full flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyber-400" />
                <span className="font-mono font-bold text-white">{hoveredDay.date}</span>
                <span>•</span>
                <span className="font-bold text-cyan-300">
                  {hoveredDay.pages > 0 ? `${hoveredDay.pages} pages logged` : 'No session recorded'}
                </span>
                {hoveredDay.minutes > 0 && (
                  <span className="text-slate-400 font-mono">({hoveredDay.minutes} mins)</span>
                )}
              </div>
              {hoveredDay.notes && hoveredDay.notes.length > 0 && (
                <div className="italic text-slate-400 truncate max-w-md">
                  "{hoveredDay.notes[0]}"
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 text-xs italic font-mono">
              Hover over any square in the cyber matrix to view session stats.
            </div>
          )}
        </div>

      </div>

      {/* Badges & Achievements */}
      <div className="bg-[#090d18] rounded-3xl p-6 border border-obsidian-750 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-obsidian-750">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-cyber-400" />
            <h2 className="text-lg font-bold font-display text-white">Squad Badges & Trophies</h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyber-500/20 text-cyber-300 border border-cyber-500/40 font-bold">
            {badges.filter(b => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map(badge => {
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                  badge.unlocked
                    ? 'bg-cyber-500/10 border-cyber-500/40 shadow-glow-blue'
                    : 'bg-obsidian-900 border-obsidian-800 opacity-40 grayscale'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="font-bold text-xs text-white">{badge.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">{badge.desc}</p>
                <span className={`mt-2 text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  badge.unlocked ? 'bg-cyber-500/20 text-cyber-300' : 'bg-obsidian-800 text-slate-500'
                }`}>
                  {badge.unlocked ? 'Unlocked ⚡' : 'Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
