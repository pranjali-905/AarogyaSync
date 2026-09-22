const { error } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred on the server.';
  let errors = err.errors || null;

  // Handle PostgreSQL Error Codes
  if (err.code === '23505') {
    // Unique violation
    statusCode = 409;
    const detail = err.detail || '';
    message = 'Duplicate entry conflict: A record with this unique attribute already exists.';
    if (detail.includes('phone')) {
      message = 'An account is already registered with this phone number.';
    } else if (detail.includes('abha_id')) {
      message = 'A patient is already registered with this ABHA ID.';
    } else if (detail.includes('idempotency_key')) {
      message = 'Record with this idempotency key has already been synced.';
    }
  } else if (err.code === '23503') {
    // Foreign key violation
    statusCode = 400;
    message = 'Invalid reference: Associated related entity does not exist.';
  } else if (err.code === '22P02') {
    // Invalid text representation
    statusCode = 400;
    message = 'Invalid data format or ID parameter provided.';
  } else if (err.code === '42P01') {
    // Undefined table
    statusCode = 503;
    message = 'Database tables have not yet been migrated. Please execute "npm run db:migrate".';
  }

  // Handle JWT specific errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authorization token. Please login again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authorization session has expired. Please login again.';
  }

  return error(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? (errors || err.stack) : errors
  );
};

module.exports = errorHandler;
