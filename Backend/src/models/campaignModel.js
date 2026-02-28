const { pool } = require('../config/db');

const Campaign = {
    create: async (data) => {
        const {
            user_id, name, source, start_date, start_time,
            end_date, end_time, timing_type, lead_limit_type,
            leads_per_day, audience_type
        } = data;

        const [result] = await pool.query(
            `INSERT INTO campaigns (
                user_id, name, source, start_date, start_time, 
                end_date, end_time, timing_type, lead_limit_type,
                leads_per_day, audience_type, selected_audiences, hierarchy_settings
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, name, source, start_date, start_time,
                end_date, end_time, timing_type, lead_limit_type,
                leads_per_day, audience_type,
                JSON.stringify(data.selectedAudiences || []),
                JSON.stringify(data.hierarchySettings || {})
            ]
        );
        return result.insertId;
    },

    findAll: async (userId) => {
        const [rows] = await pool.query('SELECT * FROM campaigns WHERE user_id = ? ORDER BY id DESC', [userId]);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM campaigns WHERE id = ?', [id]);
        return rows[0];
    },

    updateStatus: async (id, status) => {
        const [result] = await pool.query('UPDATE campaigns SET status = ? WHERE id = ?', [status, id]);
        return result;
    },

    incrementHits: async (id) => {
        const [result] = await pool.query('UPDATE campaigns SET leads_generated = leads_generated + 1 WHERE id = ?', [id]);
        return result;
    },

    update: async (id, data, userId) => {
        const {
            name, source, start_date, start_time,
            end_date, end_time, timing_type, lead_limit_type,
            leads_per_day, audience_type
        } = data;

        const [result] = await pool.query(
            `UPDATE campaigns SET 
                name = ?, source = ?, start_date = ?, start_time = ?, 
                end_date = ?, end_time = ?, timing_type = ?, lead_limit_type = ?,
                leads_per_day = ?, audience_type = ?,
                selected_audiences = ?, hierarchy_settings = ?
            WHERE id = ? AND user_id = ?`,
            [
                name, source, start_date, start_time,
                end_date, end_time, timing_type, lead_limit_type,
                leads_per_day, audience_type,
                JSON.stringify(data.selectedAudiences || []),
                JSON.stringify(data.hierarchySettings || {}),
                id, userId
            ]
        );
        return result;
    },
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM campaigns WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Campaign;
