const { pool } = require('../config/db');

const User = {
    create: async (userData) => {
        const {
            firstName,
            lastName,
            email,
            mobileNumber,
            businessName,
            businessType,
            gst,
            address,
            password,
            role = 'Admin' // Default role
        } = userData;

        const [result] = await pool.query(
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
                password,
                role
            ]
        );
        return result.insertId;
    },

    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id, firstName, lastName, email, mobileNumber, businessName, businessType, gst, address, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }
};

module.exports = User;
