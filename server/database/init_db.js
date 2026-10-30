const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const host = process.env.DB_HOST || '127.0.0.1';
const port = parseInt(process.env.DB_PORT, 10) || 3306;
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
const database = process.env.DB_NAME || 'roshani_traders';

async function initDatabase() {
  console.log(`Connecting to MySQL Server on ${host}:${port} as ${user}...`);
  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });
    console.log('✓ Successfully connected to MySQL Server!');

    // 1. Ensure database exists
    console.log(`Ensuring database "${database}" exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${database}\`;`);

    // 2. Execute schema.sql
    console.log('Running schema.sql migrations...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await connection.query(schemaSql);
    console.log('✓ Schema created successfully (all 8 tables, indexes, constraints).');

    // 3. Execute seed.sql
    console.log('Running seed.sql data insertion...');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await connection.query(seedSql);
    console.log('✓ Seed data inserted successfully (categories, 28 products, sample users, quotes, contents, FAQs).');

    // 4. Verify table counts
    const tables = ['users', 'categories', 'products', 'quotes', 'quote_items', 'enquiries', 'contents', 'faqs'];
    console.log('\n--- Database Verification Summary ---');
    for (const table of tables) {
      const [rows] = await connection.query(`SELECT COUNT(*) AS total FROM \`${table}\``);
      console.log(`  Table \`${table}\`: ${rows[0].total} records`);
    }
    console.log('-------------------------------------\n');
    console.log('Database initialization completed successfully! 🎉');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
