const { pool } = require('../config/db');

const BusinessInfo = {
    createOrUpdate: async (data) => {
        const {
            user_id, logo_url = null, company_name = '', legal_name = '', industry = '', business_type = '',
            company_description = '', founded_year = null, registration_number = '', gst_number = '',
            pan_number = '', bank_name = '', branch_name = '', account_number = '', ifsc_code = '',
            website = '', email = '', phone = '', street_address = '', city = '', state = '', pincode = '',
            country = '', vision = '', mission = '', whatsapp_link = '', facebook_link = '',
            linkedin_link = '', instagram_link = '', youtube_link = ''
        } = data;

        // Check if info exists for this user
        const [existing] = await pool.query('SELECT id FROM business_info WHERE user_id = ?', [user_id]);

        if (existing.length > 0) {
            // Update
            await pool.query(
                `UPDATE business_info SET 
                logo_url = ?, company_name = ?, legal_name = ?, industry = ?, business_type = ?,
                company_description = ?, founded_year = ?, registration_number = ?, gst_number = ?,
                pan_number = ?, bank_name = ?, branch_name = ?, account_number = ?, ifsc_code = ?,
                website = ?, email = ?, phone = ?, street_address = ?, city = ?, state = ?, 
                pincode = ?, country = ?, vision = ?, mission = ?,
                whatsapp_link = ?, facebook_link = ?, linkedin_link = ?, instagram_link = ?, youtube_link = ?
                WHERE user_id = ?`,
                [
                    logo_url, company_name, legal_name, industry, business_type,
                    company_description, founded_year, registration_number, gst_number,
                    pan_number, bank_name, branch_name, account_number, ifsc_code,
                    website, email, phone, street_address, city, state, pincode,
                    country, vision, mission, whatsapp_link, facebook_link,
                    linkedin_link, instagram_link, youtube_link, user_id
                ]
            );
            return existing[0].id;
        } else {
            // Create
            const [result] = await pool.query(
                `INSERT INTO business_info (
                user_id, logo_url, company_name, legal_name, industry, business_type,
                company_description, founded_year, registration_number, gst_number,
                pan_number, bank_name, branch_name, account_number, ifsc_code,
                website, email, phone, street_address, city, state, pincode,
                country, vision, mission, whatsapp_link, facebook_link, 
                linkedin_link, instagram_link, youtube_link
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    user_id, logo_url, company_name, legal_name, industry, business_type,
                    company_description, founded_year, registration_number, gst_number,
                    pan_number, bank_name, branch_name, account_number, ifsc_code,
                    website, email, phone, street_address, city, state, pincode,
                    country, vision, mission, whatsapp_link, facebook_link,
                    linkedin_link, instagram_link, youtube_link
                ]
            );
            return result.insertId;
        }
    },

    findByUserId: async (user_id) => {
        const [rows] = await pool.query('SELECT * FROM business_info WHERE user_id = ?', [user_id]);
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM business_info WHERE id = ?', [id]);
        return rows[0];
    }
};

module.exports = BusinessInfo;
