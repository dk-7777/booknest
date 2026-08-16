// Real-Time Worldwide Web Book Search Engine (OpenLibrary + Google Books + WorldWide Covers)

export async function searchOnlineBooks(query) {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim();
  const results = [];
  const seenTitles = new Set();

  // 1. OpenLibrary Search (Instant worldwide search with real book covers)
  try {
    const olUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(cleanQuery)}&limit=10`;
    const res = await fetch(olUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.docs && data.docs.length > 0) {
        data.docs.forEach(doc => {
          const title = doc.title;
          const author = doc.author_name ? doc.author_name.join(', ') : 'Unknown Author';
          const key = `${title.toLowerCase()}_${author.toLowerCase()}`;
          if (seenTitles.has(key)) return;
          seenTitles.add(key);

          const coverId = doc.cover_i;
          const isbn = doc.isbn ? doc.isbn[0] : null;
          
          let coverUrl = '';
          if (coverId) {
            coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
          } else if (isbn) {
            coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
          } else {
            coverUrl = `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80`;
          }

          const pageCount = doc.number_of_pages_median || (doc.first_publish_year ? 320 : 280);
          const genre = doc.subject ? doc.subject[0] : (doc.first_sentence ? 'General Fiction' : 'Non-Fiction');

          results.push({
            id: doc.key || `ol-${Math.random()}`,
            title,
            author,
            publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : '',
            pageCount,
            genre,
            coverUrl,
            description: doc.first_sentence ? (doc.first_sentence[0] || '') : `${title} by ${author}`,
            previewLink: `https://openlibrary.org${doc.key || ''}`,
            source: 'OpenLibrary'
          });
        });
      }
    }
  } catch (err) {
    console.warn("OpenLibrary search warning:", err);
  }

  // 2. Google Books Search (Augment covers & descriptions if available)
  try {
    const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(cleanQuery)}&maxResults=6&printType=books`;
    const res = await fetch(googleUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
          const info = item.volumeInfo || {};
          const title = info.title || cleanQuery;
          const author = info.authors ? info.authors.join(', ') : 'Unknown Author';
          const key = `${title.toLowerCase()}_${author.toLowerCase()}`;

          let coverUrl = info.imageLinks?.extraLarge || 
                         info.imageLinks?.large || 
                         info.imageLinks?.medium || 
                         info.imageLinks?.thumbnail || 
                         info.imageLinks?.smallThumbnail || '';

          if (coverUrl.startsWith('http:')) {
            coverUrl = coverUrl.replace('http:', 'https:');
          }

          if (!seenTitles.has(key)) {
            seenTitles.add(key);
            results.push({
              id: item.id || `gb-${Math.random()}`,
              title,
              subtitle: info.subtitle || '',
              author,
              publishedDate: info.publishedDate || '',
              pageCount: info.pageCount || 300,
              genre: info.categories ? info.categories[0] : 'General',
              coverUrl: coverUrl || `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80`,
              description: info.description ? (info.description.slice(0, 240) + '...') : '',
              previewLink: info.previewLink || info.infoLink || '',
              source: 'Google Books'
            });
          }
        });
      }
    }
  } catch (err) {
    console.warn("Google Books API fallback:", err);
  }

  return results.slice(0, 8);
}
