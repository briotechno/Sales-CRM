const { pool } = require('../config/db');

const ChannelConfig = {
    // Standard CRUD for integration configs
    create: async (data) => {
        const { user_id, channel_type, account_name, api_key, config_data } = data;
        const [result] = await pool.query(
            'INSERT INTO channel_configs (user_id, channel_type, account_name, api_key, config_data) VALUES (?, ?, ?, ?, ?)',
            [user_id, channel_type, account_name, api_key, JSON.stringify(config_data || {})]
        );
        return result.insertId;
    },

    findAll: async (userId, channelType) => {
        const [rows] = await pool.query(
            'SELECT * FROM channel_configs WHERE user_id = ? AND channel_type = ? ORDER BY id DESC',
            [userId, channelType]
        );
        return rows;
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query(
            'SELECT * FROM channel_configs WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    },

    update: async (id, userId, data) => {
        const updates = [];
        const values = [];

        if (data.account_name) { updates.push('account_name = ?'); values.push(data.account_name); }
        if (data.api_key) { updates.push('api_key = ?'); values.push(data.api_key); }
        if (data.config_data) { updates.push('config_data = ?'); values.push(JSON.stringify(data.config_data)); }
        if (data.status) { updates.push('status = ?'); values.push(data.status); }
        if (data.last_sync_at) { updates.push('last_sync_at = ?'); values.push(data.last_sync_at); }

        if (updates.length === 0) return;

        values.push(id, userId);
        await pool.query(
            `UPDATE channel_configs SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM channel_configs WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

module.exports = ChannelConfig;
