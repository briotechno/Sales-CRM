const LeadAssignmentSettings = require('../models/leadAssignmentSettingsModel');
const LeadAssignmentLog = require('../models/leadAssignmentLogModel');
const Lead = require('../models/leadModel');
const Employee = require('../models/employeeModel');
const { pool } = require('../config/db');

const leadAssignmentController = {
    getSettings: async (req, res) => {
        try {
            const settings = await LeadAssignmentSettings.findByUserId(req.user.id);
            res.json(settings || {
                mode: 'manual',
                leads_per_employee_per_day: 10,
                max_active_leads_balance: 5,
                revert_time_hours: 24,
                load_balancing_strategy: 'round_robin',
                priority_handling: true,
                max_call_attempts: 5,
                call_time_gap_minutes: 60,
                auto_disqualification: false,
                reassignment_on_disqualified: false
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateSettings: async (req, res) => {
        try {
            await LeadAssignmentSettings.upsert(req.user.id, req.body);
            res.json({ message: 'Settings updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getLogs: async (req, res) => {
        try {
            const { page, limit } = req.query;
            const logs = await LeadAssignmentLog.findAll(req.user.id, page, limit);
            res.json(logs);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    manualAssignLeads: async (req, res) => {
        try {
            const { leadIds, employeeIds, teamIds } = req.body;
            const userId = req.user.id;

            if (!leadIds || leadIds.length === 0) {
                return res.status(400).json({ message: 'No leads selected' });
            }

            // Collect all employee IDs (if teams selected, get their members)
            let allEmployeeIds = [...(employeeIds || [])];

            // Note: If teamIds is provided, we might need a model method to get all members
            // For now, assume frontend sends flat employee IDs for simplicity or implement team expansion here

            if (allEmployeeIds.length === 0) {
                return res.status(400).json({ message: 'No employees selected' });
            }

            // Distribute leads among selected employees
            for (let i = 0; i < leadIds.length; i++) {
                const leadId = leadIds[i];
                const employeeId = allEmployeeIds[i % allEmployeeIds.length];

                // Get current lead to track reassignment
                const currentLead = await Lead.findById(leadId, userId);
                const reassignedFrom = currentLead ? currentLead.assigned_to : null;

                // Get employee name for assigner_name and owner_name fields
                // Check both primary key 'id' and unique string 'employee_id'
                const [emps] = await pool.query(
                    'SELECT employee_name FROM employees WHERE id = ? OR employee_id = ?',
                    [employeeId, employeeId]
                );
                const empName = emps.length > 0 ? emps[0].employee_name : null;

                // Update lead with all necessary fields for UI consistency
                await Lead.update(leadId, {
                    assigned_to: employeeId,
                    owner_name: empName,
                    assigned_at: new Date()
                }, userId);

                // Log assignment history
                await LeadAssignmentLog.create({
                    user_id: userId,
                    lead_id: leadId,
                    employee_id: employeeId,
                    assigned_by: req.user.username || 'admin',
                    assignment_type: 'manual',
                    reassigned_from: reassignedFrom,
                    reason: 'Manual Assignment (Bulk/Workspace)'
                });

                // Log into Activity Timeline
                const LeadResources = require('../models/leadResourcesModel');
                await LeadResources.addActivity({
                    lead_id: leadId,
                    activity_type: 'notification',
                    title: `Lead Assigned to ${empName || 'Employee'}`,
                    description: `Lead assigned to ${empName || 'Employee (ID: ' + employeeId + ')'} by ${req.user.employee_name || req.user.username || 'admin'}.`
                }, userId);
            }

            res.json({ message: `${leadIds.length} lead(s) assigned successfully` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = leadAssignmentController;
