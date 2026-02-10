const { pool } = require('../config/db');
const LeadAssignmentSettings = require('../models/leadAssignmentSettingsModel');
const LeadAssignmentLog = require('../models/leadAssignmentLogModel');
const Lead = require('../models/leadModel');

const leadAssignmentService = {
    autoAssign: async (leadId, userId) => {
        try {
            const settings = await LeadAssignmentSettings.findByUserId(userId);
            if (!settings || settings.mode !== 'auto') return;

            // 1. Find all active employees for this user
            const [employees] = await pool.query(
                `SELECT e.id, e.employee_name,
                    (SELECT COUNT(*) FROM leads l WHERE l.assigned_to = e.id AND l.user_id = ? AND DATE(l.assigned_at) = CURDATE()) as daily_count,
                    (SELECT COUNT(*) FROM leads l WHERE l.assigned_to = e.id AND l.user_id = ? AND l.tag NOT IN ('Closed', 'Lost')) as active_balance
                 FROM employees e
                 WHERE e.user_id = ? AND e.status = 'Active'`,
                [userId, userId, userId]
            );

            if (employees.length === 0) {
                console.log('No active employees available for auto-assignment');
                return;
            }

            // 2. Filter employees based on rules
            const availableEmployees = employees.filter(emp => {
                const withinDailyLimit = emp.daily_count < (settings.leads_per_employee_per_day || 10);
                const withinBalance = emp.active_balance < (settings.max_active_leads_balance || 5);
                return withinDailyLimit && withinBalance;
            });

            if (availableEmployees.length === 0) {
                console.log('All employees have reached their lead limits');
                return;
            }

            // 3. Selection Strategy (Round Robin - select employee with least active balance)
            availableEmployees.sort((a, b) => a.active_balance - b.active_balance || a.daily_count - b.daily_count);

            const selectedEmployee = availableEmployees[0];

            // 4. Perform Assignment
            await Lead.update(leadId, {
                assigned_to: selectedEmployee.id,
                assigned_at: new Date()
            }, userId);

            // 5. Log Assignment
            await LeadAssignmentLog.create({
                user_id: userId,
                lead_id: leadId,
                employee_id: selectedEmployee.id,
                assigned_by: 'system',
                assignment_type: 'auto',
                reason: 'Auto Assignment Rule'
            });

            console.log(`Lead ${leadId} auto-assigned to ${selectedEmployee.employee_name}`);

        } catch (error) {
            console.error('Auto-assignment error:', error);
        }
    },

    revertStaleLeads: async () => {
        try {
            console.log('Checking for stale leads to revert...');
            // This would ideally run for all users or we could trigger it specifically.
            // For now, let's find leads where assigned_at is older than revert_time_hours 
            // and status is still 'Open' or tag is 'Not Contacted'

            const [leadsToRevert] = await pool.query(`
                SELECT l.id, l.user_id, l.assigned_to, s.revert_time_hours
                FROM leads l
                JOIN lead_assignment_settings s ON l.user_id = s.user_id
                WHERE l.assigned_to IS NOT NULL
                AND s.mode = 'auto'
                AND (l.tag = 'Not Contacted' OR l.tag = 'Open')
                AND l.assigned_at < DATE_SUB(NOW(), INTERVAL s.revert_time_hours HOUR)
            `);

            for (const lead of leadsToRevert) {
                console.log(`Reverting lead ${lead.id} from employee ${lead.assigned_to}`);

                const oldEmployeeId = lead.assigned_to;

                // Clear assignment
                await pool.query('UPDATE leads SET assigned_to = NULL, assigned_at = NULL WHERE id = ?', [lead.id]);

                // Re-trigger auto-assignment
                await leadAssignmentService.autoAssign(lead.id, lead.user_id);

                // Log the revert action (the new assignment will log itself, but we can log the reason here)
                await LeadAssignmentLog.create({
                    user_id: lead.user_id,
                    lead_id: lead.id,
                    employee_id: 0, // System/Unassigned
                    assigned_by: 'system',
                    assignment_type: 'auto',
                    reassigned_from: oldEmployeeId,
                    reason: 'Auto Revert (Stale lead)'
                });
            }
        } catch (error) {
            console.error('Revert stale leads error:', error);
        }
    }
};

module.exports = leadAssignmentService;
