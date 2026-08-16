import express from 'express';
import cors from 'cors';
import apiRouter from '../server/routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'BookNest Vercel Serverless' });
});

export default app;
