const { LeaveType, Holiday, LeaveRequest } = require('../models/leaveModel');

// --- Leave Type Controllers ---
const createLeaveType = async (req, res) => {
    try {
        const id = await LeaveType.create(req.body, req.user.id);
        res.status(201).json({ status: true, message: 'Leave type created successfully', id });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getLeaveTypes = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = 'All' } = req.query;
        const result = await LeaveType.findAll(req.user.id, { search, status }, { page, limit });
        res.status(200).json({ status: true, ...result });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const updateLeaveType = async (req, res) => {
    try {
        await LeaveType.update(req.params.id, req.body, req.user.id);
        res.status(200).json({ status: true, message: 'Leave type updated successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const deleteLeaveType = async (req, res) => {
    try {
        await LeaveType.delete(req.params.id, req.user.id);
        res.status(200).json({ status: true, message: 'Leave type deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// --- Holiday Controllers ---
const createHoliday = async (req, res) => {
    try {
        const id = await Holiday.create(req.body, req.user.id);
        res.status(201).json({ status: true, message: 'Holiday created successfully', id });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getHolidays = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const result = await Holiday.findAll(req.user.id, { search }, { page, limit });
        res.status(200).json({ status: true, ...result });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const updateHoliday = async (req, res) => {
    try {
        await Holiday.update(req.params.id, req.body, req.user.id);
        res.status(200).json({ status: true, message: 'Holiday updated successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const deleteHoliday = async (req, res) => {
    try {
        await Holiday.delete(req.params.id, req.user.id);
        res.status(200).json({ status: true, message: 'Holiday deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// --- Leave Request Controllers ---
const applyLeave = async (req, res) => {
    try {
        const id = await LeaveRequest.create(req.body, req.user.id);
        res.status(201).json({ status: true, message: 'Leave application submitted successfully', id });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getLeaveRequests = async (req, res) => {
    try {
        const { status = 'All', search = '', page = 1, limit = 10 } = req.query;
        const result = await LeaveRequest.findAll(req.user.id, { status, search }, { page, limit });
        res.status(200).json({ status: true, ...result });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ status: false, message: 'Invalid status value' });
        }
        await LeaveRequest.updateStatus(req.params.id, status, req.user.id);
        res.status(200).json({ status: true, message: `Leave ${status} successfully` });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const deleteLeaveRequest = async (req, res) => {
    try {
        await LeaveRequest.delete(req.params.id, req.user.id);
        res.status(200).json({ status: true, message: 'Leave request deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    createLeaveType, getLeaveTypes, updateLeaveType, deleteLeaveType,
    createHoliday, getHolidays, updateHoliday, deleteHoliday,
    applyLeave, getLeaveRequests, updateLeaveStatus, deleteLeaveRequest
};
