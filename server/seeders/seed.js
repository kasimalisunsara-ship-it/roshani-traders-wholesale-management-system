// Roshani Traders - MySQL Database Seeder Wrapper
// Forwards execution to server/database/init_db.js
const initDatabase = require('../database/init_db');

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
