const { pool } = require('../config/db');
const LeadAssignmentSettings = require('../models/leadAssignmentSettingsModel');
const LeadAssignmentLog = require('../models/leadAssignmentLogModel');
const Lead = require('../models/leadModel');

const leadAssignmentService = {
    autoAssign: async (leadId, userId, excludeEmployeeId = null) => {
        try {
            // 1. Get Global Settings
            const settings = await LeadAssignmentSettings.findByUserId(userId);
            let mode = settings?.mode || 'manual';

            // 2. Fetch Lead details to get Source and Priority
            const [leads] = await pool.query('SELECT lead_source, priority, tag FROM leads WHERE id = ?', [leadId]);
            if (!leads.length) return;
            const lead = leads[0];

            // If it's a duplicate, don't auto-assign
            if (lead.tag === 'Duplicate') return;

            // 3. Check for Active Campaign matching the source
            const [campaigns] = await pool.query(
                `SELECT * FROM campaigns 
                 WHERE user_id = ? AND source = ? AND status = 'active'
                 AND start_date <= CURDATE() AND end_date >= CURDATE()
                 AND start_time <= CURTIME() AND end_time >= CURTIME()
                 LIMIT 1`,
                [userId, lead.lead_source]
            );

            let campaign = campaigns.length > 0 ? campaigns[0] : null;
            let campaignAudience = [];

            if (campaign) {
                // Check if campaign has reached its daily lead limit
                if (campaign.lead_limit_type === 'Fixed Limit' && campaign.leads_generated >= campaign.leads_per_day) {
                    console.log(`Campaign ${campaign.name} reached daily limit.`);
                    campaign = null; // Fallback to global
                } else {
                    // Get Campaign Audience Overrides
                    const [audience] = await pool.query(
                        `SELECT ca.*, e.employee_name 
                         FROM campaign_audience ca
                         JOIN employees e ON ca.employee_id = e.id
                         WHERE ca.campaign_id = ? AND e.status = 'Active'`,
                        [campaign.id]
                    );
                    campaignAudience = audience;
                }
            }

            // If manual mode and no campaign matches, exit
            if (mode === 'manual' && !campaign) {
                console.log('Manual mode active and no matching campaign found. Skipping auto-assignment.');
                return;
            }

            // 4. Find potential employees
            let candidates = [];

            // Fetch current assignment if any (for reassignment logic)
            const [currentLeadStatus] = await pool.query('SELECT assigned_to FROM leads WHERE id = ?', [leadId]);
            const isInitialAssignment = (!currentLeadStatus[0]?.assigned_to) && (!excludeEmployeeId);

            if (campaign && campaignAudience.length > 0) {
                // Candidates are defined by the campaign
                for (let aud of campaignAudience) {
                    const [stats] = await pool.query(
                        `SELECT 
                            (SELECT COUNT(*) FROM leads WHERE assigned_to = ? AND user_id = ? AND DATE(assigned_at) = CURDATE()) as daily_count,
                            (SELECT COUNT(*) FROM leads WHERE assigned_to = ? AND user_id = ? AND tag NOT IN ('Closed', 'Lost', 'Won', 'Duplicate')) as active_balance`,
                        [aud.employee_id, userId, aud.employee_id, userId]
                    );

                    const daily_count = stats[0].daily_count;
                    const active_balance = stats[0].active_balance;

                    // Apply Campaign Overrides or Global Defaults
                    const dailyLimit = aud.is_unlimited ? Infinity : (aud.daily_limit_override || settings?.leads_per_employee_per_day || 10);
                    const maxBalance = aud.max_balance_override || settings?.max_active_leads_balance || 5;

                    if (daily_count < dailyLimit && active_balance < maxBalance) {
                        candidates.push({
                            id: aud.employee_id,
                            employee_name: aud.employee_name,
                            daily_count,
                            active_balance,
                            is_io: aud.is_investigation_officer
                        });
                    }
                }
            } else if (mode === 'auto') {
                // Use Global Pool
                const [employees] = await pool.query(
                    `SELECT id, employee_name,
                        (SELECT COUNT(*) FROM leads l WHERE l.assigned_to = e.id AND l.user_id = ? AND DATE(l.assigned_at) = CURDATE()) as daily_count,
                        (SELECT COUNT(*) FROM leads l WHERE l.assigned_to = e.id AND l.user_id = ? AND l.tag NOT IN ('Closed', 'Lost', 'Won', 'Duplicate')) as active_balance
                     FROM employees e
                     WHERE e.user_id = ? AND e.status = 'Active'`,
                    [userId, userId, userId]
                );

                candidates = employees.filter(emp => {
                    const dailyLimit = settings?.leads_per_employee_per_day || 10;
                    const maxBalance = settings?.max_active_leads_balance || 5;
                    const isNotExcluded = excludeEmployeeId ? Number(emp.id) !== Number(excludeEmployeeId) : true;
                    return emp.daily_count < dailyLimit && emp.active_balance < maxBalance && isNotExcluded;
                });
            }

            if (candidates.length === 0) {
                console.log('No available employees found for assignment.');
                return;
            }

            // 5. Priority Handling
            if (settings?.priority_handling && lead.priority === 'High') {
                const ios = candidates.filter(c => c.is_io);
                if (ios.length > 0) candidates = ios;
            }

            // 6. Strategy: Round Robin (Pick least daily count to be fair, or least active balance)
            candidates.sort((a, b) => a.active_balance - b.active_balance || a.daily_count - b.daily_count);
            const selectedEmployee = candidates[0];

            // 7. Perform Assignment
            await Lead.update(leadId, {
                assigned_to: selectedEmployee.id,
                owner_name: selectedEmployee.employee_name,
                assigned_at: new Date()
            }, userId);

            if (campaign && isInitialAssignment) {
                await pool.query('UPDATE campaigns SET leads_generated = leads_generated + 1 WHERE id = ?', [campaign.id]);
            }

            // 8. Log Assignment
            await LeadAssignmentLog.create({
                user_id: userId,
                lead_id: leadId,
                employee_id: selectedEmployee.id,
                assigned_by: 'system',
                assignment_type: 'auto',
                reason: campaign ? `Campaign: ${campaign.name}` : 'Auto Assignment Rule'
            });

            // 9. Real-time Notification
            const { getIO } = require('../socket');
            const io = getIO();
            if (io) {
                const userKey = `${selectedEmployee.id}_employee`;
                io.to(userKey).emit('new_lead_assigned', {
                    leadId,
                    employeeName: selectedEmployee.employee_name,
                    campaignName: campaign?.name || null
                });

                // Also notify admin room for stats update
                if (campaign && isInitialAssignment) {
                    io.to(`user_${userId}_admin`).emit('campaign_update', {
                        campaignId: campaign?.id,
                        newHits: campaign ? campaign.leads_generated + 1 : campaign.leads_generated
                    });
                }
            }

            console.log(`Lead ${leadId} assigned to ${selectedEmployee.employee_name}`);

        } catch (error) {
            console.error('Auto-assignment error:', error);
        }
    },

    handleCallResult: async (leadId, connected, employeeId) => {
        try {
            if (connected) return; // Only handle failures for auto-rules

            // We need the admin's user_id, not the employee's ID
            const [leads] = await pool.query('SELECT user_id FROM leads WHERE id = ?', [leadId]);
            if (!leads.length) return;
            const userId = leads[0].user_id;

            const settings = await LeadAssignmentSettings.findByUserId(userId);
            if (!settings || settings.mode !== 'auto') return;

            // Get current call attempts
            const [calls] = await pool.query(
                'SELECT COUNT(*) as count FROM lead_calls WHERE lead_id = ? AND status != "Connected"',
                [leadId]
            );
            const failedAttempts = calls[0].count;

            if (failedAttempts >= settings.max_call_attempts) {
                if (settings.auto_disqualification) {
                    console.log(`Lead ${leadId} auto-disqualified after ${failedAttempts} attempts.`);
                    await pool.query("UPDATE leads SET tag = 'Lost', status = 'Closed' WHERE id = ?", [leadId]);

                    await LeadAssignmentLog.create({
                        user_id: userId,
                        lead_id: leadId,
                        employee_id: 0,
                        assigned_by: 'system',
                        assignment_type: 'auto',
                        reason: `Auto Disqualified (Reached ${failedAttempts} failed attempts)`
                    });
                } else if (settings.reassignment_on_disqualified) {
                    console.log(`Lead ${leadId} reassigning after ${failedAttempts} attempts.`);

                    const [currentLead] = await pool.query('SELECT assigned_to FROM leads WHERE id = ?', [leadId]);
                    const oldEmployeeId = currentLead[0]?.assigned_to;

                    // Unassign
                    await pool.query('UPDATE leads SET assigned_to = NULL, owner_name = NULL, assigned_at = NULL WHERE id = ?', [leadId]);

                    // Re-assign (excluding the last one)
                    await leadAssignmentService.autoAssign(leadId, userId, oldEmployeeId);

                    await LeadAssignmentLog.create({
                        user_id: userId,
                        lead_id: leadId,
                        employee_id: 0,
                        assigned_by: 'system',
                        assignment_type: 'auto',
                        reassigned_from: oldEmployeeId,
                        reason: `Auto Reassigned (Reached ${failedAttempts} failed attempts)`
                    });
                }
            }
        } catch (error) {
            console.error('Handle call result error:', error);
        }
    },

    revertStaleLeads: async () => {
        try {
            console.log('Checking for stale leads to revert...');
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

                await pool.query('UPDATE leads SET assigned_to = NULL, owner_name = NULL, assigned_at = NULL WHERE id = ?', [lead.id]);

                await leadAssignmentService.autoAssign(lead.id, lead.user_id);

                await LeadAssignmentLog.create({
                    user_id: lead.user_id,
                    lead_id: lead.id,
                    employee_id: 0,
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
