import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import privacyLensRoute from './routes/privacylens.js';
import breachWatchRoute from './routes/breachwatch.js';
import shieldCheckRoute from './routes/shieldcheck.js';
import metaCleanerRoute from './routes/metacleaner.js';
import cookieInspectorRoute from './routes/cookieinspector.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '2mb' }));

app.use('/api/privacylens', privacyLensRoute);
app.use('/api/breachwatch', breachWatchRoute);
app.use('/api/shieldcheck', shieldCheckRoute);
app.use('/api/metacleaner', metaCleanerRoute);
app.use('/api/cookieinspector', cookieInspectorRoute);

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`PrivaGuard server running on port ${PORT}`);
});
