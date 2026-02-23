const { pool } = require('../config/db');

const Lead = {
    create: async (data, userId) => {
        let {
            name, mobile_number, email, value, pipeline_id, stage_id,
            status, type, tag, location,
            lead_source, visibility,
            full_name, gender, dob, alt_mobile_number, address, city, state, pincode, interested_in,
            profile_image, whatsapp_number, country,
            organization_name, industry_type, website, company_email, company_phone, gst_pan_number, gst_number,
            org_address, org_city, org_state, org_pincode, company_address, org_country,
            primary_contact_name, primary_dob, designation, primary_mobile, primary_email,
            description, owner, assigned_to, owner_name, referral_mobile, custom_fields, contact_persons, lead_owner, assigner_name
        } = data;

        // Sanitize Date Fields
        if (!dob) dob = null;
        if (!primary_dob) primary_dob = null;

        // Normalize type: 'Person' -> 'Individual' for consistency
        if (type === 'Person') type = 'Individual';

        // If pipeline_id or stage_id is missing, handle default
        if (!pipeline_id || !stage_id) {
            let [pipes] = await pool.query('SELECT id FROM pipelines WHERE user_id = ? ORDER BY id ASC LIMIT 1', [userId]);
            let targetPipelineId = pipeline_id || (pipes.length > 0 ? pipes[0].id : null);

            if (!targetPipelineId) {
                // Create Default Pipeline
                const [result] = await pool.query(
                    'INSERT INTO pipelines (name, status, description, user_id) VALUES (?, ?, ?, ?)',
                    ['Default Pipeline', 'Active', 'Automatically created default pipeline', userId]
                );
                targetPipelineId = result.insertId;

                const stages = [
                    ['New', 'Initial stage', 10, 0, 0],
                    ['Contacted', 'Lead contacted', 30, 0, 1],
                    ['Interested', 'Lead interested', 60, 0, 2],
                    ['Won', 'Lead won', 100, 1, 3]
                ];

                const stageValues = stages.map(s => [targetPipelineId, ...s]);
                await pool.query(
                    'INSERT INTO pipeline_stages (pipeline_id, name, description, probability, is_final, stage_order) VALUES ?',
                    [stageValues]
                );
            }

            pipeline_id = targetPipelineId;

            if (!stage_id) {
                const [stgs] = await pool.query(
                    'SELECT id FROM pipeline_stages WHERE pipeline_id = ? ORDER BY stage_order ASC LIMIT 1',
                    [pipeline_id]
                );
                stage_id = stgs.length > 0 ? stgs[0].id : null;
            }
        }

        // Generate Lead ID (e.g. L001)
        const [rows] = await pool.query('SELECT lead_id FROM leads WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId]);
        let nextId = 'L001';
        if (rows.length > 0 && rows[0].lead_id) {
            const lastId = rows[0].lead_id;
            const num = parseInt(lastId.substring(1)) + 1;
            nextId = 'L' + num.toString().padStart(3, '0');
        }

        // Check for duplicate mobile number
        if (mobile_number) {
            const [duplicates] = await pool.query(
                'SELECT id, lead_id FROM leads WHERE user_id = ? AND mobile_number = ? LIMIT 1',
                [userId, mobile_number]
            );
            if (duplicates.length > 0) {
                tag = 'Duplicate';
                const reason = `Mobile number already exists (Lead ID: ${duplicates[0].lead_id})`;
                data.duplicate_reason = reason;
                // Record duplicate reason on existing lead without changing its status/tag
                await pool.query(
                    'UPDATE leads SET duplicate_reason = ? WHERE mobile_number = ? AND user_id = ?',
                    [`Mobile number duplicated by new Lead: ${nextId}`, mobile_number, userId]
                );
            }
        }

        // Handle custom_fields and contact_persons - ensure they're JSON strings
        const customFieldsJson = typeof custom_fields === 'string' ? custom_fields : JSON.stringify(custom_fields || []);
        const contactPersonsJson = typeof contact_persons === 'string' ? contact_persons : JSON.stringify(contact_persons || []);

        const nextCallDate = data.next_call_at ? new Date(data.next_call_at) : null;

        const [result] = await pool.query(
            `INSERT INTO leads (
                lead_id, name, mobile_number, email, value, pipeline_id, stage_id, 
                status, type, tag, duplicate_reason, location, user_id,
                lead_source, visibility,
                full_name, gender, dob, alt_mobile_number, address, city, state, pincode, interested_in,
                profile_image, whatsapp_number, country,
                organization_name, industry_type, website, company_email, company_phone, gst_pan_number, gst_number,
                org_address, org_city, org_state, org_pincode, company_address, org_country,
                primary_contact_name, primary_dob, designation, primary_mobile, primary_email,
                description, assigned_to, owner_name, referral_mobile, custom_fields, contact_persons, lead_owner, assigner_name, next_call_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nextId, name, mobile_number, email, value || 0, pipeline_id, stage_id,
                status || 'Open', type || 'Individual', tag || 'New Lead', data.duplicate_reason || null, location, userId,
                lead_source, visibility,
                full_name, gender, dob, alt_mobile_number, address, city, state, pincode, interested_in,
                profile_image, whatsapp_number, country,
                organization_name, industry_type, website, company_email, company_phone, gst_pan_number || gst_number, gst_number,
                org_address || company_address, org_city, org_state, org_pincode, company_address, org_country,
                primary_contact_name, primary_dob, designation, primary_mobile, primary_email,
                description, owner || assigned_to, owner_name, referral_mobile, customFieldsJson, contactPersonsJson, lead_owner || null, assigner_name || null,
                nextCallDate, new Date()
            ]
        );
        return result.insertId;
    },

    bulkCreate: async (leadsArray, userId) => {
        if (!leadsArray || leadsArray.length === 0) return 0;

        // 1. Get default pipeline/stage once if needed
        let [pipes] = await pool.query('SELECT id FROM pipelines WHERE user_id = ? ORDER BY id ASC LIMIT 1', [userId]);
        let defaultPipelineId = pipes.length > 0 ? pipes[0].id : null;
        let defaultStageId = null;

        if (defaultPipelineId) {
            const [stgs] = await pool.query('SELECT id FROM pipeline_stages WHERE pipeline_id = ? ORDER BY stage_order ASC LIMIT 1', [defaultPipelineId]);
            defaultStageId = stgs.length > 0 ? stgs[0].id : null;
        }

        // 2. Prepare Lead ID sequence
        const [rows] = await pool.query('SELECT lead_id FROM leads WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId]);
        let lastIdNum = 0;
        if (rows.length > 0 && rows[0].lead_id) {
            lastIdNum = parseInt(rows[0].lead_id.substring(1)) || 0;
        }

        // Fetch existing mobile numbers for duplicate check
        // Fetch existing numbers with their lead IDs for better duplicate reason
        const [existingLeads] = await pool.query('SELECT mobile_number, lead_id FROM leads WHERE user_id = ?', [userId]);
        const existingNumbersMap = new Map(existingLeads.map(l => [l.mobile_number, l.lead_id]));

        const values = leadsArray.map((data, index) => {
            let {
                name, mobile_number, email, value, pipeline_id, stage_id,
                status, type, tag, location, lead_source, visibility,
                full_name, gender, dob, alt_mobile_number, address, city, state, pincode, interested_in,
                profile_image, whatsapp_number, country,
                organization_name, industry_type, website, company_email, company_phone, gst_pan_number, gst_number,
                org_address, org_city, org_state, org_pincode, company_address, org_country,
                primary_contact_name, primary_dob, designation, primary_mobile, primary_email,
                description, owner, assigned_to, owner_name, referral_mobile, custom_fields, contact_persons, lead_owner, assigner_name
            } = data;

            if (!dob) dob = null;
            if (!primary_dob) primary_dob = null;

            const nextId = 'L' + (lastIdNum + index + 1).toString().padStart(3, '0');
            const customFieldsJson = typeof custom_fields === 'string' ? custom_fields : JSON.stringify(custom_fields || []);
            const contactPersonsJson = typeof contact_persons === 'string' ? contact_persons : JSON.stringify(contact_persons || []);

            const leadIdFromMap = mobile_number ? existingNumbersMap.get(mobile_number) : null;
            const isDuplicate = !!leadIdFromMap;
            const finalTag = isDuplicate ? 'Duplicate' : (tag || 'New Lead');
            const dupReason = isDuplicate ? `Mobile number already exists (Lead ID: ${leadIdFromMap})` : null;

            return [
                nextId, name || full_name, mobile_number, email, value || 0, pipeline_id || defaultPipelineId, stage_id || defaultStageId,
                status || 'Open', type || 'Individual', finalTag, dupReason, location, userId,
                lead_source || 'Bulk Upload', visibility || 'Public',
                full_name || name, gender, dob, alt_mobile_number, address || company_address, city, state, pincode, interested_in,
                profile_image, whatsapp_number, country,
                organization_name, industry_type, website, company_email, company_phone, gst_pan_number || gst_number, gst_number,
                org_address || company_address, org_city, org_state, org_pincode, company_address, org_country,
                primary_contact_name, primary_dob, designation, primary_mobile, primary_email,
                description, owner || assigned_to, owner_name, referral_mobile, customFieldsJson, contactPersonsJson, lead_owner || null, assigner_name || null,
                data.next_call_at ? new Date(data.next_call_at) : null,
                new Date()
            ];
        });

        const [result] = await pool.query(
            `INSERT INTO leads (
                lead_id, name, mobile_number, email, value, pipeline_id, stage_id, 
                status, type, tag, duplicate_reason, location, user_id,
                lead_source, visibility,
                full_name, gender, dob, alt_mobile_number, address, city, state, pincode, interested_in,
                profile_image, whatsapp_number, country,
                organization_name, industry_type, website, company_email, company_phone, gst_pan_number, gst_number,
                org_address, org_city, org_state, org_pincode, company_address, org_country,
                primary_contact_name, primary_dob, designation, primary_mobile, primary_email,
                description, assigned_to, owner_name, referral_mobile, custom_fields, contact_persons, lead_owner, assigner_name, next_call_at, created_at
            ) VALUES ?`,
            [values]
        );

        // Update existing leads that now have duplicates
        const duplicateMobileNumbers = leadsArray
            .filter((_, idx) => values[idx][9] === 'Duplicate')
            .map(l => l.mobile_number)
            .filter(Boolean);

        if (duplicateMobileNumbers.length > 0) {
            await pool.query(
                'UPDATE leads SET duplicate_reason = "Duplicated during bulk entry/matching" WHERE user_id = ? AND mobile_number IN (?)',
                [userId, duplicateMobileNumbers]
            );
        }

        return result.affectedRows;
    },

    findAll: async (userId, page = 1, limit = 10, search = '', status = 'All', pipelineId = null, tag = null, type = null, subview = 'All', priority = 'All', services = 'All', dateFrom = null, dateTo = null) => {
        const offset = (page - 1) * limit;
        let query = `
            SELECT l.*, l.lead_owner, p.name as pipeline_name, s.name as stage_name, COALESCE(e.employee_name, l.assigned_to) as employee_name,
            (SELECT COUNT(*) FROM leads l2 WHERE l2.mobile_number = l.mobile_number AND l2.user_id = l.user_id AND l.mobile_number IS NOT NULL AND l.mobile_number != '') as duplicate_count
            FROM leads l
            LEFT JOIN pipelines p ON l.pipeline_id = p.id
            LEFT JOIN pipeline_stages s ON l.stage_id = s.id
            LEFT JOIN employees e ON (l.assigned_to = CAST(e.id AS CHAR) OR l.assigned_to = e.employee_id OR l.assigned_to = e.employee_name)
            WHERE l.user_id = ?
        `;
        const params = [userId];

        // Apply filters
        if (status && status !== 'All') { query += ' AND l.status = ?'; params.push(status); }
        if (tag && tag !== 'All') { query += ' AND l.tag = ?'; params.push(tag); }
        if (type && type !== 'All') { query += ' AND l.type = ?'; params.push(type); }
        if (pipelineId) { query += ' AND l.pipeline_id = ?'; params.push(pipelineId); }
        if (priority && priority !== 'All') { query += ' AND l.priority = ?'; params.push(priority); }
        if (services && services !== 'All') { query += ' AND l.interested_in = ?'; params.push(services); }
        if (dateFrom) { query += ' AND l.created_at >= ?'; params.push(dateFrom); }
        if (dateTo) { query += ' AND l.created_at <= ?'; params.push(dateTo + ' 23:59:59'); }

        if (search) {
            query += ' AND (l.name LIKE ? OR l.email LIKE ? OR l.mobile_number LIKE ?)';
            const term = `%${search}%`;
            params.push(term, term, term);
        }

        // Subview logic
        if (subview === 'new') {
            query += " AND (l.tag = 'Not Contacted' OR l.created_at >= DATE_SUB(NOW(), INTERVAL 2 DAY) OR (l.tag = 'Not Connected' AND l.next_call_at <= NOW()))";
        } else if (subview === 'not-connected') {
            query += " AND l.tag = 'Not Connected' AND (l.next_call_at IS NULL OR l.next_call_at > NOW())";
        } else if (subview === 'follow-up') {
            query += " AND (l.tag = 'Follow Up' OR l.tag = 'Missed')";
        } else if (subview === 'missed') {
            query += " AND l.tag = 'Missed'";
        } else if (subview === 'assigned') {
            query += " AND l.assigned_to IS NOT NULL";
        } else if (subview === 'dropped') {
            query += " AND l.tag IN ('Lost', 'Dropped', 'Lost Lead')";
        } else if (subview === 'trending') {
            query += " AND (l.priority = 'High' OR l.is_trending = 1)";
        } else if (subview === 'won') {
            query += " AND (l.tag = 'Won' OR l.tag = 'Closed' OR s.name = 'Won')";
        } else if (subview === 'duplicates') {
            query += " AND l.tag = 'Duplicate'";
        }

        // Count query construction
        let countQuery = 'SELECT COUNT(*) as total FROM leads l LEFT JOIN pipeline_stages s ON l.stage_id = s.id WHERE l.user_id = ?';
        const countParams = [userId];

        if (status && status !== 'All') { countQuery += ' AND l.status = ?'; countParams.push(status); }
        if (tag && tag !== 'All') { countQuery += ' AND l.tag = ?'; countParams.push(tag); }
        if (type && type !== 'All') { countQuery += ' AND l.type = ?'; countParams.push(type); }
        if (pipelineId) { countQuery += ' AND l.pipeline_id = ?'; countParams.push(pipelineId); }
        if (priority && priority !== 'All') { countQuery += ' AND l.priority = ?'; countParams.push(priority); }
        if (services && services !== 'All') { countQuery += ' AND l.interested_in = ?'; countParams.push(services); }
        if (dateFrom) { countQuery += ' AND l.created_at >= ?'; countParams.push(dateFrom); }
        if (dateTo) { countQuery += ' AND l.created_at <= ?'; countParams.push(dateTo + ' 23:59:59'); }

        if (search) {
            countQuery += ' AND (l.name LIKE ? OR l.email LIKE ? OR l.mobile_number LIKE ?)';
            const term = `%${search}%`;
            countParams.push(term, term, term);
        }

        if (subview === 'new') { countQuery += " AND (l.tag = 'Not Contacted' OR l.created_at >= DATE_SUB(NOW(), INTERVAL 2 DAY) OR (l.tag = 'Not Connected' AND l.next_call_at <= NOW()))"; }
        else if (subview === 'not-connected') { countQuery += " AND l.tag = 'Not Connected' AND (l.next_call_at IS NULL OR l.next_call_at > NOW())"; }
        else if (subview === 'follow-up') { countQuery += " AND (l.tag = 'Follow Up' OR l.tag = 'Missed')"; }
        else if (subview === 'missed') { countQuery += " AND l.tag = 'Missed'"; }
        else if (subview === 'assigned') { countQuery += " AND l.assigned_to IS NOT NULL"; }
        else if (subview === 'dropped') { countQuery += " AND l.tag IN ('Lost', 'Dropped', 'Lost Lead')"; }
        else if (subview === 'trending') { countQuery += " AND (l.priority = 'High' OR l.is_trending = 1)"; }
        else if (subview === 'won') { countQuery += " AND (l.tag = 'Won' OR l.tag = 'Closed' OR s.name = 'Won')"; }
        else if (subview === 'duplicates') { countQuery += " AND l.tag = 'Duplicate'"; }

        const [totalRows] = await pool.query(countQuery, countParams);
        const totalFiltered = totalRows[0].total;

        // Dashboard Summary Stats (scopeless to specific filters but within user_id)
        const [sumRows] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN tag = 'Closed' THEN 1 ELSE 0 END) as converted,
                SUM(CASE WHEN tag = 'Lost' THEN 1 ELSE 0 END) as lost
            FROM leads WHERE user_id = ?
        `, [userId]);

        query += ' ORDER BY l.id DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [leads] = await pool.query(query, params);

        return {
            leads,
            pagination: {
                total: totalFiltered,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalFiltered / limit)
            },
            summary: sumRows[0]
        };
    },

    findById: async (id, userId) => {
        const [rows] = await pool.query(
            `SELECT l.*, l.lead_owner, p.name as pipeline_name, s.name as stage_name, COALESCE(e.employee_name, l.assigned_to) as employee_name,
             (SELECT COUNT(*) FROM leads l2 WHERE l2.mobile_number = l.mobile_number AND l2.user_id = l.user_id AND l.mobile_number IS NOT NULL AND l.mobile_number != '') as duplicate_count
             FROM leads l
             LEFT JOIN pipelines p ON l.pipeline_id = p.id
             LEFT JOIN pipeline_stages s ON l.stage_id = s.id
             LEFT JOIN employees e ON (l.assigned_to = CAST(e.id AS CHAR) OR l.assigned_to = e.employee_id OR l.assigned_to = e.employee_name)
             WHERE l.id = ? AND l.user_id = ?`,
            [id, userId]
        );
        return rows[0];
    },

    update: async (id, data, userId) => {
        // Fetch current lead data to check current tag and mobile number
        const [existingLeads] = await pool.query('SELECT mobile_number, tag, lead_id FROM leads WHERE id = ? AND user_id = ?', [id, userId]);
        if (existingLeads.length === 0) return;
        const currentLead = existingLeads[0];

        const allowedFields = [
            'name', 'mobile_number', 'email', 'value', 'pipeline_id', 'stage_id',
            'status', 'type', 'tag', 'location',
            'lead_source', 'visibility',
            'full_name', 'gender', 'dob', 'alt_mobile_number', 'address', 'city', 'state', 'pincode', 'interested_in',
            'profile_image', 'whatsapp_number', 'country',
            'organization_name', 'industry_type', 'website', 'company_email', 'company_phone', 'gst_pan_number', 'gst_number',
            'org_address', 'org_city', 'org_state', 'org_pincode', 'company_address', 'org_country',
            'primary_contact_name', 'primary_dob', 'designation', 'primary_mobile', 'primary_email',
            'description', 'assigned_to', 'assigned_at', 'is_read', 'priority', 'last_call_at', 'next_call_at', 'call_count',
            'not_connected_count', 'connected_count', 'drop_reason', 'call_success_rate',
            'follow_up_frequency', 'response_quality', 'conversion_probability', 'is_trending',
            'referral_mobile', 'custom_fields', 'contact_persons', 'owner_name', 'lead_owner', 'assigner_name', 'duplicate_reason'
        ];

        // Handle mobile_number change logic
        if (data.mobile_number && data.mobile_number !== currentLead.mobile_number) {
            const [duplicates] = await pool.query(
                'SELECT id, lead_id FROM leads WHERE user_id = ? AND mobile_number = ? AND id != ? LIMIT 1',
                [userId, data.mobile_number, id]
            );

            if (duplicates.length > 0) {
                data.tag = 'Duplicate';
                data.duplicate_reason = `Mobile number already exists (Lead ID: ${duplicates[0].lead_id})`;
            } else if (currentLead.tag === 'Duplicate') {
                // If it was a duplicate and now it's unique, change to New Lead
                data.tag = 'New Lead';
                data.duplicate_reason = null;
            }
        }

        const updates = [];
        const values = [];

        Object.keys(data).forEach(key => {
            if (allowedFields.includes(key)) {
                // Handle JSON fields
                if (key === 'custom_fields' || key === 'contact_persons') {
                    const jsonValue = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key] || []);
                    updates.push(`${key} = ?`);
                    values.push(jsonValue);
                } else if (key === 'next_call_at' && data[key]) {
                    updates.push(`${key} = ?`);
                    values.push(new Date(data[key]));
                } else {
                    updates.push(`${key} = ?`);
                    values.push(data[key]);
                }
            } else if (key === 'owner') {
                updates.push('assigned_to = ?');
                values.push(data[key]);
            }
        });

        if (updates.length === 0) return;

        // If next_call_at is updated, and tag is not manually changed, 
        // ensure 'Missed' leads revert to 'Follow Up'
        if (data.next_call_at && !data.hasOwnProperty('tag')) {
            updates.push("tag = CASE WHEN tag = 'Missed' THEN 'Follow Up' ELSE tag END");
        }

        values.push(id, userId);
        await pool.query(
            `UPDATE leads SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );
    },

    hitCall: async (id, status, nextCallAt, dropReason, userId, createReminder = false, notConnectedReason = null, remarks = null, priority = null, duration = null) => {
        const [lead] = await pool.query('SELECT * FROM leads WHERE id = ? AND user_id = ?', [id, userId]);
        if (!lead.length) throw new Error('Lead not found');

        let { call_count, not_connected_count, connected_count, tag } = lead[0];
        call_count++;

        // Ensure we don't pass undefined to SQL
        const safeReason = notConnectedReason || null;
        const safeRemarks = remarks || null;

        let updateData = {
            call_count,
            last_call_at: new Date(),
            next_call_at: nextCallAt ? new Date(nextCallAt) : null,
            call_remarks: safeRemarks,
            last_call_duration: duration || null
        };

        if (priority) {
            updateData.priority = priority;
        }

        if (status === 'connected') {
            connected_count++;
            updateData.connected_count = connected_count;
            updateData.tag = 'Follow Up';
        } else if (status === 'not_connected') {
            not_connected_count++;
            updateData.not_connected_count = not_connected_count;
            updateData.tag = 'Not Connected';
            updateData.not_connected_reason = safeReason;

            // Auto schedule if not connected (e.g. +2 hours)
            if (!nextCallAt) {
                const retryTime = new Date();
                retryTime.setHours(retryTime.getHours() + 2);
                updateData.next_call_at = retryTime;
            }
        } else if (status === 'dropped') {
            updateData.tag = 'Lost';
            updateData.drop_reason = dropReason || null;
        } else if (status === 'follow_up') {
            updateData.tag = 'Follow Up';
            updateData.next_call_at = nextCallAt || null;
        }

        const updates = Object.keys(updateData).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(updateData), id, userId];

        await pool.query(`UPDATE leads SET ${updates} WHERE id = ? AND user_id = ?`, values);

        // Add to lead_calls history with sanitized status
        const callStatusMap = {
            'connected': 'Connected',
            'not_connected': 'Not Connected',
            'dropped': 'Dropped',
            'follow_up': 'Follow Up'
        };
        const displayStatus = callStatusMap[status] || status;

        await pool.query(
            'INSERT INTO lead_calls (lead_id, user_id, status, call_date, note, duration, created_at) VALUES (?, ?, ?, NOW(), ?, ?, NOW())',
            [id, userId, displayStatus.substring(0, 50), safeRemarks, duration]
        );

        // Create Task Reminder if requested
        if (createReminder && updateData.next_call_at) {
            const nextCall = new Date(updateData.next_call_at);
            const dueDate = nextCall.toISOString().split('T')[0];
            const dueTime = nextCall.toTimeString().split(' ')[0];

            // Build task description
            let taskDesc = "";
            if (safeReason) taskDesc += `Reason: ${safeReason}. `;
            if (safeRemarks) taskDesc += `Remarks: ${safeRemarks}`;
            taskDesc = taskDesc.trim() || null;

            await pool.query(
                `INSERT INTO tasks (user_id, title, description, priority, due_date, due_time, category, status, completed, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())`,
                [
                    userId,
                    `Follow-up call: ${lead[0].name}`,
                    taskDesc,
                    (priority || lead[0].priority || 'medium').toLowerCase(),
                    dueDate,
                    dueTime,
                    'Follow-up',
                    'Pending' // Use default status
                ]
            );
        }

        return updateData;
    },

    analyzeLead: async (id, userId) => {
        const [rows] = await pool.query('SELECT * FROM leads WHERE id = ? AND user_id = ?', [id, userId]);
        if (!rows.length) return;
        const lead = rows[0];

        const totalCalls = lead.call_count || 0;
        const connected = lead.connected_count || 0;
        const successRate = totalCalls > 0 ? (connected / totalCalls) * 100 : 0;

        // Simple conversion probability logic
        let probability = successRate * 0.5;
        if (lead.tag === 'Interested') probability += 20;
        if (lead.tag === 'Follow Up') probability += 10;
        if (lead.priority === 'High') probability += 10;

        probability = Math.min(Math.max(probability, 0), 100);

        const isTrending = probability > 70 ? 1 : 0;

        await pool.query(
            'UPDATE leads SET call_success_rate = ?, conversion_probability = ?, is_trending = ? WHERE id = ?',
            [successRate, probability, isTrending, id]
        );
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM leads WHERE id = ? AND user_id = ?', [id, userId]);
    },

    checkCallConflict: async (userId, dateTime, excludeLeadId = null) => {
        // Check for calls within a 5-minute window (2.5 mins before and after)
        const date = new Date(dateTime);
        const startTime = new Date(date.getTime() - 2.5 * 60000);
        const endTime = new Date(date.getTime() + 2.5 * 60000);

        let query = 'SELECT id, name, next_call_at FROM leads WHERE user_id = ? AND next_call_at BETWEEN ? AND ?';
        let params = [userId, startTime, endTime];

        if (excludeLeadId) {
            query += ' AND id != ?';
            params.push(excludeLeadId);
        }

        const [rows] = await pool.query(query, params);
        return rows;
    },

    getDueReminders: async (userId) => {
        // Get leads where next_call_at is due (within last 1 minute to prevent skipping)
        // and lead is not already Won/Lost/Closed/Missed
        const [rows] = await pool.query(
            `SELECT l.*, p.name as pipeline_name, s.name as stage_name 
             FROM leads l
             LEFT JOIN pipelines p ON l.pipeline_id = p.id
             LEFT JOIN pipeline_stages s ON l.stage_id = s.id
             WHERE l.user_id = ? 
             AND l.next_call_at <= NOW() 
             AND l.tag = 'Follow Up'
             ORDER BY l.next_call_at DESC`,
            [userId]
        );
        return rows;
    },

    snoozeLead: async (id, userId, minutes = 10) => {
        const [lead] = await pool.query('SELECT next_call_at FROM leads WHERE id = ? AND user_id = ?', [id, userId]);
        if (!lead.length) throw new Error('Lead not found');

        let nextCall = lead[0].next_call_at ? new Date(lead[0].next_call_at) : new Date();
        // If the scheduled time is already in the past, snooze from NOW
        if (nextCall < new Date()) {
            nextCall = new Date();
        }
        nextCall.setMinutes(nextCall.getMinutes() + minutes);

        await pool.query(
            'UPDATE leads SET next_call_at = ?, tag = CASE WHEN tag = "Missed" THEN "Follow Up" ELSE tag END WHERE id = ? AND user_id = ?',
            [nextCall, id, userId]
        );
        return nextCall;
    },

    checkMissedLeads: async (userId) => {
        // Automatically change status to 'Missed' if next_call_at is older than 5 minutes
        // and current status is 'Follow Up'
        await pool.query(
            `UPDATE leads 
             SET tag = 'Missed' 
             WHERE user_id = ? 
             AND next_call_at IS NOT NULL 
             AND next_call_at <= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
             AND tag = 'Follow Up'`,
            [userId]
        );
    }
};

module.exports = Lead;
