const { pool } = require('./src/config/db');

async function backfillOwnerNames() {
    try {
        console.log("Backfilling owner_names for existing leads...");

        // 1. Backfill from employees table
        await pool.query(`
            UPDATE leads l
            JOIN employees e ON (l.assigned_to = CAST(e.id AS CHAR) OR l.assigned_to = e.employee_id)
            SET l.owner_name = e.employee_name
            WHERE l.owner_name IS NULL OR l.owner_name = ''
        `);
        console.log("Backfilled from employees table.");

        // 2. Backfill from users table (Admins)
        await pool.query(`
            UPDATE leads l
            JOIN users u ON (l.assigned_to = CAST(u.id AS CHAR))
            SET l.owner_name = TRIM(CONCAT(IFNULL(u.firstName, ''), ' ', IFNULL(u.lastName, '')))
            WHERE l.owner_name IS NULL OR l.owner_name = ''
        `);
        console.log("Backfilled from users table.");

        process.exit(0);
    } catch (error) {
        console.error("Error backfilling:", error);
        process.exit(1);
    }
}

backfillOwnerNames();
