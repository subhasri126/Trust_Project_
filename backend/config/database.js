const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'charity_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database connected successfully');
        connection.release();
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
    }
}

testConnection();

// Query helper function
const query = async (text, params) => {
    try {
        const [results] = await pool.execute(text, params);
        const rowCount = results.length !== undefined ? results.length : results.affectedRows;
        return { rows: results, rowCount: rowCount };
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

module.exports = {
    pool,
    query
};
