const { pool } = require('../config/db');

const Lead = {
    create: async (data, userId) => {
        const {
            name, mobile_number, email, value, pipeline_id, stage_id,
            status, type, tag, location,
            lead_source, visibility,
            full_name, gender, dob, alt_mobile_number, address, city, state, pincode, interested_in,
            organization_name, industry_type, website, company_email, company_phone, gst_pan_number,
            org_address, org_city, org_state, org_pincode,
            primary_contact_name, primary_dob, designation, primary_mobile, primary_email,
            description, owner
        } = data;

        // Generate Lead ID (e.g. L001)
        const [rows] = await pool.query('SELECT lead_id FROM leads WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId]);
        let nextId = 'L001';
        if (rows.length > 0 && rows[0].lead_id) {
            const lastId = rows[0].lead_id;
            const num = parseInt(lastId.substring(1)) + 1;
            nextId = 'L' + num.toString().padStart(3, '0');
        }

        const [result] = await pool.query(
            `INSERT INTO leads (
                lead_id, name, mobile_number, email, value, pipeline_id, stage_id, 
                status, type, tag, location, user_id,
                lead_source, visibility,
                full_name, gender, dob, alt_mobile_number, address, city, state, pincode, interested_in,
                organization_name, industry_type, website, company_email, company_phone, gst_pan_number,
                org_address, org_city, org_state, org_pincode,
                primary_contact_name, primary_dob, designation, primary_mobile, primary_email,
                description, assigned_to
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nextId, name, mobile_number, email, value || 0, pipeline_id, stage_id,
                status || 'Open', type || 'Person', tag || 'Not Contacted', location, userId,
                lead_source, visibility,
                full_name, gender, dob, alt_mobile_number, address, city, state, pincode, interested_in,
                organization_name, industry_type, website, company_email, company_phone, gst_pan_number,
                org_address, org_city, org_state, org_pincode,
                primary_contact_name, primary_dob, designation, primary_mobile, primary_email,
                description, owner
            ]
        );
        return result.insertId;
    },

    findAll: async (userId, page = 1, limit = 10, search = '', status = 'All', pipelineId = null, tag = null, type = null, subview = 'All', priority = 'All', services = 'All', dateFrom = null, dateTo = null) => {
        const offset = (page - 1) * limit;
        let query = `
            SELECT l.*, p.name as pipeline_name, s.name as stage_name 
            FROM leads l
            LEFT JOIN pipelines p ON l.pipeline_id = p.id
            LEFT JOIN pipeline_stages s ON l.stage_id = s.id
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
            query += " AND (l.tag = 'Not Contacted' OR l.created_at >= DATE_SUB(NOW(), INTERVAL 2 DAY))";
        } else if (subview === 'assigned') {
            query += " AND l.assigned_to IS NOT NULL";
        } else if (subview === 'unread') {
            query += " AND l.is_read = 0";
        } else if (subview === 'dropped') {
            query += " AND l.tag = 'Lost'";
        } else if (subview === 'trending') {
            query += " AND l.priority = 'High'";
        }

        // Count query construction
        let countQuery = 'SELECT COUNT(*) as total FROM leads l WHERE l.user_id = ?';
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
        if (subview === 'new') { countQuery += " AND (l.tag = 'Not Contacted' OR l.created_at >= DATE_SUB(NOW(), INTERVAL 2 DAY))"; }
        else if (subview === 'assigned') { countQuery += " AND l.assigned_to IS NOT NULL"; }
        else if (subview === 'unread') { countQuery += " AND l.is_read = 0"; }
        else if (subview === 'dropped') { countQuery += " AND l.tag = 'Lost'"; }
        else if (subview === 'trending') { countQuery += " AND l.priority = 'High'"; }

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
            `SELECT l.*, p.name as pipeline_name, s.name as stage_name 
             FROM leads l
             LEFT JOIN pipelines p ON l.pipeline_id = p.id
             LEFT JOIN pipeline_stages s ON l.stage_id = s.id
             WHERE l.id = ? AND l.user_id = ?`,
            [id, userId]
        );
        return rows[0];
    },

    update: async (id, data, userId) => {
        const allowedFields = [
            'name', 'mobile_number', 'email', 'value', 'pipeline_id', 'stage_id',
            'status', 'type', 'tag', 'location',
            'lead_source', 'visibility',
            'full_name', 'gender', 'dob', 'alt_mobile_number', 'address', 'city', 'state', 'pincode', 'interested_in',
            'organization_name', 'industry_type', 'website', 'company_email', 'company_phone', 'gst_pan_number',
            'org_address', 'org_city', 'org_state', 'org_pincode',
            'primary_contact_name', 'primary_dob', 'designation', 'primary_mobile', 'primary_email',
            'description', 'assigned_to'
        ];
        const updates = [];
        const values = [];

        Object.keys(data).forEach(key => {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                values.push(data[key]);
            } else if (key === 'owner') {
                updates.push('assigned_to = ?');
                values.push(data[key]);
            }
        });

        if (updates.length === 0) return;

        values.push(id, userId);
        await pool.query(
            `UPDATE leads SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );
    },

    delete: async (id, userId) => {
        await pool.query('DELETE FROM leads WHERE id = ? AND user_id = ?', [id, userId]);
    }
};

module.exports = Lead;
