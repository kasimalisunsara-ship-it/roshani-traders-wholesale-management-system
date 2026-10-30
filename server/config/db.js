const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'roshani_traders',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  dateStrings: true,
  decimalNumbers: true,
  namedPlaceholders: false
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Verify database connectivity when server starts
 */
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT VERSION() AS version, DATABASE() as db_name');
    connection.release();
    console.log(`===================================================`);
    console.log(`✓ MySQL Server Connected Successfully!`);
    console.log(`  Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`  Database: ${rows[0].db_name}`);
    console.log(`  Server Version: MySQL ${rows[0].version}`);
    console.log(`===================================================`);
    return pool;
  } catch (error) {
    console.error('❌ MySQL Database Connection Error:', error.message);
    console.error('Please ensure MySQL Server 8.0.46 is running on ' + dbConfig.host + ':' + dbConfig.port);
    throw error;
  }
};

/**
 * Helper to execute parameterized SQL query
 */
const query = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

/**
 * Helper to get a transaction connection
 */
const getTransaction = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
};

module.exports = {
  pool,
  connectDB,
  query,
  getTransaction,
  dbConfig
};
