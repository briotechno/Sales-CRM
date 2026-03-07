const { pool } = require('../config/db');

class Meeting {
    static async getAllMeetings(userId, query = {}) {
        const { status, type } = query;
        let sql = `
            SELECT lm.*, l.name as lead_name, l.lead_id as lead_identifier
            FROM lead_meetings lm
            LEFT JOIN leads l ON lm.lead_id = l.id
            WHERE lm.user_id = ?
        `;
        const params = [userId];

        if (type && type !== 'All') {
            sql += ' AND lm.meeting_type = ?';
            params.push(type);
        }

        sql += ' ORDER BY lm.meeting_date DESC, lm.meeting_time DESC';
        const [rows] = await pool.query(sql, params);
        return rows;
    }

    static async createGlobalMeeting(data, userId) {
        // Allowing meeting without lead_id (NULL)
        const {
            title, description, date, time, attendees, meeting_type,
            send_whatsapp_reminder, meeting_link, address_line1, address_line2,
            city, state, pincode, lead_id
        } = data;

        const [result] = await pool.query(
            `INSERT INTO lead_meetings (
                title, description, meeting_date, meeting_time, attendees, 
                meeting_type, send_whatsapp_reminder, meeting_link, 
                address_line1, address_line2, city, state, pincode, 
                user_id, lead_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, description || null, date || null, time || null,
                JSON.stringify(attendees || []), meeting_type || 'Online',
                send_whatsapp_reminder ? 1 : 0, meeting_link || null,
                address_line1 || null, address_line2 || null, city || null,
                state || null, pincode || null, userId, lead_id || null
            ]
        );
        return { id: result.insertId, ...data };
    }
}

module.exports = Meeting;
