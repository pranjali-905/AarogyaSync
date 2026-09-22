const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');

const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/appError');

const app = express();

// Middleware
app.use(cors({
  origin: env.CORS_ORIGIN || '*',
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
