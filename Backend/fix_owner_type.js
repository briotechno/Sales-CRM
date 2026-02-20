const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function migrate() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT) || 3306
    });

    try {
        console.log('--- Migration: Fixing lead_owner type ---');

        // Change lead_owner to VARCHAR if it's not already
        console.log('Altering lead_owner column to VARCHAR(255)...');
        await pool.query('ALTER TABLE leads MODIFY COLUMN lead_owner VARCHAR(255) DEFAULT NULL');
        console.log('Column lead_owner modified successfully.');

        console.log('--- Migration Completed ---');
        process.exit(0);
    } catch (error) {
        console.error('--- Migration Failed ---');
        console.error(error);
        process.exit(1);
    }
}

migrate();
