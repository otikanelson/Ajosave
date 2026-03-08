// Vercel serverless entry point
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const { applySecurity } = require('../src/middlewares/security');
const { globalErrorHandler, notFoundHandler } = require('../src/middlewares/errorHandler');
const { sanitizeInput } = require('../src/middlewares/validation');

const authRoutes = require('../src/routes/authRoutes');
const transactionRoutes = require('../src/routes/transactionRoutes');
const groupRoutes = require('../src/routes/groupRoutes');
const walletRoutes = require('../src/routes/walletRoutes');

let isConnected = false;
let connectionError = null;

const app = express();

applySecurity(app);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(sanitizeInput);

// Health check — always responds, no sensitive info exposed
app.get(['/', '/api/health'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AjoSave API',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/wallets', walletRoutes);
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Connect to DB — lazy, cached across warm invocations
const connectOnce = async () => {
  if (isConnected) return;
  try {
    connectionError = null;
    const mongoose = require('mongoose');
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGO_URI environment variable is not set');

    await mongoose.connect(mongoUri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    connectionError = err.message;
    console.error('❌ MongoDB connection failed:', err.message);
  }
};

module.exports = async (req, res) => {
  // Always serve health check without DB
  if (req.url === '/' || req.url === '/api/health') {
    return app(req, res);
  }

  await connectOnce();

  if (!isConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable. Please try again.',
      error: connectionError,
    });
  }

  return app(req, res);
};
