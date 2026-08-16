import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Listen on all network interfaces for LAN / remote access

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// PWA Manifest and static assets
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// API routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'BookNest API',
    timestamp: new Date().toISOString(),
    network: {
      port: PORT,
      host: HOST
    }
  });
});

// Serve frontend SPA fallback
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).send("BookNest API is running. Build frontend with 'npm run build'.");
    }
  });
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 BookNest Server running on:`);
  console.log(`   - Local:   http://localhost:${PORT}`);
  console.log(`   - Network: http://192.168.31.215:${PORT}`);
});
