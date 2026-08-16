import React, { useState, useMemo } from 'react';
import { Gift, Plus, ExternalLink, Trash2, ShoppingBag, Flame, Sparkles, Filter, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

export default function WishlistShelf({
  wishlist,
  currentUser,
  onOpenAddWishlistModal,
  onMoveToLibrary,
  onDeleteWishlist
}) {
  const [selectedPriority, setSelectedPriority] = useState('All');

  const filteredWishlist = useMemo(() => {
    return wishlist.filter(item => {
      if (selectedPriority !== 'All' && item.priority !== selectedPriority) return false;
      return true;
    });
  }, [wishlist, selectedPriority]);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return { label: 'High Priority 🔥', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'Medium':
        return { label: 'Medium Priority ⚡', bg: 'bg-cyber-500/20 text-cyber-300 border-cyber-500/40' };
      default:
        return { label: 'Low Priority 🌿', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0a0f1d] via-[#090d18] to-[#0a0f1d] p-6 rounded-3xl border border-cyber-500/25 shadow-glow-blue">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">TBR Wishlist (Shelf 3: Want to Buy)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyber-500/20 text-cyber-300 text-xs font-mono font-bold border border-cyber-500/40">
              {wishlist.length} Planned Reads
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Books to cop next. Track priority drops, estimated prices, store links, and move directly to your active shelf!
          </p>
        </div>

        <button
          onClick={onOpenAddWishlistModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-glow-cyan transition-all transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add to TBR Wishlist</span>
        </button>
      </div>

      {/* Priority Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-[#090d18] p-4 rounded-2xl border border-obsidian-750">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-4 h-4 text-cyber-400" />
          <span className="font-bold text-slate-200">Filter Priority:</span>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'High', 'Medium', 'Low'].map(p => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPriority === p
                  ? 'bg-cyber-500/20 text-cyber-300 border border-cyber-500/50 shadow-glow-blue'
                  : 'bg-obsidian-900 text-slate-400 hover:text-white hover:bg-obsidian-850 border border-obsidian-750'
              }`}
            >
              {p === 'All' ? 'All Priorities' : `${p} Priority`}
            </button>
          ))}
        </div>
      </div>

      {/* Wishlist Grid */}
      {filteredWishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWishlist.map(item => {
            const badge = getPriorityBadge(item.priority);
            return (
              <div
                key={item.id}
                className="bg-[#090d18] hover:bg-[#0e1424] border border-obsidian-750 hover:border-cyber-500/40 rounded-3xl p-5 transition-all shadow-glass-card flex flex-col justify-between group"
              >
                <div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-24 h-36 rounded-xl overflow-hidden book-spine-effect shadow-md border border-obsidian-700 bg-obsidian-950">
                      <img
                        src={item.coverUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        {item.estimatedPrice && (
                          <span className="text-xs font-mono font-bold text-cyber-300 bg-cyber-500/10 px-2 py-0.5 rounded-lg border border-cyber-500/30">
                            {item.estimatedPrice}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-white group-hover:text-cyber-300 text-base line-clamp-2 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">by {item.author}</p>
                      <span className="inline-block text-[10px] text-slate-400 font-mono font-medium px-2 py-0.5 rounded-lg bg-obsidian-850 border border-obsidian-750 mt-2">
                        {item.genre}
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-3.5 text-xs text-slate-300 bg-obsidian-850 p-3 rounded-2xl border border-obsidian-750">
                      <span className="text-[10px] font-bold text-cyber-400 uppercase font-mono block mb-0.5">Squad Note:</span>
                      <p className="italic text-slate-300">"{item.notes}"</p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-obsidian-750 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {item.storeLink ? (
                      <a
                        href={item.storeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-cyber-400 hover:text-cyber-300 font-bold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Store Drop</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-500">No store link</span>
                    )}

                    <button
                      onClick={() => onDeleteWishlist(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 rounded-lg transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onMoveToLibrary(item.id)}
                    className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-obsidian-850 hover:bg-cyber-500 hover:text-obsidian-950 text-cyber-300 font-bold text-xs border border-cyber-500/30 hover:border-cyber-400 transition-all transform active:scale-95 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Copped! Move to Active Shelf ⚡</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#090d18] rounded-3xl border border-obsidian-750 p-12 text-center max-w-md mx-auto shadow-glass-card">
          <div className="w-16 h-16 rounded-2xl bg-cyber-500/10 text-cyber-400 flex items-center justify-center mx-auto mb-4 border border-cyber-500/30 shadow-glow-blue">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Wishlist is clear</h3>
          <p className="text-xs text-slate-400 mt-1.5 mb-4">
            Found a trending book? Add it with price tags & store links so the squad can see what's on your radar!
          </p>
          <button
            onClick={onOpenAddWishlistModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-500 text-obsidian-950 font-bold text-xs hover:bg-cyber-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add TBR Item</span>
          </button>
        </div>
      )}

    </div>
  );
}
