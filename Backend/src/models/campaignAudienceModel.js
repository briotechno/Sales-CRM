const { pool } = require('../config/db');

const CampaignAudience = {
    bulkCreate: async (campaignId, audiences) => {
        if (!audiences || audiences.length === 0) return;

        const values = audiences.map(a => [
            campaignId,
            a.employee_id,
            a.max_balance_override || null,
            a.daily_limit_override || null,
            a.is_unlimited || false,
            a.is_investigation_officer || false
        ]);

        const [result] = await pool.query(
            `INSERT INTO campaign_audience (
                campaign_id, employee_id, max_balance_override, 
                daily_limit_override, is_unlimited, is_investigation_officer
            ) VALUES ?`,
            [values]
        );
        return result;
    },

    findByCampaignId: async (campaignId) => {
        const [rows] = await pool.query(
            `SELECT ca.*, e.employee_name, e.profile_picture, t.team_name, t.id as team_id
             FROM campaign_audience ca
             JOIN employees e ON ca.employee_id = e.id
             LEFT JOIN team_members tm ON tm.employee_id = e.id
             LEFT JOIN teams t ON tm.team_id = t.id
             WHERE ca.campaign_id = ?`,
            [campaignId]
        );
        return rows;
    },

    deleteByCampaignId: async (campaignId) => {
        const [result] = await pool.query('DELETE FROM campaign_audience WHERE campaign_id = ?', [campaignId]);
        return result;
    }
};

module.exports = CampaignAudience;
