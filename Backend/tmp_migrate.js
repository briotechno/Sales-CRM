const { pool } = require('./src/config/db');

async function migrate() {
    try {
        console.log("Checking campaigns table for new columns...");

        // Add selected_audiences
        try {
            await pool.query('ALTER TABLE campaigns ADD COLUMN selected_audiences JSON');
            console.log("Added selected_audiences column.");
        } catch (e) {
            console.log("selected_audiences column already exists or error:", e.message);
        }

        // Add hierarchy_settings
        try {
            await pool.query('ALTER TABLE campaigns ADD COLUMN hierarchy_settings JSON');
            console.log("Added hierarchy_settings column.");
        } catch (e) {
            console.log("hierarchy_settings column already exists or error:", e.message);
        }

        console.log("Migration finished.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
