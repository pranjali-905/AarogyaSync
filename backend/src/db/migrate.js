const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const env = require('../config/env');

async function runMigration() {
  const isSeedRequested = process.argv.includes('--seed');

  console.log('🚀 AarogyaSync Database Migration Initiated');
  console.log(`📡 Connecting to PostgreSQL: ${env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 5000
  });

  let client;
  try {
    client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');

    // 1. Run Schema DDL
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('📜 Executing schema DDL migrations...');
    await client.query(schemaSql);
    console.log('✅ Schema migration completed successfully (All 20+ tables & indexes ready)');

    // 2. Run Seed if requested
    if (isSeedRequested) {
      const seedPath = path.join(__dirname, 'seed.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        console.log('🌱 Seeding database with initial rural healthcare dataset...');
        await client.query(seedSql);
        console.log('✅ Database seeded successfully');
      }
    }

    console.log('🎉 All migrations completed successfully!');
  } catch (err) {
    console.error('💥 Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = runMigration;
