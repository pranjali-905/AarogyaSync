const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');

const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/appError');

const app = express();

// Production-ready CORS supporting Vercel, local development, and custom CORS_ORIGIN
const configuredOrigins = (env.CORS_ORIGIN || '*')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, mobile app, and non-browser requests without origin header
    if (!origin) return callback(null, true);

    // If wildcard configured or exact origin match
    if (configuredOrigins.includes('*') || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Automatically allow Vercel production and preview deployment URLs
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Allow local development environments
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-device-id']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/v1', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    project: 'AarogyaSync',
    tagline: 'Rural Healthcare Progressive Web App REST API',
    version: '1.0.0',
    documentation: '/api/v1/health'
  });
});

// 404 Handler for Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Endpoint ${req.originalUrl} not found on this server`, 404));
});

// Global Centralized Error Handler
app.use(errorHandler);

module.exports = app;
