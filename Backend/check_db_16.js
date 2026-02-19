const { pool } = require('./src/config/db');

async function checkData() {
    try {
        const [users] = await pool.query("SELECT id, firstName, lastName FROM users WHERE id = 16");
        console.log("User 16:", users);

        const [employees] = await pool.query("SELECT id, employee_name FROM employees WHERE id = 16 OR employee_id = '16'");
        console.log("Employee 16:", employees);

        const [leads] = await pool.query("SELECT id, assigned_to, owner_name FROM leads WHERE assigned_to = '16'");
        console.log("Leads with 16:", leads);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkData();
