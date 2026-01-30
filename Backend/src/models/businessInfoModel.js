const { pool } = require('../config/db');

const BusinessInfo = {
    createOrUpdate: async (data) => {
        const {
            user_id, logo_url = null, company_name = '', legal_name = '', industry = '', business_type = '',
            company_description = '', founded_year = null, registration_number = '', gst_number = '',
            pan_number = '', bank_name = '', branch_name = '', account_number = '', ifsc_code = '',
            website = '', email = '', phone = '', street_address = '', city = '', state = '', pincode = '',
            country = '', vision = '', mission = '', whatsapp_link = '', facebook_link = '',
            linkedin_link = '', instagram_link = '', youtube_link = '', twitter_link = '',
            social_links = [], contact_person = '', designation = '', alternate_phone = '', google_maps_link = ''
        } = data;
        let social_links_parsed = social_links;
        if (typeof social_links === 'string') {
            try {
                social_links_parsed = JSON.parse(social_links);
            } catch (e) {
                social_links_parsed = [];
            }
        }
        const socialLinksJson = JSON.stringify(Array.isArray(social_links_parsed) ? social_links_parsed : []);

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
                whatsapp_link = ?, facebook_link = ?, linkedin_link = ?, instagram_link = ?, 
                youtube_link = ?, twitter_link = ?, social_links = ?,
                contact_person = ?, designation = ?, alternate_phone = ?, google_maps_link = ?
                WHERE user_id = ?`,
                [
                    logo_url, company_name, legal_name, industry, business_type,
                    company_description, founded_year, registration_number, gst_number,
                    pan_number, bank_name, branch_name, account_number, ifsc_code,
                    website, email, phone, street_address, city, state, pincode,
                    country, vision, mission, whatsapp_link, facebook_link,
                    linkedin_link, instagram_link, youtube_link, twitter_link, socialLinksJson,
                    contact_person, designation, alternate_phone, google_maps_link, user_id
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
                linkedin_link, instagram_link, youtube_link, twitter_link, social_links,
                contact_person, designation, alternate_phone, google_maps_link
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    user_id, logo_url, company_name, legal_name, industry, business_type,
                    company_description, founded_year, registration_number, gst_number,
                    pan_number, bank_name, branch_name, account_number, ifsc_code,
                    website, email, phone, street_address, city, state, pincode,
                    country, vision, mission, whatsapp_link, facebook_link,
                    linkedin_link, instagram_link, youtube_link, twitter_link, socialLinksJson,
                    contact_person, designation, alternate_phone, google_maps_link
                ]
            );
            return result.insertId;
        }
    },

    findByUserId: async (user_id) => {
        const [rows] = await pool.query('SELECT * FROM business_info WHERE user_id = ?', [user_id]);
        if (rows[0] && typeof rows[0].social_links === 'string') {
            try {
                rows[0].social_links = JSON.parse(rows[0].social_links);
            } catch (e) {
                rows[0].social_links = [];
            }
        }
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM business_info WHERE id = ?', [id]);
        if (rows[0] && typeof rows[0].social_links === 'string') {
            try {
                rows[0].social_links = JSON.parse(rows[0].social_links);
            } catch (e) {
                rows[0].social_links = [];
            }
        }
        return rows[0];
    }
};

module.exports = BusinessInfo;
