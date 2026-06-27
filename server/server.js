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

// Raw CORS — fires before anything else including cors()
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://privaguard-five.vercel.app'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200
};

// Handle any OPTIONS that slip through to Express
app.options('*', cors(corsOptions));

// Apply CORS to all other routes
app.use(cors(corsOptions));

app.use(express.json({ limit: '2mb' }));

app.use('/api/privacylens', privacyLensRoute);
app.use('/api/breachwatch', breachWatchRoute);
app.use('/api/shieldcheck', shieldCheckRoute);
app.use('/api/metacleaner', metaCleanerRoute);
app.use('/api/cookieinspector', cookieInspectorRoute);

// Global error handler

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "PrivaGuard Backend",
    version: "1.0.0"
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`PrivaGuard server running on port ${PORT}`);
});
export default app;