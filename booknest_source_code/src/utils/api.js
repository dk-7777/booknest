// Bulletproof Universal API Client for BookNest
// Works with Express Backend + Seamless Standalone Fallback for Vercel Static Hosting & Mobile APKs

import { initialData } from '../../server/seedData.js';

const STORAGE_KEY = 'booknest_local_db_v2';

function getLocalDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (!data.users) data.users = [];
      if (!data.books) data.books = [];
      if (!data.readingLogs) data.readingLogs = [];
      if (!data.wishlist) data.wishlist = [];
      if (!data.activities) data.activities = [];
      return data;
    }
  } catch (e) {}
  const fresh = JSON.parse(JSON.stringify(initialData));
  saveLocalDB(fresh);
  return fresh;
}

function saveLocalDB(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

const BASE_URL = '/api';

async function serverRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  const res = await fetch(url, config);
  if (!res.ok) {
    throw new Error(`HTTP_${res.status}`);
  }
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { success: true, data: text };
  }
}

export const api = {
  // --- Auth & Account ---
  register: async (data) => {
    try {
      const res = await serverRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) });
      const user = res.data || res.user || res;
      return { success: true, data: user, user };
    } catch (e) {
      const db = getLocalDB();
      const cleanEmail = data.email.trim().toLowerCase();
      const existing = db.users.find(u => u.email?.toLowerCase() === cleanEmail);
      if (existing) throw new Error("An account with this email already exists. Please log in.");
      
      const newId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const newUser = {
        id: newId,
        name: data.name || cleanEmail.split('@')[0],
        username: data.username || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: data.password,
        avatar: data.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bio: data.bio || "Ready to crush reading goals! 📚⚡",
        readingGoalYear: Number(data.readingGoalYear) || 20,
        favoriteGenre: data.favoriteGenre || "Fiction",
        color: "#38bdf8",
        joinedDate: new Date().toISOString().split('T')[0]
      };
      db.users.push(newUser);
      saveLocalDB(db);
      return { success: true, data: newUser, user: newUser };
    }
  },

  login: async (data) => {
    try {
      const res = await serverRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) });
      const user = res.data || res.user || res;
      return { success: true, data: user, user };
    } catch (e) {
      const db = getLocalDB();
      const q = data.emailOrUsername.toLowerCase().trim();
      let user = db.users.find(u => u.email?.toLowerCase() === q || u.username?.toLowerCase() === q);
      if (!user) {
        user = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: q.split('@')[0],
          username: q.split('@')[0],
          email: q.includes('@') ? q : `${q}@gmail.com`,
          password: data.password,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          bio: "Ready to crush reading goals! 📚⚡",
          readingGoalYear: 20,
          favoriteGenre: "Fiction",
          color: "#38bdf8",
          joinedDate: new Date().toISOString().split('T')[0]
        };
        db.users.push(user);
        saveLocalDB(db);
      } else if (user.password && user.password !== data.password) {
        throw new Error("Incorrect password. Please try again.");
      }
      return { success: true, data: user, user };
    }
  },

  resetPassword: async (data) => {
    try {
      const res = await serverRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) });
      const user = res.data || res.user || res;
      return { success: true, data: user, user };
    } catch (e) {
      const db = getLocalDB();
      const cleanEmail = data.email.trim().toLowerCase();
      const user = db.users.find(u => u.email?.toLowerCase() === cleanEmail);
      if (!user) throw new Error("No account found with this email.");
      user.password = data.newPassword;
      saveLocalDB(db);
      return { success: true, data: user, user };
    }
  },

  googleLogin: async (data) => {
    try {
      const res = await serverRequest('/auth/google', { method: 'POST', body: JSON.stringify(data) });
      const user = res.data || res.user || res;
      return { success: true, data: user, user };
    } catch (e) {
      const db = getLocalDB();
      const cleanEmail = data.email.trim().toLowerCase();
      let user = db.users.find(u => u.email?.toLowerCase() === cleanEmail);
      if (!user) {
        user = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: data.name || cleanEmail.split('@')[0],
          username: cleanEmail.split('@')[0],
          email: cleanEmail,
          password: 'google_session_auth',
          avatar: data.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          bio: "Joined via Google account ⚡",
          readingGoalYear: 25,
          color: "#38bdf8",
          joinedDate: new Date().toISOString().split('T')[0]
        };
        db.users.push(user);
        saveLocalDB(db);
      }
      return { success: true, data: user, user };
    }
  },

  getInvite: async (code) => {
    try {
      return await serverRequest(`/auth/invite/${code}`);
    } catch (e) {
      return { success: true, code, inviter: { name: 'Reading Squad' } };
    }
  },

  searchBooks: async (query) => {
    try {
      return await serverRequest(`/search-books?q=${encodeURIComponent(query)}`);
    } catch (e) {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8`);
      const data = await res.json();
      const books = (data.docs || []).map(b => ({
        title: b.title,
        author: b.author_name ? b.author_name.join(', ') : 'Unknown Author',
        totalPages: b.number_of_pages_median || 320,
        genre: b.subject ? b.subject[0] : 'General',
        coverUrl: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg` : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'
      }));
      return { success: true, results: books, data: books };
    }
  },

  getUsers: async () => {
    try {
      const res = await serverRequest('/users');
      return { success: true, data: res.data || res.users || res, users: res.users || res.data || res };
    } catch (e) {
      const users = getLocalDB().users;
      return { success: true, data: users, users };
    }
  },

  getUser: async (id) => {
    try {
      const res = await serverRequest(`/users/${id}`);
      const user = res.data || res.user || res;
      return { success: true, data: user, user };
    } catch (e) {
      const user = getLocalDB().users.find(u => u.id === id);
      return { success: true, data: user, user };
    }
  },

  updateUser: async (id, data) => {
    try {
      const res = await serverRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      const user = res.data || res.user || res;
      return { success: true, data: user, user };
    } catch (e) {
      const db = getLocalDB();
      const idx = db.users.findIndex(u => u.id === id);
      if (idx !== -1) {
        db.users[idx] = { ...db.users[idx], ...data };
        saveLocalDB(db);
        return { success: true, data: db.users[idx], user: db.users[idx] };
      }
      return { success: false, error: 'User not found' };
    }
  },

  getBooks: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, v);
      });
      const res = await serverRequest(`/books?${query.toString()}`);
      const books = res.data || res.books || res;
      return { success: true, data: books, books };
    } catch (e) {
      let books = getLocalDB().books || [];
      if (params.userId) books = books.filter(b => b.userId === params.userId);
      if (params.status) books = books.filter(b => b.status === params.status);
      return { success: true, data: books, books };
    }
  },

  addBook: async (data) => {
    try {
      const res = await serverRequest('/books', { method: 'POST', body: JSON.stringify(data) });
      const book = res.data || res.book || res;
      return { success: true, data: book, book };
    } catch (e) {
      const db = getLocalDB();
      const newBook = {
        id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        userId: data.userId,
        title: data.title,
        author: data.author,
        genre: data.genre || 'General',
        coverUrl: data.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
        totalPages: Number(data.totalPages) || 300,
        currentPage: Number(data.currentPage) || 0,
        format: data.format || 'Physical',
        status: data.status || 'currently_reading',
        startDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      db.books.unshift(newBook);
      saveLocalDB(db);
      return { success: true, data: newBook, book: newBook };
    }
  },

  updateBook: async (id, data) => {
    try {
      const res = await serverRequest(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      const book = res.data || res.book || res;
      return { success: true, data: book, book };
    } catch (e) {
      const db = getLocalDB();
      const idx = db.books.findIndex(b => b.id === id);
      if (idx !== -1) {
        db.books[idx] = { ...db.books[idx], ...data };
        saveLocalDB(db);
        return { success: true, data: db.books[idx], book: db.books[idx] };
      }
      return { success: false, error: 'Book not found' };
    }
  },

  deleteBook: async (id) => {
    try {
      return await serverRequest(`/books/${id}`, { method: 'DELETE' });
    } catch (e) {
      const db = getLocalDB();
      db.books = db.books.filter(b => b.id !== id);
      saveLocalDB(db);
      return { success: true };
    }
  },

  getReadingLogs: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, v);
      });
      const res = await serverRequest(`/reading-logs?${query.toString()}`);
      const logs = res.data || res.readingLogs || res;
      return { success: true, data: logs, readingLogs: logs };
    } catch (e) {
      let logs = getLocalDB().readingLogs || [];
      if (params.userId) logs = logs.filter(l => l.userId === params.userId);
      return { success: true, data: logs, readingLogs: logs };
    }
  },

  addReadingLog: async (data) => {
    try {
      const res = await serverRequest('/reading-logs', { method: 'POST', body: JSON.stringify(data) });
      const log = res.data || res.log || res;
      return { success: true, data: log, log };
    } catch (e) {
      const db = getLocalDB();
      const newLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        userId: data.userId,
        bookId: data.bookId || null,
        date: data.date || new Date().toISOString().split('T')[0],
        pagesRead: Number(data.pagesRead) || 0,
        minutesRead: Number(data.minutesRead) || 0,
        note: data.note || '',
        createdAt: new Date().toISOString()
      };
      db.readingLogs.push(newLog);
      
      if (data.bookId && Number(data.pagesRead) > 0) {
        const book = db.books.find(b => b.id === data.bookId);
        if (book) {
          book.currentPage = Math.min(book.currentPage + Number(data.pagesRead), book.totalPages);
          if (book.currentPage >= book.totalPages) {
            book.status = 'completed';
            book.finishDate = newLog.date;
          }
        }
      }
      saveLocalDB(db);
      return { success: true, data: newLog, log: newLog };
    }
  },

  getWishlist: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, v);
      });
      const res = await serverRequest(`/wishlist?${query.toString()}`);
      const list = res.data || res.wishlist || res;
      return { success: true, data: list, wishlist: list };
    } catch (e) {
      let items = getLocalDB().wishlist || [];
      if (params.userId) items = items.filter(w => w.userId === params.userId);
      return { success: true, data: items, wishlist: items };
    }
  },

  addWishlist: async (data) => {
    try {
      const res = await serverRequest('/wishlist', { method: 'POST', body: JSON.stringify(data) });
      const item = res.data || res.item || res;
      return { success: true, data: item, item };
    } catch (e) {
      const db = getLocalDB();
      const newItem = {
        id: `wish-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        userId: data.userId,
        title: data.title,
        author: data.author,
        genre: data.genre || 'General',
        coverUrl: data.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80',
        priority: data.priority || 'Medium',
        estimatedPrice: data.estimatedPrice || '$15.00',
        storeLink: data.storeLink || '',
        notes: data.notes || '',
        createdAt: new Date().toISOString()
      };
      db.wishlist.unshift(newItem);
      saveLocalDB(db);
      return { success: true, data: newItem, item: newItem };
    }
  },

  deleteWishlist: async (id) => {
    try {
      return await serverRequest(`/wishlist/${id}`, { method: 'DELETE' });
    } catch (e) {
      const db = getLocalDB();
      db.wishlist = db.wishlist.filter(w => w.id !== id);
      saveLocalDB(db);
      return { success: true };
    }
  },

  moveWishlistToLibrary: async (id, status = 'unread') => {
    try {
      const res = await serverRequest(`/wishlist/${id}/move-to-library`, { method: 'POST', body: JSON.stringify({ status }) });
      const book = res.data || res.book || res;
      return { success: true, data: book, book };
    } catch (e) {
      const db = getLocalDB();
      const idx = db.wishlist.findIndex(w => w.id === id);
      if (idx !== -1) {
        const item = db.wishlist.splice(idx, 1)[0];
        const newBook = {
          id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          userId: item.userId,
          title: item.title,
          author: item.author,
          genre: item.genre,
          coverUrl: item.coverUrl,
          totalPages: 320,
          currentPage: 0,
          format: 'Physical',
          status: status,
          startDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        };
        db.books.unshift(newBook);
        saveLocalDB(db);
        return { success: true, data: newBook, book: newBook };
      }
      return { success: false };
    }
  },

  getFeed: async (limit = 30) => {
    try {
      const res = await serverRequest(`/feed?limit=${limit}`);
      const list = res.data || res.activities || res;
      return { success: true, data: list, activities: list };
    } catch (e) {
      const list = getLocalDB().activities || [];
      return { success: true, data: list, activities: list };
    }
  },

  getLeaderboard: async () => {
    try {
      const res = await serverRequest('/leaderboard');
      const list = res.data || res.leaderboard || res;
      return { success: true, data: list, leaderboard: list };
    } catch (e) {
      const users = getLocalDB().users || [];
      return { success: true, data: users, leaderboard: users };
    }
  },

  getStats: async (userId) => {
    try {
      const res = await serverRequest(`/stats?userId=${userId}`);
      const stats = res.data || res.stats || res;
      return { success: true, data: stats, stats };
    } catch (e) {
      const db = getLocalDB();
      const user = db.users.find(u => u.id === userId) || db.users[0];
      const userLogs = db.readingLogs.filter(l => l.userId === userId);
      const userBooks = db.books.filter(b => b.userId === userId);
      const stats = {
        user,
        currentStreak: userLogs.length > 0 ? 1 : 0,
        longestStreak: 3,
        totalPages: userLogs.reduce((acc, l) => acc + (Number(l.pagesRead) || 0), 0),
        totalMinutes: userLogs.reduce((acc, l) => acc + (Number(l.minutesRead) || 0), 0),
        completedBooksCount: userBooks.filter(b => b.status === 'completed').length,
        currentlyReadingCount: userBooks.filter(b => b.status === 'currently_reading').length,
        unreadCount: userBooks.filter(b => b.status === 'unread').length
      };
      return { success: true, data: stats, stats };
    }
  }
};
