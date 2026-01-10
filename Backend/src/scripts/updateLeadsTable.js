require('dotenv').config();
const { pool } = require('../config/db');

const updateLeadsTable = async () => {
    const connection = await pool.getConnection();
    try {
        console.log('Updating leads table schema...');

        // List of columns to check/add
        const columns = [
            "ADD COLUMN IF NOT EXISTS lead_source VARCHAR(255)",
            "ADD COLUMN IF NOT EXISTS visibility VARCHAR(50) DEFAULT 'Public'",
            "ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)",
            "ADD COLUMN IF NOT EXISTS gender VARCHAR(50)",
            "ADD COLUMN IF NOT EXISTS dob DATE",
            "ADD COLUMN IF NOT EXISTS alt_mobile_number VARCHAR(20)",
            "ADD COLUMN IF NOT EXISTS address TEXT",
            "ADD COLUMN IF NOT EXISTS city VARCHAR(100)",
            "ADD COLUMN IF NOT EXISTS state VARCHAR(100)",
            "ADD COLUMN IF NOT EXISTS pincode VARCHAR(20)",
            "ADD COLUMN IF NOT EXISTS interested_in VARCHAR(255)",
            "ADD COLUMN IF NOT EXISTS organization_name VARCHAR(255)",
            "ADD COLUMN IF NOT EXISTS industry_type VARCHAR(100)",
            "ADD COLUMN IF NOT EXISTS website VARCHAR(255)",
            "ADD COLUMN IF NOT EXISTS company_email VARCHAR(255)",
            "ADD COLUMN IF NOT EXISTS company_phone VARCHAR(20)",
            "ADD COLUMN IF NOT EXISTS gst_pan_number VARCHAR(100)",
            "ADD COLUMN IF NOT EXISTS org_address TEXT",
            "ADD COLUMN IF NOT EXISTS org_city VARCHAR(100)",
            "ADD COLUMN IF NOT EXISTS org_state VARCHAR(100)",
            "ADD COLUMN IF NOT EXISTS org_pincode VARCHAR(20)",
            "ADD COLUMN IF NOT EXISTS primary_contact_name VARCHAR(255)",
            "ADD COLUMN IF NOT EXISTS primary_dob DATE",
            "ADD COLUMN IF NOT EXISTS designation VARCHAR(100)",
            "ADD COLUMN IF NOT EXISTS primary_mobile VARCHAR(20)",
            "ADD COLUMN IF NOT EXISTS primary_email VARCHAR(255)",
            "ADD COLUMN IF NOT EXISTS description TEXT",
            "ADD COLUMN IF NOT EXISTS assigned_to INT", // For 'owner'
            "ADD COLUMN IF NOT EXISTS is_read TINYINT(1) DEFAULT 0",
            "ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Medium'"
        ];

        for (const col of columns) {
            try {
                await connection.query(`ALTER TABLE leads ${col}`);
                console.log(`Executed: ${col}`);
            } catch (err) {
                // Ignore if duplicate column error (though IF NOT EXISTS should handle it for supported versions)
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

updateLeadsTable();
