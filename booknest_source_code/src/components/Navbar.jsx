import React, { useState } from 'react';
import { BookOpen, Flame, Plus, Sparkles, Trophy, Bookmark, BarChart3, Clock, Users, Gift, LogOut, Link2, Check, User, Share2, Code, Zap } from 'lucide-react';

export default function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenTimerModal,
  onOpenAddBookModal,
  onOpenShareModal
}) {
  const navItems = [
    { id: 'library', label: 'My Shelf', icon: BookOpen },
    { id: 'history', label: 'Reading Era', icon: Clock },
    { id: 'wishlist', label: 'TBR Wishlist', icon: Gift },
    { id: 'streaks', label: 'Streaks ⚡', icon: Flame, badge: currentUser?.stats?.currentStreak ? `${currentUser.stats.currentStreak}d` : null },
    { id: 'analytics', label: 'Insights', icon: BarChart3 },
    { id: 'feed', label: 'Squad Feed', icon: Users }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070a12]/95 backdrop-blur-xl border-b border-cyber-500/20 shadow-glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-glow-cyan border border-cyber-400/40 p-0.5 bg-obsidian-950">
              <img
                src="/logo.png"
                alt="BookNest Logo"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-white gradient-text-cyan">BookNest</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-cyber-500/20 text-cyber-300 border border-cyber-500/40 font-bold">2026 ⚡</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Read • Track • Connect</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all relative ${
                    isActive
                      ? 'bg-cyber-500/20 text-cyber-300 shadow-glow-blue border border-cyber-500/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-obsidian-850'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyber-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyber-500/30 text-cyber-300 border border-cyber-400/50 font-bold font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Section: Actions & Share & Profile */}
          <div className="flex items-center gap-2">
            
            {/* Prominent Share App Button */}
            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/30 via-cyber-500/30 to-cyan-400/30 border border-cyber-400/50 hover:border-cyan-300 text-cyan-300 text-xs font-mono font-bold shadow-glow-blue transition-all transform active:scale-95"
              title="Share app with friends worldwide or scan QR code"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>🔗 Share App</span>
            </button>

            {/* Live 20-Min Reading Timer Trigger */}
            <button
              onClick={onOpenTimerModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-extrabold text-xs shadow-glow-cyan transition-all transform active:scale-95 shrink-0"
              title="Start real 20-minute reading timer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">⚡ Start 20m Timer</span>
              <span className="sm:hidden">⚡ 20m</span>
            </button>

            {/* Quick Add Book */}
            <button
              onClick={onOpenAddBookModal}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-200 text-xs font-medium border border-obsidian-750 hover:border-cyber-500/40 transition-all"
              title="Add book to library"
            >
              <Plus className="w-3.5 h-3.5 text-cyber-400" />
              <span>Add Book</span>
            </button>

            {/* Active User Profile & Logout */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-1 border-l border-obsidian-750">
                <div className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-2xl bg-obsidian-900 border border-cyber-500/30">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-cyber-400/60"
                  />
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-bold text-white leading-none">
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-cyber-400 font-mono font-semibold mt-0.5">
                      {currentUser.stats?.currentStreak || 0}d streak 🔥
                    </div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-xl bg-obsidian-850 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-obsidian-750 hover:border-rose-500/40 transition-all"
                  title="Sign out of your account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="xl:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-obsidian-750 no-scrollbar gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-cyber-500/20 text-cyber-300 border border-cyber-500/40 shadow-glow-blue'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1 rounded-full bg-cyber-500/30 text-cyber-300 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
