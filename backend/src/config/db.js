const { Pool } = require('pg');
const env = require('./env');

let pool = null;
let isConnected = false;

if (env.DATABASE_URL && env.DATABASE_URL.trim().length > 0) {
  pool = new Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 10000,
    max: 20
  });

  // Attempt initial connectivity check
  pool.connect()
    .then((client) => {
      isConnected = true;
      console.log('✅ PostgreSQL connected successfully');
      client.release();
    })
    .catch((err) => {
      isConnected = false;
      console.warn('⚠️ PostgreSQL connection failed:', err.message);
      console.warn('ℹ️ Backend running with high-resilience memory fallback. Connect PostgreSQL to enable full database persistence.');
    });

  pool.on('error', (err) => {
    console.error('💥 Unexpected PostgreSQL pool error:', err.message);
    isConnected = false;
  });
} else {
  console.log('ℹ️ No DATABASE_URL provided. Backend running in high-resilience in-memory mode.');
}

module.exports = {
  get pool() { return pool; },
  getIsConnected: () => isConnected,
  setIsConnected: (val) => { isConnected = val; },
  query: async (text, params) => {
    if (!isConnected) {
      throw new Error('Database is offline or not configured.');
    }
    return pool.query(text, params);
  },
  transaction: async (callback) => {
    if (!isConnected) {
      throw new Error('Database is offline or not configured.');
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
};
