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
            password
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
        password
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                firstName,
                lastName,
                email,
                mobileNumber,
                businessName,
                businessType,
                gst,
                address,
                password
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
            'SELECT id, firstName, lastName, email, mobileNumber, businessName, businessType, gst, address, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }
};

module.exports = User;
