const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const run = async () => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });

    try {
        const [rows] = await pool.query('SELECT created_at, NOW() as current_db_time FROM notifications ORDER BY id DESC LIMIT 5');
        console.log('Current Machine Time:', new Date().toLocaleString());
        console.log('Results:', JSON.stringify(rows, null, 2));
    } catch (e) {
        console.error('Check error:', e);
    } finally {
        await pool.end();
    }
};

run();
