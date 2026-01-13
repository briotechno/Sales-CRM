const { pool } = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function seedSuperAdmin() {
    try {
        const email = 'superadmin@gmail.com';
        const password = 'password123'; // Default password
        const role = 'Super Admin';

        // Check if exists
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log('Super Admin already exists in users table.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            `INSERT INTO users (
                firstName, lastName, email, mobileNumber, 
                businessName, businessType, gst, address, 
                password, role, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                'Super', 'Admin', email, '0000000000',
                'Admin Console', 'System', 'N/A', 'HQ',
                hashedPassword, role
            ]
        );

        console.log(`Super Admin created successfully.`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit(0);

    } catch (error) {
        console.error('Error seeding Super Admin:', error);
        process.exit(1);
    }
}

seedSuperAdmin();
