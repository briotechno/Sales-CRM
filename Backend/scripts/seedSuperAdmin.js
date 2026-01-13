const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/db');
require('dotenv').config();

const seedSuperAdmin = async () => {
    const firstName = 'Super';
    const lastName = 'Admin';
    const email = 'superadmin@gmail.com';
    const mobileNumber = '1234567890';
    const businessName = 'Sales CRM';
    const businessType = 'Management';
    const gst = '00AAAAA0000A1Z5';
    const address = 'Main Office';
    const password = 'superadmin123';
    const role = 'Super Admin';

    try {
        // Check if user already exists
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            console.log('Super Admin already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            `INSERT INTO users (
                firstName, 
                lastName, 
                email, 
                mobileNumber, 
                businessName, 
                businessType, 
                gst, 
                address, 
                password,
                role
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                firstName,
                lastName,
                email,
                mobileNumber,
                businessName,
                businessType,
                gst,
                address,
                hashedPassword,
                role
            ]
        );

        console.log('Super Admin created successfully!');
        console.log('Email: ' + email);
        console.log('Password: ' + password);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding Super Admin:', error);
        process.exit(1);
    }
};

seedSuperAdmin();
