const { pool } = require('../config/db');

const LeadResources = {
    // Notes
    getNotes: async (leadId, userId) => {
        const [rows] = await pool.query(
            `SELECT ln.*, CONCAT(u.firstName, ' ', u.lastName) as created_by, u.profile_picture 
             FROM lead_notes ln 
             LEFT JOIN users u ON ln.user_id = u.id 
             WHERE ln.lead_id = ? AND ln.user_id = ? 
             ORDER BY ln.created_at DESC`,
            [leadId, userId]
        );
        return rows;
    },

    addNote: async (data, userId) => {
        const { lead_id, title, description, files } = data;
        // files might be JSON string or handled separately. For now assumed passed as string/json if text.
        // If files are uploaded, handled in controller.
        const [result] = await pool.query(
            'INSERT INTO lead_notes (lead_id, user_id, title, description, files, created_at) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP())',
            [lead_id, userId, title, description, JSON.stringify(files || [])]
        );
        return { id: result.insertId, ...data, created_at: new Date() };
    },

    // Calls
    getCalls: async (leadId, userId) => {
        const [rows] = await pool.query(
            `SELECT lc.*, CONCAT(u.firstName, ' ', u.lastName) as created_by, u.profile_picture 
             FROM lead_calls lc 
             LEFT JOIN users u ON lc.user_id = u.id 
             WHERE lc.lead_id = ? AND lc.user_id = ? 
             ORDER BY lc.created_at DESC`,
            [leadId, userId]
        );
        return rows;
    },

    addCall: async (data, userId) => {
        const { lead_id, status, date, note, follow_task, duration } = data;
        const [result] = await pool.query(
            'INSERT INTO lead_calls (lead_id, user_id, status, call_date, note, follow_task, duration, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())',
            [lead_id, userId, status, date, note, follow_task ? 1 : 0, duration || null]
        );
        return { id: result.insertId, ...data, created_at: new Date() };
    },

    // Files
    getFiles: async (leadId, userId) => {
        const [rows] = await pool.query(
            `SELECT lf.*, CONCAT(u.firstName, ' ', u.lastName) as uploaded_by, u.profile_picture 
             FROM lead_files lf 
             LEFT JOIN users u ON lf.user_id = u.id 
             WHERE lf.lead_id = ? AND lf.user_id = ? 
             ORDER BY lf.created_at DESC`,
            [leadId, userId]
        );
        return rows;
    },

    addFile: async (data, userId) => {
        const { lead_id, name, path, type, size, description } = data;
        const [result] = await pool.query(
            'INSERT INTO lead_files (lead_id, user_id, name, path, type, size, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())',
            [lead_id, userId, name, path, type, size, description || '']
        );
        return { id: result.insertId, ...data, created_at: new Date() };
    },

    // Activities (Combined)
    getActivities: async (leadId, userId) => {
        // Union of notes, calls, files, and meetings to show timeline with user details
        const [notes] = await pool.query(
            `SELECT ln.id, "note" as type, ln.title, ln.description, ln.created_at, ln.user_id, 
             CONCAT(u.firstName, ' ', u.lastName) as user_name, u.profile_picture
             FROM lead_notes ln 
             LEFT JOIN users u ON ln.user_id = u.id 
             WHERE ln.lead_id = ? AND ln.user_id = ?`,
            [leadId, userId]
        );
        const [calls] = await pool.query(
            `SELECT lc.id, "call" as type, lc.status as title, lc.note as description, lc.created_at, lc.user_id, 
             CONCAT(u.firstName, ' ', u.lastName) as user_name, u.profile_picture, lc.duration
             FROM lead_calls lc 
             LEFT JOIN users u ON lc.user_id = u.id 
             WHERE lc.lead_id = ? AND lc.user_id = ?`,
            [leadId, userId]
        );
        const [files] = await pool.query(
            `SELECT lf.id, "file" as type, lf.name as title, lf.description, lf.created_at, lf.user_id, 
             CONCAT(u.firstName, ' ', u.lastName) as user_name, u.profile_picture
             FROM lead_files lf 
             LEFT JOIN users u ON lf.user_id = u.id 
             WHERE lf.lead_id = ? AND lf.user_id = ?`,
            [leadId, userId]
        );
        const [meetings] = await pool.query(
            `SELECT lm.id, "meeting" as type, lm.title, lm.description, lm.created_at, lm.user_id, 
             CONCAT(u.firstName, ' ', u.lastName) as user_name, u.profile_picture
             FROM lead_meetings lm 
             LEFT JOIN users u ON lm.user_id = u.id 
             WHERE lm.lead_id = ? AND lm.user_id = ?`,
            [leadId, userId]
        );

        const activities = [...notes, ...calls, ...files, ...meetings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return activities;
    },

    // Meetings
    getMeetings: async (leadId, userId) => {
        const [rows] = await pool.query(
            `SELECT lm.*, CONCAT(u.firstName, ' ', u.lastName) as created_by, u.profile_picture 
             FROM lead_meetings lm 
             LEFT JOIN users u ON lm.user_id = u.id 
             WHERE lm.lead_id = ? AND lm.user_id = ? 
             ORDER BY lm.meeting_date DESC, lm.meeting_time DESC`,
            [leadId, userId]
        );
        return rows;
    },

    addMeeting: async (data, userId) => {
        const { lead_id, title, description, date, time, attendees } = data;
        const [result] = await pool.query(
            'INSERT INTO lead_meetings (lead_id, user_id, title, description, meeting_date, meeting_time, attendees, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())',
            [lead_id, userId, title, description, date, time, JSON.stringify(attendees || [])]
        );
        return { id: result.insertId, ...data, created_at: new Date() };
    },

    // Update methods
    updateNote: async (noteId, data, userId) => {
        const { title, description } = data;
        await pool.query(
            'UPDATE lead_notes SET title = ?, description = ? WHERE id = ? AND user_id = ?',
            [title, description, noteId, userId]
        );
        return { id: noteId, ...data };
    },

    updateCall: async (callId, data, userId) => {
        const { status, date, note, follow_task, duration } = data;
        await pool.query(
            'UPDATE lead_calls SET status = ?, call_date = ?, note = ?, follow_task = ?, duration = ? WHERE id = ? AND user_id = ?',
            [status, date, note, follow_task ? 1 : 0, duration || null, callId, userId]
        );
        return { id: callId, ...data };
    },

    updateFile: async (fileId, data, userId) => {
        const { description } = data;
        await pool.query(
            'UPDATE lead_files SET description = ? WHERE id = ? AND user_id = ?',
            [description, fileId, userId]
        );
        return { id: fileId, ...data };
    },

    updateMeeting: async (meetingId, data, userId) => {
        const { title, description, date, time, attendees } = data;
        await pool.query(
            'UPDATE lead_meetings SET title = ?, description = ?, meeting_date = ?, meeting_time = ?, attendees = ? WHERE id = ? AND user_id = ?',
            [title, description, date, time, JSON.stringify(attendees || []), meetingId, userId]
        );
        return { id: meetingId, ...data };
    },

    // Delete methods
    deleteNote: async (noteId, userId) => {
        await pool.query('DELETE FROM lead_notes WHERE id = ? AND user_id = ?', [noteId, userId]);
        return { id: noteId };
    },

    deleteCall: async (callId, userId) => {
        await pool.query('DELETE FROM lead_calls WHERE id = ? AND user_id = ?', [callId, userId]);
        return { id: callId };
    },

    deleteFile: async (fileId, userId) => {
        await pool.query('DELETE FROM lead_files WHERE id = ? AND user_id = ?', [fileId, userId]);
        return { id: fileId };
    },

    deleteMeeting: async (meetingId, userId) => {
        await pool.query('DELETE FROM lead_meetings WHERE id = ? AND user_id = ?', [meetingId, userId]);
        return { id: meetingId };
    },

    checkMeetingConflict: async (userId, date, time, excludeMeetingId = null) => {
        // Check for meetings at the exact same date and time (or within a 15-minute window)
        // For simplicity, let's check for the exact same date and time first as requested
        let query = 'SELECT id, title, meeting_date, meeting_time FROM lead_meetings WHERE user_id = ? AND meeting_date = ? AND meeting_time = ?';
        let params = [userId, date, time];

        if (excludeMeetingId) {
            query += ' AND id != ?';
            params.push(excludeMeetingId);
        }

        const [rows] = await pool.query(query, params);
        return rows;
    },

    getDueMeetings: async (userId) => {
        // Get meetings due within the last 5 minutes that haven't been completed/cancelled
        // and link with lead info
        const [rows] = await pool.query(
            `SELECT lm.*, l.name as lead_name, l.lead_id as lead_identifier, l.type as lead_type, l.priority as lead_priority
             FROM lead_meetings lm
             LEFT JOIN leads l ON lm.lead_id = l.id
             WHERE lm.user_id = ? 
             AND lm.meeting_date = CURRENT_DATE()
             AND lm.meeting_time BETWEEN DATE_SUB(CURRENT_TIME(), INTERVAL 5 MINUTE) AND CURRENT_TIME()
             ORDER BY lm.meeting_time DESC`,
            [userId]
        );
        return rows;
    }
};

module.exports = LeadResources;
