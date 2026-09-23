const app = require('./app');
const http = require('http');
const env = require('./config/env');

const PORT = process.env.PORT || 5000;

/**
 * Run idempotent DB migration + demo seed before starting HTTP server.
 *
 * Safety guarantees:
 *  - schema.sql uses CREATE TABLE IF NOT EXISTS (never drops/truncates)
 *  - seed.sql uses INSERT ... ON CONFLICT (id) DO NOTHING (never overwrites)
 *  - If DATABASE_URL is absent the step is skipped; server still starts
 *    (in-memory fallback mode for local dev without a DB configured)
 *  - Migration failure in production will abort startup intentionally so
 *    Render shows the error log rather than serving a broken state.
 */
async function runStartupMigration() {
  if (!env.DATABASE_URL || env.DATABASE_URL.trim() === '') {
    console.log('ℹ️  DATABASE_URL not set — skipping automatic migration (in-memory mode).');
    return;
  }

  try {
    const runMigration = require('./db/migrate');
    // Pass --seed flag programmatically so demo personas are inserted on first deploy
    process.argv.push('--seed');
    await runMigration();
    // Clean up argv so the flag doesn't linger if server forks child processes
    process.argv = process.argv.filter(a => a !== '--seed');
  } catch (err) {
    process.argv = process.argv.filter(a => a !== '--seed');
    if (env.NODE_ENV === 'production') {
      console.error('💥 Startup migration failed in PRODUCTION — server will NOT start:', err.message);
      process.exit(1);
    } else {
      console.warn('⚠️  Startup migration failed (non-fatal in development). Server starting in in-memory mode.');
      console.warn('   Reason:', err.message);
    }
  }
}

async function main() {
  await runStartupMigration();

  const server = http.createServer(app);

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================================`);
    console.log(`🚀 AarogyaSync API Server running on port ${PORT}`);
    console.log(`📡 Health endpoint: /api/v1/health`);
    console.log(`🏥 Mode: ${env.NODE_ENV}`);
    console.log(`=================================================`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
}

main();
