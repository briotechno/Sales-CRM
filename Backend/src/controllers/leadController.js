const Lead = require('../models/leadModel');
const LeadResources = require('../models/leadResourcesModel'); // Added
const leadAssignmentService = require('../services/leadAssignmentService');
const LeadAssignmentLog = require('../models/leadAssignmentLogModel');
const LeadAssignmentSettings = require('../models/leadAssignmentSettingsModel');

const createLead = async (req, res) => {
    try {
        const id = await Lead.create(req.body, req.user.id);

        // Handle Auto-Assignment if enabled
        await leadAssignmentService.autoAssign(id, req.user.id);

        // If manual assignment was passed directly (owner/assigned_to)
        if (req.body.owner || req.body.assigned_to) {
            await LeadAssignmentLog.create({
                user_id: req.user.id,
                lead_id: id,
                employee_id: req.body.owner || req.body.assigned_to,
                assigned_by: req.user.username || 'admin',
                assignment_type: 'manual',
                reason: 'Initial Assignment'
            });
        }

        res.status(201).json({ status: true, message: 'Lead created successfully', id });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getLeads = async (req, res) => {
    try {
        const { page, limit, search, status, pipeline_id, tag, type, subview, priority, services, dateFrom, dateTo } = req.query;
        const data = await Lead.findAll(req.user.id, page, limit, search, status, pipeline_id, tag, type, subview, priority, services, dateFrom, dateTo);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id, req.user.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id, req.user.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        await Lead.update(req.params.id, req.body, req.user.id);
        res.status(200).json({ status: true, message: 'Lead updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id, req.user.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        await Lead.delete(req.params.id, req.user.id);
        res.status(200).json({ status: true, message: 'Lead deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const hitCall = async (req, res) => {
    try {
        const userId = req.user.id;
        const leadId = req.params.id;
        const { status, next_call_at, drop_reason, create_reminder } = req.body;

        // Get current lead before update to know current owner
        const currentLead = await Lead.findById(leadId, userId);

        const result = await Lead.hitCall(leadId, status, next_call_at, drop_reason, userId, create_reminder);

        // Auto-analyze after call
        await Lead.analyzeLead(leadId, userId);

        // Auto-Reassignment Check
        if (status === 'not_connected') {
            const settings = await LeadAssignmentSettings.findByUserId(userId);
            const maxAttempts = settings?.max_call_attempts || 5;

            if (result.call_count >= maxAttempts) {
                console.log(`Lead ${leadId} reached max call attempts (${maxAttempts}). Reassigning...`);

                // 1. Mark as unassigned and reset status to fresh
                await Lead.update(leadId, {
                    assigned_to: null,
                    assigned_at: null,
                    tag: 'Not Contacted',
                    call_count: 0,
                    not_connected_count: 0,
                    connected_count: 0,
                    last_call_at: null,
                    next_call_at: null
                }, userId);

                // 2. Log the drop
                await LeadAssignmentLog.create({
                    user_id: userId,
                    lead_id: leadId,
                    employee_id: 0,
                    assigned_by: 'system',
                    assignment_type: 'auto',
                    reassigned_from: currentLead?.assigned_to || null,
                    reason: `Max call attempts reached (${maxAttempts})`
                });

                // 3. Trigger auto-assignment to someone ELSE
                if (settings?.mode === 'auto') {
                    await leadAssignmentService.autoAssign(leadId, userId, currentLead?.assigned_to);
                }
            }
        }

        res.status(200).json({ status: true, message: 'Call status updated', data: result });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const analyzeLead = async (req, res) => {
    try {
        await Lead.analyzeLead(req.params.id, req.user.id);
        res.status(200).json({ status: true, message: 'Lead analysis completed' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getLeadNotes = async (req, res) => {
    try {
        const notes = await LeadResources.getNotes(req.params.id, req.user.id);
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addLeadNote = async (req, res) => {
    try {
        const { title, description } = req.body;
        // Handle files if any (assuming multer middleware populates req.files)
        const files = req.files ? req.files.map(file => ({
            name: file.originalname,
            path: file.path,
            type: file.mimetype,
            size: file.size
        })) : [];

        const result = await LeadResources.addNote({
            lead_id: req.params.id,
            title,
            description,
            files
        }, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeadCalls = async (req, res) => {
    try {
        const calls = await LeadResources.getCalls(req.params.id, req.user.id);
        res.status(200).json(calls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addLeadCall = async (req, res) => {
    try {
        const { status, date, note, followTask } = req.body;
        const result = await LeadResources.addCall({
            lead_id: req.params.id,
            status,
            date,
            note,
            follow_task: followTask === 'true' || followTask === true
        }, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeadFiles = async (req, res) => {
    try {
        const files = await LeadResources.getFiles(req.params.id, req.user.id);
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addLeadFile = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const results = [];
        for (const file of req.files) {
            const result = await LeadResources.addFile({
                lead_id: req.params.id,
                name: file.originalname,
                path: file.path,
                type: file.mimetype,
                size: file.size,
                description: req.body.description
            }, req.user.id);
            results.push(result);
        }

        res.status(201).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeadActivities = async (req, res) => {
    try {
        const activities = await LeadResources.getActivities(req.params.id, req.user.id);
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeadMeetings = async (req, res) => {
    try {
        const meetings = await LeadResources.getMeetings(req.params.id, req.user.id);
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addLeadMeeting = async (req, res) => {
    try {
        const { title, description, date, time, attendees } = req.body;
        const result = await LeadResources.addMeeting({
            lead_id: req.params.id,
            title,
            description,
            date,
            time,
            attendees: Array.isArray(attendees) ? attendees : (attendees ? attendees.split(',').map(s => s.trim()) : [])
        }, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLeadStatus = async (req, res) => {
    try {
        const { status, tag } = req.body;
        const updateData = {};
        if (status) updateData.status = status;
        if (tag) updateData.tag = tag;

        await Lead.update(req.params.id, updateData, req.user.id);
        res.status(200).json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update methods
const updateLeadNote = async (req, res) => {
    try {
        const result = await LeadResources.updateNote(req.params.noteId, req.body, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLeadCall = async (req, res) => {
    try {
        const result = await LeadResources.updateCall(req.params.callId, req.body, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLeadFile = async (req, res) => {
    try {
        const result = await LeadResources.updateFile(req.params.fileId, req.body, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLeadMeeting = async (req, res) => {
    try {
        const { title, description, date, time, attendees } = req.body;
        const result = await LeadResources.updateMeeting(req.params.meetingId, {
            title,
            description,
            date,
            time,
            attendees: Array.isArray(attendees) ? attendees : (attendees ? attendees.split(',').map(s => s.trim()) : [])
        }, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete methods
const deleteLeadNote = async (req, res) => {
    try {
        await LeadResources.deleteNote(req.params.noteId, req.user.id);
        res.status(200).json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLeadCall = async (req, res) => {
    try {
        await LeadResources.deleteCall(req.params.callId, req.user.id);
        res.status(200).json({ message: 'Call deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLeadFile = async (req, res) => {
    try {
        await LeadResources.deleteFile(req.params.fileId, req.user.id);
        res.status(200).json({ message: 'File deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLeadMeeting = async (req, res) => {
    try {
        await LeadResources.deleteMeeting(req.params.meetingId, req.user.id);
        res.status(200).json({ message: 'Meeting deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    hitCall,
    analyzeLead,
    checkCallConflict: async (req, res) => {
        try {
            const { dateTime, excludeId } = req.query;
            if (!dateTime) return res.status(400).json({ message: 'DateTime is required' });

            const conflicts = await Lead.checkCallConflict(req.user.id, dateTime, excludeId);
            res.status(200).json(conflicts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getLeadNotes,
    addLeadNote,
    getLeadCalls,
    addLeadCall,
    getLeadFiles,
    addLeadFile,
    getLeadActivities,
    getLeadMeetings,
    addLeadMeeting,
    updateLeadStatus,
    updateLeadNote,
    updateLeadCall,
    updateLeadFile,
    updateLeadMeeting,
    deleteLeadNote,
    deleteLeadCall,
    deleteLeadFile,
    deleteLeadMeeting,
    bulkCreateLeads: async (req, res) => {
        try {
            const affectedRows = await Lead.bulkCreate(req.body, req.user.id);
            res.status(201).json({ status: true, message: `${affectedRows} leads imported successfully` });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
};
