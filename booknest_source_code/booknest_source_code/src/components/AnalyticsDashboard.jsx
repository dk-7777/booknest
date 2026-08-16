import React from 'react';
import { BarChart3, PieChart, Target, BookOpen, Clock, Layers, TrendingUp, Sparkles, Award, Zap } from 'lucide-react';

export default function AnalyticsDashboard({ stats, currentUser, books }) {
  if (!stats) {
    return (
      <div className="bg-[#090d18] rounded-3xl p-8 border border-obsidian-750 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyber-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-slate-400 mt-2">Crunching reading insights...</p>
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
    completedBooksCount = 0,
    completedThisYearCount = 0,
    monthlyChartData = [],
    genreData = [],
    formatCount = { Physical: 0, "E-Book": 0, Audiobook: 0 }
  } = stats;

  const readingGoalYear = currentUser?.readingGoalYear || 25;
  const goalProgressPercent = Math.min(Math.round((completedThisYearCount / readingGoalYear) * 100), 100);

  const maxMonthlyPages = Math.max(...monthlyChartData.map(d => d.pages), 100);

  const genreColors = [
    '#38bdf8', '#00f2fe', '#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'
  ];

  const totalFormatCount = Object.values(formatCount).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0a0f1d] via-[#090d18] to-[#0a0f1d] p-6 rounded-3xl border border-cyber-500/25 shadow-glow-blue">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">Reading Insights & Velocity</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyber-500/20 text-cyber-300 text-xs font-mono font-bold border border-cyber-500/40">
                2026 Season ⚡
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Deep dive into reading consistency, genre taste, multimodal formats, and pace.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-obsidian-900 px-4 py-2.5 rounded-2xl border border-obsidian-750">
            <Target className="w-4 h-4 text-cyber-400" />
            <span>2026 Target: <strong className="text-white font-bold">{completedThisYearCount}</strong> / {readingGoalYear} books ({goalProgressPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-[#090d18] p-5 rounded-3xl border border-obsidian-750 shadow-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">2026 Reading Target</span>
            <Target className="w-4 h-4 text-cyber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">{completedThisYearCount}</span>
            <span className="text-xs text-slate-400 font-mono">/ {readingGoalYear} books</span>
          </div>
          <div className="mt-3 w-full h-2 bg-obsidian-950 rounded-full overflow-hidden border border-obsidian-750">
            <div className="h-full bg-gradient-to-r from-blue-600 via-cyber-500 to-cyan-300 rounded-full shadow-glow-blue" style={{ width: `${goalProgressPercent}%` }} />
          </div>
          <p className="text-[11px] text-cyber-400 mt-2 font-mono">{goalProgressPercent}% locked in</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#090d18] p-5 rounded-3xl border border-obsidian-750 shadow-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Monthly Consistency</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-cyan-300">{monthConsistencyPercent}%</span>
            <span className="text-xs text-slate-400 font-mono">active days</span>
          </div>
          <div className="mt-3 w-full h-2 bg-obsidian-950 rounded-full overflow-hidden border border-obsidian-750">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full shadow-glow-cyan" style={{ width: `${monthConsistencyPercent}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">{daysReadThisMonth} active days out of {dayOfMonth}</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#090d18] p-5 rounded-3xl border border-obsidian-750 shadow-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Pages Devoured</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">{totalPages.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-mono">pages</span>
          </div>
          <p className="text-xs text-slate-400 mt-4 font-mono">
            Avg ~{Math.round(totalPages / (daysReadThisYear || 1))} pgs / active day
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#090d18] p-5 rounded-3xl border border-obsidian-750 shadow-glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold">Total Focus Time</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white">{Math.floor(totalMinutes / 60)}h</span>
            <span className="text-sm font-mono text-purple-300">{totalMinutes % 60}m</span>
          </div>
          <p className="text-xs text-slate-400 mt-4 font-mono">
            Avg ~{Math.round(totalMinutes / (daysReadThisYear || 1))} mins / session
          </p>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Velocity Bar Chart */}
        <div className="lg:col-span-2 bg-[#090d18] p-6 rounded-3xl border border-obsidian-750 shadow-glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyber-400" />
                <span>Monthly Reading Velocity (2026)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Pages read per calendar month</p>
            </div>
            <span className="text-xs font-mono text-cyber-300 bg-cyber-500/10 px-2.5 py-1 rounded-xl border border-cyber-500/30">
              Active Velocity ⚡
            </span>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-4 px-2">
            {monthlyChartData.map((item) => {
              const heightPercent = maxMonthlyPages > 0 ? Math.max(Math.round((item.pages / maxMonthlyPages) * 100), item.pages > 0 ? 8 : 2) : 2;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold bg-obsidian-950 text-cyan-300 px-1.5 py-0.5 rounded-lg border border-obsidian-700 shadow-glow-blue pointer-events-none whitespace-nowrap -mb-1">
                    {item.pages} pgs
                  </div>
                  <div className="w-full max-w-[28px] bg-obsidian-900 rounded-t-xl overflow-hidden flex flex-col justify-end transition-all group-hover:bg-obsidian-800">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 via-cyber-500 to-cyan-300 rounded-t-xl transition-all duration-700 shadow-glow-blue"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-cyber-300">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Format Split */}
        <div className="bg-[#090d18] p-6 rounded-3xl border border-obsidian-750 shadow-glass-card flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Format Split</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Physical books vs Digital vs Audio</p>
          </div>

          <div className="space-y-4 my-auto">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">Physical Book 📖</span>
                <span className="font-mono text-cyber-400 font-bold">
                  {formatCount.Physical || 0} books ({Math.round(((formatCount.Physical || 0) / totalFormatCount) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-obsidian-950 rounded-full overflow-hidden border border-obsidian-750">
                <div
                  className="h-full bg-cyber-400 rounded-full shadow-glow-blue"
                  style={{ width: `${Math.round(((formatCount.Physical || 0) / totalFormatCount) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">E-Book (Kindle/EPUB) 📱</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {formatCount['E-Book'] || 0} books ({Math.round(((formatCount['E-Book'] || 0) / totalFormatCount) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-obsidian-950 rounded-full overflow-hidden border border-obsidian-750">
                <div
                  className="h-full bg-cyan-400 rounded-full shadow-glow-cyan"
                  style={{ width: `${Math.round(((formatCount['E-Book'] || 0) / totalFormatCount) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">Audiobook 🎧</span>
                <span className="font-mono text-purple-400 font-bold">
                  {formatCount.Audiobook || 0} books ({Math.round(((formatCount.Audiobook || 0) / totalFormatCount) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-obsidian-950 rounded-full overflow-hidden border border-obsidian-750">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.round(((formatCount.Audiobook || 0) / totalFormatCount) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-obsidian-850 p-3 rounded-2xl border border-obsidian-750 text-[11px] text-slate-400 text-center font-mono">
            Multimodal reading keeps momentum active anywhere ⚡
          </div>
        </div>

      </div>

      {/* Genre Distribution Grid */}
      <div className="bg-[#090d18] p-6 rounded-3xl border border-obsidian-750 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-400" />
              <span>Genre Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Explore your literary curiosity across categories</p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {genreData.length} unique genres
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {genreData.map((genre, idx) => {
            const color = genreColors[idx % genreColors.length];
            return (
              <div key={genre.name} className="bg-obsidian-900 border border-obsidian-750 p-4 rounded-2xl flex items-center justify-between hover:border-cyber-500/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color }} />
                  <div>
                    <div className="text-xs font-bold text-white">{genre.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{genre.count} books</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-xs text-cyber-300 bg-obsidian-800 px-2 py-0.5 rounded-lg">
                  {genre.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
