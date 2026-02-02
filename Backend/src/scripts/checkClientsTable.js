const { pool } = require('../config/db');

const checkClientsTable = async () => {
    try {
        const [rows] = await pool.query('DESCRIBE clients');
        console.log('Clients table columns:');
        rows.forEach(r => console.log(`- ${r.Field} (${r.Type})`));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkClientsTable();
