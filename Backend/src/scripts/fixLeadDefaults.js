require('dotenv').config();
const { pool } = require('../config/db');

const fixLeadDefaults = async () => {
    const connection = await pool.getConnection();
    try {
        console.log('Fixing leads table defaults and nullability (Run 2)...');

        const columnsToFix = [
            // Critical fix
            "MODIFY COLUMN not_connected_reason TEXT NULL",

            // Core fields
            "MODIFY COLUMN lead_source VARCHAR(255) NULL",
            "MODIFY COLUMN visibility VARCHAR(50) DEFAULT 'Public'",
            "MODIFY COLUMN value DECIMAL(15,2) DEFAULT 0",
            "MODIFY COLUMN status VARCHAR(50) DEFAULT 'Open'",
            "MODIFY COLUMN type VARCHAR(50) DEFAULT 'Individual'",
            "MODIFY COLUMN tag VARCHAR(50) DEFAULT 'Not Contacted'",

            // Personal & Contact
            "MODIFY COLUMN email VARCHAR(255) NULL",
            "MODIFY COLUMN website VARCHAR(255) NULL",

            // Personal Details
            "MODIFY COLUMN full_name VARCHAR(255) NULL",
            "MODIFY COLUMN gender VARCHAR(50) NULL",
            "MODIFY COLUMN dob DATE NULL",
            "MODIFY COLUMN alt_mobile_number VARCHAR(20) NULL",
            "MODIFY COLUMN address TEXT NULL",
            "MODIFY COLUMN city VARCHAR(100) NULL",
            "MODIFY COLUMN state VARCHAR(100) NULL",
            "MODIFY COLUMN pincode VARCHAR(20) NULL",
            "MODIFY COLUMN interest_in VARCHAR(255) NULL",
            "MODIFY COLUMN interested_in VARCHAR(255) NULL",
            "MODIFY COLUMN profile_image VARCHAR(500) NULL",
            "MODIFY COLUMN whatsapp_number VARCHAR(20) NULL",
            "MODIFY COLUMN country VARCHAR(100) NULL",

            // Organization Details
            "MODIFY COLUMN organization_name VARCHAR(255) NULL",
            "MODIFY COLUMN industry_type VARCHAR(100) NULL",
            "MODIFY COLUMN company_email VARCHAR(255) NULL",
            "MODIFY COLUMN company_phone VARCHAR(20) NULL",
            "MODIFY COLUMN gst_pan_number VARCHAR(100) NULL",
            "MODIFY COLUMN gst_number VARCHAR(100) NULL",
            "MODIFY COLUMN org_address TEXT NULL",
            "MODIFY COLUMN org_city VARCHAR(100) NULL",
            "MODIFY COLUMN org_state VARCHAR(100) NULL",
            "MODIFY COLUMN org_pincode VARCHAR(20) NULL",
            "MODIFY COLUMN company_address TEXT NULL",
            "MODIFY COLUMN org_country VARCHAR(100) NULL",

            // Primary Contact
            "MODIFY COLUMN primary_contact_name VARCHAR(255) NULL",
            "MODIFY COLUMN primary_dob DATE NULL",
            "MODIFY COLUMN designation VARCHAR(100) NULL",
            "MODIFY COLUMN primary_mobile VARCHAR(20) NULL",
            "MODIFY COLUMN primary_email VARCHAR(255) NULL",

            // Meta/System
            "MODIFY COLUMN description TEXT NULL",
            "MODIFY COLUMN assigned_to INT NULL",
            "MODIFY COLUMN referral_mobile VARCHAR(20) NULL",
            "MODIFY COLUMN custom_fields JSON NULL",
            "MODIFY COLUMN contact_persons JSON NULL",
            "MODIFY COLUMN is_read TINYINT(1) DEFAULT 0",
            "MODIFY COLUMN priority VARCHAR(50) DEFAULT 'Medium'",

            // Call Flow fields
            "MODIFY COLUMN last_call_at DATETIME NULL",
            "MODIFY COLUMN next_call_at DATETIME NULL",
            "MODIFY COLUMN call_count INT DEFAULT 0",
            "MODIFY COLUMN not_connected_count INT DEFAULT 0",
            "MODIFY COLUMN connected_count INT DEFAULT 0",
            "MODIFY COLUMN drop_reason TEXT NULL",
            "MODIFY COLUMN call_success_rate DECIMAL(5,2) DEFAULT 0",
            "MODIFY COLUMN follow_up_frequency INT DEFAULT 0",
            "MODIFY COLUMN response_quality VARCHAR(50) NULL",
            "MODIFY COLUMN conversion_probability DECIMAL(5,2) DEFAULT 0",
            "MODIFY COLUMN is_trending TINYINT(1) DEFAULT 0",

            // Call Remarks & Duration
            "MODIFY COLUMN call_remarks TEXT NULL",
            "MODIFY COLUMN last_call_duration INT NULL"
        ];

        // Ensure not_connected_reason exists
        try {
            await connection.query("ALTER TABLE leads ADD COLUMN IF NOT EXISTS not_connected_reason TEXT NULL");
            console.log("Ensured not_connected_reason column exists.");
        } catch (err) {
            console.log("Note: ADD COLUMN IF NOT EXISTS might not be supported or column exists.");
        }

        for (const col of columnsToFix) {
            try {
                await connection.query(`ALTER TABLE leads ${col}`);
                console.log(`Executed: ${col}`);
            } catch (err) {
                if (err.code === 'ER_BAD_FIELD_ERROR') {
                    console.log(`Skipped (column missing): ${col}`);
                } else {
                    console.error(`Error fixing column (${col}): ${err.message}`);
                }
            }
        }

        console.log('Attributes fixed successfully (Run 2).');

    } catch (error) {
        console.error('Error in fixLeadDefaults:', error);
    } finally {
        connection.release();
        process.exit();
    }
};

fixLeadDefaults();
