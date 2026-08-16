// API Client for BookNest (Gen Z Edition)

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { success: res.ok, error: text || `HTTP Error ${res.status}` };
      }
    }

    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth & Onboarding
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  googleLogin: (data) => request('/auth/google', { method: 'POST', body: JSON.stringify(data) }),
  getInvite: (code) => request(`/auth/invite/${code}`),

  // Online Book Search (Google Books & OpenLibrary)
  searchBooks: (query) => request(`/search-books?q=${encodeURIComponent(query)}`),

  // Users
  getUsers: () => request('/users'),
  getUser: (id) => request(`/users/${id}`),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Books
  getBooks: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    return request(`/books?${query.toString()}`);
  },
  getBook: (id) => request(`/books/${id}`),
  addBook: (data) => request('/books', { method: 'POST', body: JSON.stringify(data) }),
  updateBook: (id, data) => request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),

  // Reading Logs
  getReadingLogs: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    return request(`/reading-logs?${query.toString()}`);
  },
  addReadingLog: (data) => request('/reading-logs', { method: 'POST', body: JSON.stringify(data) }),
  deleteReadingLog: (id) => request(`/reading-logs/${id}`, { method: 'DELETE' }),

  // Wishlist
  getWishlist: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    return request(`/wishlist?${query.toString()}`);
  },
  addWishlist: (data) => request('/wishlist', { method: 'POST', body: JSON.stringify(data) }),
  updateWishlist: (id, data) => request(`/wishlist/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWishlist: (id) => request(`/wishlist/${id}`, { method: 'DELETE' }),
  moveWishlistToLibrary: (id, status = 'unread') => request(`/wishlist/${id}/move-to-library`, { method: 'POST', body: JSON.stringify({ status }) }),

  // Social Feed & Leaderboard
  getFeed: (limit = 30) => request(`/feed?limit=${limit}`),
  postFeedComment: (data) => request('/feed', { method: 'POST', body: JSON.stringify(data) }),
  getLeaderboard: () => request('/leaderboard'),

  // Stats
  getStats: (userId) => request(`/stats?userId=${userId}`),
};
