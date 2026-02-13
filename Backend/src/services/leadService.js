const Lead = require('../models/leadModel');
const { pool } = require('../config/db');
const leadAssignmentService = require('./leadAssignmentService');

const LeadService = {
    /**
     * Process and save a lead from an external source
     * @param {Object} leadData - The lead data fields
     * @param {Number} userId - The enterprise/system user ID
     * @param {String} source - Lead source (e.g., 'crm_form', 'google_sheets')
     */
    processLead: async (leadData, userId, source) => {
        // Map common field names to DB columns if they are missing
        if (!leadData.name && leadData.full_name) leadData.name = leadData.full_name;
        if (!leadData.name && leadData.FullName) leadData.name = leadData.FullName;
        if (!leadData.email && leadData.Email) leadData.email = leadData.Email;
        if (!leadData.mobile_number && leadData.phone) leadData.mobile_number = leadData.phone;
        if (!leadData.mobile_number && leadData.Phone) leadData.mobile_number = leadData.Phone;
        if (!leadData.interested_in && leadData.services) leadData.interested_in = leadData.services;
        if (!leadData.interested_in && leadData.Services) leadData.interested_in = leadData.Services;

        const { email, mobile_number, name } = leadData;


        // 1. Duplicate Detection
        const duplicate = await LeadService.checkDuplicate(email, mobile_number, userId);
        if (duplicate) {
            // Update existing lead or skip? Usually sync updates or skips.
            // Requirement says: "Handle duplicate records and update existing leads when needed."
            await Lead.update(duplicate.id, { ...leadData, lead_source: source }, userId);
            return { action: 'updated', id: duplicate.id };
        }

        // 2. Prepare default fields if missing
        const finalLeadData = {
            ...leadData,
            lead_source: source,
            status: leadData.status || 'Active',
            type: leadData.type || 'Person',
            tag: leadData.tag || 'Not Contacted',
            visibility: leadData.visibility || 'Everyone',
            location: leadData.location || 'Website'
        };

        // If pipeline or stage is missing, find default for user
        if (!finalLeadData.pipeline_id || !finalLeadData.stage_id) {
            const [pipelines] = await pool.query(
                'SELECT id FROM pipelines WHERE user_id = ? ORDER BY id ASC LIMIT 1',
                [userId]
            );
            if (pipelines.length > 0) {
                finalLeadData.pipeline_id = finalLeadData.pipeline_id || pipelines[0].id;

                const [stages] = await pool.query(
                    'SELECT id FROM pipeline_stages WHERE pipeline_id = ? ORDER BY stage_order ASC LIMIT 1',
                    [finalLeadData.pipeline_id]
                );
                if (stages.length > 0) {
                    finalLeadData.stage_id = finalLeadData.stage_id || stages[0].id;
                }
            }
        }


        // 3. Create Lead
        const leadId = await Lead.create(finalLeadData, userId);

        // 4. Handle Auto-Assignment if enabled
        await leadAssignmentService.autoAssign(leadId, userId);

        return { action: 'created', id: leadId };
    },

    checkDuplicate: async (email, mobile, userId) => {
        if (!email && !mobile) return null;

        let query = 'SELECT id FROM leads WHERE user_id = ? AND (';
        const params = [userId];
        const conditions = [];

        if (email) {
            conditions.push('email = ?');
            params.push(email);
        }
        if (mobile) {
            conditions.push('mobile_number = ?');
            params.push(mobile);
        }

        if (conditions.length === 0) return null;

        query += conditions.join(' OR ') + ') LIMIT 1';

        const [rows] = await pool.query(query, params);
        return rows[0] || null;
    }
};

module.exports = LeadService;
