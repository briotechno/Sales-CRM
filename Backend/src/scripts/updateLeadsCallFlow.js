require('dotenv').config();
const { pool } = require('../config/db');

const updateLeadsSchemaForCallFlow = async () => {
    const connection = await pool.getConnection();
    try {
        console.log('Updating leads table schema for call flow...');

        const columns = [
            "ADD COLUMN IF NOT EXISTS last_call_at DATETIME",
            "ADD COLUMN IF NOT EXISTS next_call_at DATETIME",
            "ADD COLUMN IF NOT EXISTS call_count INT DEFAULT 0",
            "ADD COLUMN IF NOT EXISTS not_connected_count INT DEFAULT 0",
            "ADD COLUMN IF NOT EXISTS connected_count INT DEFAULT 0",
            "ADD COLUMN IF NOT EXISTS drop_reason TEXT",
            "ADD COLUMN IF NOT EXISTS call_success_rate DECIMAL(5,2) DEFAULT 0",
            "ADD COLUMN IF NOT EXISTS follow_up_frequency INT DEFAULT 0",
            "ADD COLUMN IF NOT EXISTS response_quality VARCHAR(50)",
            "ADD COLUMN IF NOT EXISTS conversion_probability DECIMAL(5,2) DEFAULT 0",
            "ADD COLUMN IF NOT EXISTS is_trending TINYINT(1) DEFAULT 0"
        ];

        for (const col of columns) {
            try {
                await connection.query(`ALTER TABLE leads ${col}`);
                console.log(`Executed: ${col}`);
            } catch (err) {
                if (err.code !== 'ER_DUP_FIELDNAME') {
                    console.error(`Error adding column: ${err.message}`);
                }
            }
        }

        console.log('Leads table schema updated successfully.');
    } catch (error) {
        console.error('Error updating leads table:', error);
    } finally {
        connection.release();
        process.exit();
    }
};

updateLeadsSchemaForCallFlow();
