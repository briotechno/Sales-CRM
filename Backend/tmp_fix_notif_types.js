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
        console.log('Fixing notification types for Admin...');
        
        // 1. Any notification for the 'Admin' user ID (where user exists in 'users' table)
        // AND was created with 'messenger' or other staff types.
        // We'll trust that most early notifications for these IDs were Admin.
        await pool.query("UPDATE notifications SET user_type = 'user' WHERE user_id IN (SELECT id FROM users) AND (title LIKE '%Leave Request%' OR type = 'messenger' OR type = 'hr')");
        
        console.log('Successfully updated Admin notifications.');
    } catch (e) {
        console.error('Update error:', e);
    } finally {
        await pool.end();
    }
};

run();
