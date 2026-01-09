const { pool } = require('../config/db');

const addPublicHolidaysColumn = async () => {
    try {
        console.log('Checking for publicHolidays column...');
        const [rows] = await pool.query("SHOW COLUMNS FROM attendance_settings LIKE 'publicHolidays'");

        if (rows.length === 0) {
            console.log('Adding publicHolidays column...');
            await pool.query("ALTER TABLE attendance_settings ADD COLUMN publicHolidays JSON AFTER weekendDays");
            console.log('Column added successfully');
        } else {
            console.log('Column already exists');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error modifying table:', error);
        process.exit(1);
    }
};

addPublicHolidaysColumn();
