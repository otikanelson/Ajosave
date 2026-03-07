// Vercel serverless entry point
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const config = require('../src/config/config');
const { connectDB } = require('../src/config/db');
const { applySecurity } = require('../src/middlewares/security');
const { globalErrorHandler, notFoundHandler } = require('../src/middlewares/errorHandler');
const { sanitizeInput } = require('../src/middlewares/validation');

const authRoutes = require('../src/routes/authRoutes');
const transactionRoutes = require('../src/routes/transactionRoutes');
const groupRoutes = require('../src/routes/groupRoutes');
const walletRoutes = require('../src/routes/walletRoutes');

let isConnected = false;

const app = express();

applySecurity(app);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(sanitizeInput);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AjoSave API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: {
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
      MONGO_URI: process.env.MONGO_URI ? 'SET ✓' : 'MISSING ✗',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET ✓' : 'MISSING ✗',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/wallets', walletRoutes);
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Connect to DB once per cold start (cached across warm invocations)
const connectOnce = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('DB connection failed:', err.message);
      // Don't exit — let the request fail gracefully with a 503
    }
  }
};

module.exports = async (req, res) => {
  await connectOnce();
  if (!isConnected) {
    return res.status(503).json({ success: false, message: 'Database unavailable. Please try again.' });
  }
  return app(req, res);
};
