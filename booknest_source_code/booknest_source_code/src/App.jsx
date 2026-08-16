import React, { useState, useEffect } from 'react';
import { api } from './utils/api';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import LibraryShelf from './components/LibraryShelf';
import ReadingHistoryShelf from './components/ReadingHistoryShelf';
import WishlistShelf from './components/WishlistShelf';
import StreakCalendar from './components/StreakCalendar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import FeedLeaderboard from './components/FeedLeaderboard';
import ReadingTimerModal from './components/ReadingTimerModal';
import ShareAppModal from './components/ShareAppModal';
import AddBookModal from './components/AddBookModal';
import AddWishlistModal from './components/AddWishlistModal';
import BookDetailsModal from './components/BookDetailsModal';
import { BookOpen, Flame, Sparkles, RefreshCw, Zap, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('library');
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [timerInitialBook, setTimerInitialBook] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isAddWishlistOpen, setIsAddWishlistOpen] = useState(false);
  const [detailsBook, setDetailsBook] = useState(null);

  // Initial Auth Check on Mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const savedUserId = localStorage.getItem('booknest_auth_user_id');
        if (savedUserId) {
          const userRes = await api.getUser(savedUserId);
          if (userRes.data) {
            setCurrentUser(userRes.data);
            await loadUserData(savedUserId);
          } else {
            localStorage.removeItem('booknest_auth_user_id');
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem('booknest_auth_user_id');
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Load Private User Data
  const loadUserData = async (userId) => {
    try {
      const [booksRes, wishRes, statsRes, feedRes, leadRes] = await Promise.all([
        api.getBooks({ userId }),
        api.getWishlist({ userId }),
        api.getStats(userId),
        api.getFeed(30),
        api.getLeaderboard()
      ]);

      const safeBooks = Array.isArray(booksRes?.data) ? booksRes.data : (Array.isArray(booksRes?.books) ? booksRes.books : []);
      const safeWish = Array.isArray(wishRes?.data) ? wishRes.data : (Array.isArray(wishRes?.wishlist) ? wishRes.wishlist : []);
      const safeStats = statsRes?.data || statsRes?.stats || null;
      const safeFeed = Array.isArray(feedRes?.data) ? feedRes.data : (Array.isArray(feedRes?.activities) ? feedRes.activities : []);
      const safeLead = Array.isArray(leadRes?.data) ? leadRes.data : (Array.isArray(leadRes?.leaderboard) ? leadRes.leaderboard : []);

      setBooks(safeBooks);
      setWishlist(safeWish);
      setStats(safeStats);
      setActivities(safeFeed);
      setLeaderboard(safeLead);
      setCurrentUser(prev => prev ? { ...prev, stats: safeStats } : null);
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  };

  // On Login or Register Success
  const handleLoginSuccess = async (user) => {
    setCurrentUser(user);
    localStorage.setItem('booknest_auth_user_id', user.id);
    setIsLoading(true);
    await loadUserData(user.id);
    setIsLoading(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('booknest_auth_user_id');
    setCurrentUser(null);
    setBooks([]);
    setWishlist([]);
    setStats(null);
  };

  // Start 20-min timer for specific book or general
  const handleStartTimer = (book = null) => {
    setTimerInitialBook(book);
    setIsTimerModalOpen(true);
  };

  // Quick Log Bump
  const handleQuickLog = async (book, pages) => {
    if (!currentUser) return;
    try {
      await api.addReadingLog({
        userId: currentUser.id,
        bookId: book.id,
        pagesRead: pages,
        minutesRead: Math.round(pages * 1.2),
        date: new Date().toISOString().split('T')[0],
        note: `Quick session (+${pages} pgs)`
      });

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00f2fe', '#38bdf8', '#2563eb', '#818cf8']
      });

      await loadUserData(currentUser.id);
    } catch (err) {
      alert("Error logging session: " + err.message);
    }
  };

  // Submit Verified Timed Session Log
  const handleSubmitLog = async (logData) => {
    const res = await api.addReadingLog(logData);
    await loadUserData(currentUser.id);
    return res;
  };

  // Add Book
  const handleAddBook = async (bookData) => {
    const res = await api.addBook(bookData);
    await loadUserData(currentUser.id);
    return res;
  };

  // Update Book
  const handleUpdateBook = async (bookId, updates) => {
    const res = await api.updateBook(bookId, updates);
    await loadUserData(currentUser.id);
    return res;
  };

  // Delete Book
  const handleDeleteBook = async (bookId) => {
    await api.deleteBook(bookId);
    await loadUserData(currentUser.id);
  };

  // Add Wishlist
  const handleAddWishlist = async (wishData) => {
    const res = await api.addWishlist(wishData);
    await loadUserData(currentUser.id);
    return res;
  };

  // Move Wishlist to Library
  const handleMoveWishlistToLibrary = async (wishlistId) => {
    try {
      await api.moveWishlistToLibrary(wishlistId, 'unread');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#00f2fe', '#38bdf8', '#2563eb', '#818cf8']
      });
      await loadUserData(currentUser.id);
    } catch (err) {
      alert("Error moving to library: " + err.message);
    }
  };

  // Delete Wishlist
  const handleDeleteWishlist = async (wishlistId) => {
    await api.deleteWishlist(wishlistId);
    await loadUserData(currentUser.id);
  };

  // Post Feed Comment
  const handlePostFeedComment = async (commentData) => {
    await api.postFeedComment(commentData);
    const feedRes = await api.getFeed(30);
    setActivities(feedRes.data || []);
  };

  // If user is not authenticated, show full LoginPage
  if (!currentUser && !isLoading) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} api={api} />;
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenTimerModal={() => handleStartTimer(null)}
        onOpenAddBookModal={() => setIsAddBookOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {isLoading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-3xl bg-cyber-500/10 border border-cyber-500/30 flex items-center justify-center shadow-glow-blue animate-pulse">
              <Zap className="w-6 h-6 text-cyber-400" />
            </div>
            <p className="text-xs text-cyber-300 mt-4 font-mono font-bold">Syncing Your Private Shelf ⚡...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'library' && (
              <LibraryShelf
                books={books}
                currentUser={currentUser}
                onOpenDetails={(book) => setDetailsBook(book)}
                onQuickLog={handleQuickLog}
                onQuickStatusChange={(book, status) => handleUpdateBook(book.id, { status })}
                onOpenAddBookModal={() => setIsAddBookOpen(true)}
                onStartTimer={handleStartTimer}
              />
            )}

            {activeTab === 'history' && (
              <ReadingHistoryShelf
                books={books}
                currentUser={currentUser}
                onOpenDetails={(book) => setDetailsBook(book)}
              />
            )}

            {activeTab === 'wishlist' && (
              <WishlistShelf
                wishlist={wishlist}
                currentUser={currentUser}
                onOpenAddWishlistModal={() => setIsAddWishlistOpen(true)}
                onMoveToLibrary={handleMoveWishlistToLibrary}
                onDeleteWishlist={handleDeleteWishlist}
              />
            )}

            {activeTab === 'streaks' && (
              <StreakCalendar
                stats={stats}
                currentUser={currentUser}
                onOpenLogModal={() => handleStartTimer(null)}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsDashboard
                stats={stats}
                currentUser={currentUser}
                books={books}
              />
            )}

            {activeTab === 'feed' && (
              <FeedLeaderboard
                activities={activities}
                leaderboard={leaderboard}
                currentUser={currentUser}
                onPostFeedComment={handlePostFeedComment}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer with Share and Privacy details */}
      <footer className="border-t border-obsidian-750 bg-[#04060a] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white">BookNest ⚡</span>
            <span>—</span>
            <span className="text-slate-400">Gen Z Social Reading & 20-Min Focus Engine</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share App Link & QR Code</span>
            </button>
            <span>•</span>
            <span className="text-slate-400 font-mono">
              Logged in: <strong className="text-white">{currentUser?.name}</strong>
            </span>
          </div>
        </div>
      </footer>

      {/* Live 20-Minute Reading Timer Modal */}
      <ReadingTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => {
          setIsTimerModalOpen(false);
          setTimerInitialBook(null);
        }}
        books={books}
        currentUser={currentUser}
        initialBook={timerInitialBook}
        onSubmitLog={handleSubmitLog}
      />

      {/* Share App & Mobile QR Code Modal */}
      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        currentUser={currentUser}
        onAddBook={handleAddBook}
      />

      <AddWishlistModal
        isOpen={isAddWishlistOpen}
        onClose={() => setIsAddWishlistOpen(false)}
        currentUser={currentUser}
        onAddWishlist={handleAddWishlist}
      />

      <BookDetailsModal
        isOpen={!!detailsBook}
        onClose={() => setDetailsBook(null)}
        book={detailsBook}
        onUpdateBook={handleUpdateBook}
        onDeleteBook={handleDeleteBook}
      />

    </div>
  );
}
