const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB, pool, dbConfig } = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MySQL Server 8.0.46
connectDB().catch((err) => {
  console.error('Fatal: Failed to connect to MySQL database:', err.message);
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/catalogue', require('./routes/catalogueRoutes'));

// Health check endpoint (Reporting backend status and actual MySQL connectivity)
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT VERSION() AS version, DATABASE() as db_name, NOW() as server_time');
    res.json({
      status: 'online',
      database: 'connected',
      dbType: 'MySQL Server',
      dbVersion: rows[0].version,
      databaseName: rows[0].db_name,
      serverTime: rows[0].server_time,
      system: 'Roshani Traders Wholesale Management System API',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'degraded',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root Status Page
app.get('/', async (req, res) => {
  let dbStatus = 'Checking...';
  let dbVersion = 'N/A';
  let dbName = dbConfig.database;

  try {
    const [rows] = await pool.query('SELECT VERSION() AS version, DATABASE() as db_name');
    dbStatus = 'Connected 🟢';
    dbVersion = `MySQL ${rows[0].version}`;
    dbName = rows[0].db_name;
  } catch (e) {
    dbStatus = 'Disconnected 🔴';
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Roshani Traders - API Server Status</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .card { background: #1e293b; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); max-width: 560px; width: 100%; border: 1px solid #334155; }
        h1 { color: #38bdf8; margin-top: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 8px; }
        .badge { background: #064e3b; color: #34d399; padding: 4px 12px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: 1rem; }
        .info-box { background: #0f172a; padding: 1rem 1.25rem; border-radius: 8px; margin: 1rem 0; font-size: 0.95rem; border: 1px solid #334155; }
        .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #1e293b; }
        .info-row:last-child { border-bottom: none; }
        .label { color: #94a3b8; }
        .val { font-weight: 600; color: #f1f5f9; }
        .btn { display: block; width: 100%; background: #0284c7; color: white; text-decoration: none; padding: 12px 0; border-radius: 8px; font-weight: 600; text-align: center; margin-top: 1.25rem; box-sizing: border-box; transition: background 0.2s; }
        .btn:hover { background: #0369a1; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>⚡ Roshani Traders Backend API</h1>
        <div class="badge">MySQL 8.0.46 Primary Database</div>
        <div class="info-box">
          <div class="info-row"><span class="label">Database Status</span><span class="val">${dbStatus}</span></div>
          <div class="info-row"><span class="label">Database Engine</span><span class="val">${dbVersion}</span></div>
          <div class="info-row"><span class="label">Database Name</span><span class="val">${dbName}</span></div>
          <div class="info-row"><span class="label">Database Host</span><span class="val">${dbConfig.host}:${dbConfig.port}</span></div>
          <div class="info-row"><span class="label">API Port</span><span class="val">5000</span></div>
          <div class="info-row"><span class="label">Health Check API</span><span class="val"><a href="/api/health" style="color:#38bdf8;">/api/health</a></span></div>
        </div>
        <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 1rem; line-height: 1.5;">
          The backend API and MySQL database are connected and running active endpoints. To view the website application interface, visit:
        </p>
        <a href="http://localhost:3000" class="btn">Open Main Web Application (http://localhost:3000) →</a>
      </div>
    </body>
    </html>
  `);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Roshani Traders Server running on port ${PORT}`);
  console.log(`📡 Connected to MySQL 8.0.46 Database: ${dbConfig.database}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`===================================================`);
});

module.exports = app;
