const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:LCXd003@localhost:5432/whistleblower_db',
});

pool.on('error', (err) => {
    console.error('Database error:', err);
    process.exit(-1);
});

module.exports = pool;