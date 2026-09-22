require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aarogyasync_db',
  JWT_SECRET: process.env.JWT_SECRET || 'aarogyasync_super_secret_jwt_key_sih_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

module.exports = env;
