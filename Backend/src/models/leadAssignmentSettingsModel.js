const { pool } = require('../config/db');

const LeadAssignmentSettings = {
    findByUserId: async (userId) => {
        const [rows] = await pool.query('SELECT * FROM lead_assignment_settings WHERE user_id = ?', [userId]);
        return rows[0];
    },

    upsert: async (userId, data) => {
        const {
            mode,
            leads_per_employee_per_day,
            max_active_leads_balance,
            revert_time_hours,
            load_balancing_strategy,
            priority_handling,
            max_call_attempts,
            call_time_gap_minutes,
            auto_disqualification,
            reassignment_on_disqualified
        } = data;

        const [result] = await pool.query(
            `INSERT INTO lead_assignment_settings (
                user_id, mode, leads_per_employee_per_day, max_active_leads_balance, 
                revert_time_hours, load_balancing_strategy, priority_handling,
                max_call_attempts, call_time_gap_minutes, auto_disqualification, reassignment_on_disqualified
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                mode = VALUES(mode),
                leads_per_employee_per_day = VALUES(leads_per_employee_per_day),
                max_active_leads_balance = VALUES(max_active_leads_balance),
                revert_time_hours = VALUES(revert_time_hours),
                load_balancing_strategy = VALUES(load_balancing_strategy),
                priority_handling = VALUES(priority_handling),
                max_call_attempts = VALUES(max_call_attempts),
                call_time_gap_minutes = VALUES(call_time_gap_minutes),
                auto_disqualification = VALUES(auto_disqualification),
                reassignment_on_disqualified = VALUES(reassignment_on_disqualified)`,
            [
                userId, mode, leads_per_employee_per_day, max_active_leads_balance,
                revert_time_hours, load_balancing_strategy, priority_handling,
                max_call_attempts || 5, call_time_gap_minutes || 60,
                auto_disqualification || false, reassignment_on_disqualified || false
            ]
        );
        return result;
    }
};

module.exports = LeadAssignmentSettings;
