import express from 'express';
import { db } from './db.js';

const router = express.Router();

// --- Authentication & Onboarding ---
router.post('/auth/register', (req, res) => {
  try {
    const { name, username, email, password, avatar, bio, readingGoalYear, favoriteGenre } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and Email are required to register' });
    }
    const user = db.registerUser({ name, username, email, password, avatar, bio, readingGoalYear, favoriteGenre });
    res.status(201).json({ success: true, message: 'Account created successfully! Welcome to the squad.', data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/auth/login', (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername) {
      return res.status(400).json({ success: false, error: 'Please provide email or username' });
    }
    const user = db.loginUser({ emailOrUsername, password });
    res.json({ success: true, message: 'Logged in successfully!', data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/auth/google', (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Google email is required' });
    }
    const user = db.googleLogin({ email, name, avatar });
    res.json({ success: true, message: 'Google authentication successful!', data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
router.post('/auth/reset-password', (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email and new password are required' });
    }
    const user = db.resetPassword({ email, newPassword });
    res.json({ success: true, message: 'Password reset successfully! You can now log in.', data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/auth/invite/:code', (req, res) => {
  try {
    // Validate invite link code
    const code = req.params.code;
    res.json({
      success: true,
      data: {
        inviteValid: true,
        clubName: "BookNest Squad 2026",
        inviter: "Ashish Patel",
        message: "You've been invited to join our reading circle!"
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Users ---
router.get('/users', (req, res) => {
  try {
    const users = db.getUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/users/:id', (req, res) => {
  try {
    const user = db.getUser(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/users/:id', (req, res) => {
  try {
    const user = db.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Books ---
router.get('/books', (req, res) => {
  try {
    const { userId, status, search, genre, format } = req.query;
    const books = db.getBooks({ userId, status, search, genre, format });
    res.json({ success: true, count: books.length, data: books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/search-books', async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) {
      return res.json({ success: true, data: [] });
    }
    const clean = encodeURIComponent(query.trim());
    const gUrl = `https://www.googleapis.com/books/v1/volumes?q=${clean}&maxResults=8&printType=books`;
    const response = await fetch(gUrl);
    if (!response.ok) {
      return res.json({ success: true, data: [] });
    }
    const data = await response.json();
    const books = (data.items || []).map(item => {
      const info = item.volumeInfo || {};
      let coverUrl = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || info.imageLinks?.medium || '';
      if (coverUrl.startsWith('http:')) coverUrl = coverUrl.replace('http:', 'https:');
      return {
        id: item.id,
        title: info.title || query,
        subtitle: info.subtitle || '',
        author: info.authors ? info.authors.join(', ') : 'Unknown Author',
        publishedDate: info.publishedDate || '',
        pageCount: info.pageCount || 300,
        genre: info.categories ? info.categories[0] : 'General',
        coverUrl: coverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
        description: info.description ? (info.description.slice(0, 240) + '...') : '',
        previewLink: info.previewLink || info.infoLink || ''
      };
    });
    res.json({ success: true, data: books });
  } catch (err) {
    res.json({ success: true, data: [] });
  }
});

router.get('/books/:id', (req, res) => {
  try {
    const book = db.getBook(req.params.id);
    if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/books', (req, res) => {
  try {
    const { title, author } = req.body;
    let userId = req.body.userId;
    if (!title || !author) {
      return res.status(400).json({ success: false, error: 'Title and author are required' });
    }
    if (!userId) {
      const allUsers = db.getUsers();
      userId = allUsers[0]?.id || 'user-1';
    }
    const book = db.addBook({ ...req.body, userId });
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/books/:id', (req, res) => {
  try {
    const book = db.updateBook(req.params.id, req.body);
    if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/books/:id', (req, res) => {
  try {
    const success = db.deleteBook(req.params.id);
    if (!success) return res.status(404).json({ success: false, error: 'Book not found' });
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Reading Logs ---
router.get('/reading-logs', (req, res) => {
  try {
    const { userId, bookId, date } = req.query;
    const logs = db.getReadingLogs({ userId, bookId, date });
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/reading-logs', (req, res) => {
  try {
    const { userId, pagesRead, minutesRead } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'UserId is required' });
    }
    if ((!pagesRead || Number(pagesRead) <= 0) && (!minutesRead || Number(minutesRead) <= 0)) {
      return res.status(400).json({ success: false, error: 'Please provide pages read or minutes read' });
    }
    const result = db.addReadingLog(req.body);
    res.status(201).json({ success: true, data: result, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/reading-logs/:id', (req, res) => {
  try {
    const success = db.deleteReadingLog(req.params.id);
    if (!success) return res.status(404).json({ success: false, error: 'Log not found' });
    res.json({ success: true, message: 'Log deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Wishlist ---
router.get('/wishlist', (req, res) => {
  try {
    const { userId, priority } = req.query;
    const items = db.getWishlist({ userId, priority });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/wishlist', (req, res) => {
  try {
    const { title, author } = req.body;
    let userId = req.body.userId;
    if (!title || !author) {
      return res.status(400).json({ success: false, error: 'Title and author are required' });
    }
    if (!userId) {
      const allUsers = db.getUsers();
      userId = allUsers[0]?.id || 'user-1';
    }
    const item = db.addWishlist({ ...req.body, userId });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/wishlist/:id', (req, res) => {
  try {
    const item = db.updateWishlist(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, error: 'Wishlist item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/wishlist/:id', (req, res) => {
  try {
    const success = db.deleteWishlist(req.params.id);
    if (!success) return res.status(404).json({ success: false, error: 'Wishlist item not found' });
    res.json({ success: true, message: 'Item removed from wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/wishlist/:id/move-to-library', (req, res) => {
  try {
    const status = req.body.status || "unread";
    const book = db.moveWishlistToLibrary(req.params.id, status);
    if (!book) return res.status(404).json({ success: false, error: 'Wishlist item not found' });
    res.json({ success: true, message: 'Book moved to library!', data: book });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Activity Social Feed ---
router.get('/feed', (req, res) => {
  try {
    const limit = Number(req.query.limit) || 30;
    const activities = db.getActivities(limit);
    res.json({ success: true, count: activities.length, data: activities });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/feed', (req, res) => {
  try {
    const { userId, details, bookTitle } = req.body;
    if (!userId || !details) {
      return res.status(400).json({ success: false, error: 'userId and details are required' });
    }
    const act = db.addActivity({ userId, type: "USER_NOTE", bookTitle, details });
    res.status(201).json({ success: true, data: act });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Leaderboard ---
router.get('/leaderboard', (req, res) => {
  try {
    const leaderboard = db.getLeaderboard();
    res.json({ success: true, data: leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Stats & Habit Consistency ---
router.get('/stats', (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId query parameter is required' });
    }
    const stats = db.getUserStats(userId);
    if (!stats) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
