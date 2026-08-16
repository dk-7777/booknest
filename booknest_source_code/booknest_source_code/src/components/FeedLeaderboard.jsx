import React, { useState } from 'react';
import { Users, Trophy, Flame, MessageSquare, Send, Sparkles, BookOpen, Clock, Heart, Award, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export default function FeedLeaderboard({
  activities,
  leaderboard,
  currentUser,
  onPostFeedComment
}) {
  const [newComment, setNewComment] = useState('');
  const [likedActivities, setLikedActivities] = useState({});

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    onPostFeedComment({
      userId: currentUser.id,
      details: newComment.trim()
    });
    setNewComment('');
  };

  const toggleLike = (actId) => {
    setLikedActivities(prev => ({
      ...prev,
      [actId]: !prev[actId]
    }));
  };

  const formatTimeAgo = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - d) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return 'Yesterday';
    return `${diffDay}d ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'LOG_SESSION':
        return <Zap className="w-3.5 h-3.5 text-cyber-400" />;
      case 'FINISHED_BOOK':
        return <Trophy className="w-3.5 h-3.5 text-cyan-300" />;
      case 'ADDED_WISHLIST':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'STARTED_BOOK':
        return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
      case 'USER_JOINED':
        return <Flame className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a0f1d] via-[#090d18] to-[#0a0f1d] p-6 rounded-3xl border border-cyber-500/25 shadow-glow-blue">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">Squad Hub & Social Feed</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyber-500/20 text-cyber-300 text-xs font-mono font-bold border border-cyber-500/40">
                {leaderboard.length} Locked In Readers ⚡
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Celebrate book completions, track your friend squad leaderboard, and drop reading updates.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Leaderboard & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Squad Leaderboard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#090d18] rounded-3xl p-5 sm:p-6 border border-obsidian-750 shadow-glass-card space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-750">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-cyber-400" />
                <h2 className="font-display font-bold text-base text-white">Squad Streak Scoreboard</h2>
              </div>
              <span className="text-[11px] text-cyber-400 font-mono font-semibold">2026 Race 🏆</span>
            </div>

            <div className="space-y-3">
              {leaderboard.map((friend, idx) => {
                const isCurrentUser = friend.id === currentUser?.id;
                const rankIcons = ['🥇', '🥈', '🥉'];
                const rankBadge = idx < 3 ? rankIcons[idx] : `#${idx + 1}`;

                return (
                  <div
                    key={friend.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrentUser
                        ? 'bg-cyber-500/10 border-cyber-500/40 shadow-glow-blue'
                        : 'bg-obsidian-900 border-obsidian-750 hover:border-obsidian-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-base font-bold font-mono w-6 text-center shrink-0">
                        {rankBadge}
                      </span>

                      <div className="relative shrink-0">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-10 h-10 rounded-full object-cover border border-cyber-500/30"
                        />
                        {friend.currentStreak > 0 && (
                          <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-cyber-400 text-obsidian-950 text-[9px] font-extrabold flex items-center">
                            ⚡
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white truncate">{friend.name}</span>
                          {isCurrentUser && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyber-500/20 text-cyber-300 font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                          <span className="text-cyber-400 font-bold">{friend.currentStreak}d streak</span>
                          <span>•</span>
                          <span className="text-emerald-400">{friend.completedThisYear} read</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-[11px] font-mono text-slate-200 font-bold">
                        {friend.totalPages.toLocaleString()} pgs
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {friend.bio ? friend.bio.slice(0, 20) + '...' : 'Reader'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right: Live Squad Activity Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#090d18] rounded-3xl p-6 border border-obsidian-750 shadow-glass-card space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-750">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h2 className="font-display font-bold text-base text-white">Live Squad Activity Stream</h2>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-glow-cyan" />
                Real-Time
              </span>
            </div>

            {/* Post Note */}
            <form onSubmit={handleSendComment} className="flex gap-2">
              <input
                type="text"
                placeholder={currentUser ? `Drop a reading update as ${currentUser.name.split(' ')[0]}...` : "Drop an update..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyber-400 to-cyber-500 hover:from-cyan-300 hover:to-cyber-400 disabled:opacity-50 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            {/* Stream */}
            <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
              {activities.map(act => {
                const isLiked = likedActivities[act.id];
                return (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl bg-obsidian-900/80 border border-obsidian-750 hover:border-cyber-500/30 transition-all flex gap-3.5"
                  >
                    <div className="shrink-0">
                      <img
                        src={act.user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                        alt={act.user?.name || "Friend"}
                        className="w-10 h-10 rounded-full object-cover border border-cyber-500/30"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">{act.user?.name || "Friend"}</span>
                          <span className="p-1 rounded-full bg-obsidian-800 border border-obsidian-700">
                            {getActivityIcon(act.type)}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {formatTimeAgo(act.timestamp)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {act.details}
                      </p>

                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          onClick={() => toggleLike(act.id)}
                          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                            isLiked
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-glow-cyan'
                              : 'bg-obsidian-850 text-slate-400 hover:text-white border border-obsidian-750'
                          }`}
                        >
                          <Zap className={`w-3 h-3 ${isLiked ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                          <span>{isLiked ? 'Hyped! ⚡' : 'Hype'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
