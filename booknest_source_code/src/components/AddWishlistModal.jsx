import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Gift, DollarSign, Link2, Sparkles, Zap, Search, Loader2, Check, BookOpen } from 'lucide-react';
import { searchOnlineBooks } from '../utils/bookSearch';

export default function AddWishlistModal({ isOpen, onClose, currentUser, onAddWishlist }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Personal Development');
  const [priority, setPriority] = useState('High');
  const [estimatedPrice, setEstimatedPrice] = useState('$17.99');
  const [storeLink, setStoreLink] = useState('https://bookshop.org');
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80');
  const [notes, setNotes] = useState('');

  // Online Search State
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchDebounceRef = useRef(null);

  // Debounced search when user types title
  useEffect(() => {
    if (!title || title.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const results = await searchOnlineBooks(title);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.error("Book search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [title]);

  // When user selects an online book from Google / OpenLibrary
  const handleSelectOnlineBook = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    if (book.genre && book.genre !== 'General') setGenre(book.genre);
    if (book.coverUrl) setCoverUrl(book.coverUrl);
    if (book.previewLink) setStoreLink(book.previewLink);
    if (book.description && !notes) setNotes(book.description);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddWishlist({
        userId: currentUser?.id || localStorage.getItem('booknest_auth_user_id') || 'user-1',
        title: title.trim(),
        author: author.trim() || 'Unknown Author',
        genre: genre.trim() || 'General',
        priority,
        estimatedPrice: estimatedPrice.trim() || '$15.00',
        storeLink: storeLink.trim() || 'https://bookshop.org',
        coverUrl: coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80',
        notes: notes.trim()
      });
      onClose();
    } catch (err) {
      alert("Error adding wishlist item: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#090d18] border border-cyber-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-glow-blue relative overflow-hidden max-h-[92vh] overflow-y-auto">
        
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-750">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyber-500/10 text-cyber-400 border border-cyber-500/30">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Add to TBR Wishlist</h2>
              <p className="text-xs text-slate-400">Search any book worldwide or type custom details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Book Cover Preview Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 flex items-center gap-4">
          <div className="shrink-0 w-16 h-24 rounded-xl overflow-hidden book-spine-effect shadow-md border border-obsidian-700 bg-obsidian-950">
            <img
              src={coverUrl}
              alt="Cover Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80";
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono uppercase font-bold text-cyber-400 bg-cyber-500/10 px-2 py-0.5 rounded-md">
              Live Cover Preview
            </span>
            <h4 className="font-display font-bold text-sm text-white truncate mt-1">
              {title || "Type a book title below..."}
            </h4>
            <p className="text-xs text-slate-400 truncate">
              {author ? `by ${author}` : "Author will auto-populate"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Title with Google Live Search */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-cyber-400" />
                <span>Book Title (Live Google Search) *</span>
              </span>
              {isSearching && (
                <span className="text-[10px] text-cyan-300 font-mono flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Searching web...
                </span>
              )}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Can't Hurt Me, Atomic Habits, Dune..."
              value={title}
              onChange={(e) => { setTitle(e.target.value); setShowDropdown(true); }}
              onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-obsidian-900 border border-cyber-500/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan transition-all"
            />

            {/* Live Search Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#070a12] border border-cyber-500/50 rounded-2xl shadow-glow-blue max-h-64 overflow-y-auto p-1.5 space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono text-cyan-300 uppercase font-bold flex items-center justify-between border-b border-obsidian-750">
                  <span>Google Books & Web Results (Click to Auto-Fill):</span>
                  <button
                    type="button"
                    onClick={() => setShowDropdown(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                {searchResults.map(b => (
                  <div
                    key={b.id}
                    onClick={() => handleSelectOnlineBook(b)}
                    className="p-2 rounded-xl hover:bg-obsidian-850 cursor-pointer transition-all flex items-center gap-3 group border border-transparent hover:border-cyber-500/30"
                  >
                    <img
                      src={b.coverUrl}
                      alt={b.title}
                      className="w-9 h-13 object-cover rounded-md border border-obsidian-700 bg-obsidian-950 shrink-0"
                    />
                    <div className="min-w-0 flex-1 text-left">
                      <div className="font-display font-bold text-xs text-white group-hover:text-cyan-300 truncate">
                        {b.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        by {b.author}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {b.genre} • {b.pageCount} pgs {b.publishedDate ? `(${b.publishedDate})` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Author and Genre */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Author *</label>
              <input
                type="text"
                required
                placeholder="e.g. David Goggins"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white focus:outline-none focus:border-cyber-400"
              />
            </div>
          </div>

          {/* Priority & Est. Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white focus:outline-none focus:border-cyber-400"
              >
                <option value="High">High Priority 🔥</option>
                <option value="Medium">Medium Priority ⚡</option>
                <option value="Low">Low Priority 🌿</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Est. Price</label>
              <input
                type="text"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                placeholder="e.g. $17.99"
                className="w-full px-3.5 py-2 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs font-mono text-white focus:outline-none focus:border-cyber-400"
              />
            </div>
          </div>

          {/* Store Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Store / Purchase Link</label>
            <input
              type="url"
              value={storeLink}
              onChange={(e) => setStoreLink(e.target.value)}
              placeholder="https://bookshop.org/..."
              className="w-full px-3.5 py-2 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-slate-300 focus:outline-none focus:border-cyber-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Why on TBR List</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Master your mind and defy the odds."
              className="w-full px-3.5 py-2 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400 resize-none leading-relaxed"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-extrabold text-xs shadow-glow-cyan transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving to Wishlist...' : 'Save to TBR Wishlist ⚡'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
