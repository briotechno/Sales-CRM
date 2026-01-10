const { pool } = require('./src/config/db');

async function migrate() {
    try {
        console.log('Starting migration for attendance_settings...');

        const newColumns = [
            'maternityLeave',
            'paternityLeave',
            'bereavementLeave',
            'marriageLeave'
        ];

        for (const col of newColumns) {
            try {
                // Check if column exists
                const [cols] = await pool.query(`SHOW COLUMNS FROM attendance_settings LIKE ?`, [col]);
                if (cols.length === 0) {
                    console.log(`Adding column ${col}...`);
                    await pool.query(`ALTER TABLE attendance_settings ADD COLUMN ${col} INT DEFAULT 0`);
                    console.log(`Column ${col} added successfully.`);
                } else {
                    console.log(`Column ${col} already exists.`);
                }
            } catch (err) {
                console.error(`Error processing column ${col}:`, err.message);
            }
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
