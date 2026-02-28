const { pool } = require('../config/db');

const updateAssignmentTables = async () => {
    try {
        console.log('Updating assignment tables...');

        // Check if columns already exist
        const [columns] = await pool.query('SHOW COLUMNS FROM lead_assignment_settings');
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('max_call_attempts')) {
            console.log('Adding max_call_attempts...');
            await pool.query('ALTER TABLE lead_assignment_settings ADD COLUMN max_call_attempts INT DEFAULT 5');
        }

        if (!columnNames.includes('call_time_gap_minutes')) {
            console.log('Adding call_time_gap_minutes...');
            await pool.query('ALTER TABLE lead_assignment_settings ADD COLUMN call_time_gap_minutes INT DEFAULT 60');
        }

        if (!columnNames.includes('auto_disqualification')) {
            console.log('Adding auto_disqualification...');
            await pool.query('ALTER TABLE lead_assignment_settings ADD COLUMN auto_disqualification BOOLEAN DEFAULT FALSE');
        }

        if (!columnNames.includes('reassignment_on_disqualified')) {
            console.log('Adding reassignment_on_disqualified...');
            await pool.query('ALTER TABLE lead_assignment_settings ADD COLUMN reassignment_on_disqualified BOOLEAN DEFAULT FALSE');
        }

        console.log('Assignment tables updated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating assignment tables:', error);
        process.exit(1);
    }
};

updateAssignmentTables();
