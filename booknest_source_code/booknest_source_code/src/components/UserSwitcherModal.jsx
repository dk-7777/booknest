import React from 'react';
import { X, Check, Flame, BookOpen, Target, Sparkles, UserPlus, Zap } from 'lucide-react';

export default function UserSwitcherModal({ isOpen, onClose, users, currentUser, onSelectUser, onOpenAuthModal }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#090d18] border border-cyber-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-glow-blue relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-cyber-500/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-750">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyber-500/10 text-cyber-400 border border-cyber-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Switch Squad Profile</h2>
              <p className="text-xs text-slate-400">View or log as any active friend in your reading circle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User List */}
        <div className="mt-4 space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {users.map(user => {
            const isSelected = currentUser?.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-cyber-500/15 border-cyber-400 shadow-glow-blue'
                    : 'bg-obsidian-900 border-obsidian-750 hover:border-cyber-500/40 hover:bg-obsidian-850'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-cyber-500/40"
                    />
                    {user.currentStreak > 0 && (
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-cyber-400 text-obsidian-950 text-[10px] font-extrabold flex items-center gap-0.5">
                        ⚡ {user.currentStreak}d
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white truncate">{user.name}</h3>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.2 rounded-full bg-cyber-500/25 text-cyber-300 border border-cyber-400/40 font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{user.bio}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-300 font-mono">
                      <span className="flex items-center gap-1 text-cyber-400">
                        <Target className="w-3 h-3" />
                        <span>Goal: {user.readingGoalYear}</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <BookOpen className="w-3 h-3" />
                        <span>{user.completedBooksCount || 0} completed</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {isSelected ? (
                    <div className="w-7 h-7 rounded-full bg-cyber-400 text-obsidian-950 flex items-center justify-center font-bold shadow-glow-blue">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <button className="text-xs font-semibold px-3 py-1 rounded-xl bg-obsidian-800 text-slate-300 hover:text-white hover:bg-obsidian-750 transition-colors border border-obsidian-700">
                      Switch
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Add New Friend CTA */}
        <div className="mt-5 pt-3.5 border-t border-obsidian-750 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Have a new friend joining?
          </p>
          <button
            onClick={() => {
              onClose();
              onOpenAuthModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-500/20 text-cyber-300 border border-cyber-500/40 hover:bg-cyber-500/30 text-xs font-bold transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add New Friend</span>
          </button>
        </div>

      </div>
    </div>
  );
}
