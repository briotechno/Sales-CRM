const { pool } = require('./src/config/db');

async function checkData() {
    try {
        const [users] = await pool.query("SELECT id, firstName, lastName FROM users");
        console.log("USERS_START");
        users.forEach(u => console.log(`USER: ${u.id} - ${u.firstName} ${u.lastName}`));
        console.log("USERS_END");

        const [leads] = await pool.query("SELECT id, assigned_to, owner_name FROM leads WHERE assigned_to IS NOT NULL");
        console.log("LEADS_START");
        leads.forEach(l => console.log(`LEAD: ${l.id} - AssignedTo: ${l.assigned_to} - OwnerName: ${l.owner_name}`));
        console.log("LEADS_END");

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkData();
