const { pool } = require('./src/config/db');

async function migrate() {
    try {
        console.log("Adding duplicate_reason to leads table...");
        await pool.query("ALTER TABLE leads ADD COLUMN duplicate_reason TEXT DEFAULT NULL AFTER tag");
        console.log("Migration successful!");
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log("Column duplicate_reason already exists.");
        } else {
            console.error("Migration failed:", e.message);
        }
    }
    process.exit();
}

migrate();
