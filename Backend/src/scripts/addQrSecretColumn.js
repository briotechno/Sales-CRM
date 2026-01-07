const { pool } = require('../config/db');
const crypto = require('crypto');

const addQrSecretColumn = async () => {
    try {
        console.log('Checking for qrSecret column...');
        const [rows] = await pool.query("SHOW COLUMNS FROM attendance_settings LIKE 'qrSecret'");

        if (rows.length === 0) {
            console.log('Adding qrSecret column...');
            await pool.query("ALTER TABLE attendance_settings ADD COLUMN qrSecret VARCHAR(255) AFTER qrCodeEnabled");

            // Set a default random secret for existing settings
            const [settings] = await pool.query("SELECT user_id FROM attendance_settings");
            for (const setting of settings) {
                const secret = crypto.randomBytes(16).toString('hex');
                await pool.query("UPDATE attendance_settings SET qrSecret = ? WHERE user_id = ?", [secret, setting.user_id]);
            }

            console.log('Column added and secrets initialized successfully');
        } else {
            console.log('Column already exists');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error modifying table:', error);
        process.exit(1);
    }
};

addQrSecretColumn();
