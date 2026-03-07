const Meeting = require('../models/meetingModel');
const LeadResources = require('../models/leadResourcesModel');

const getMeetings = async (req, res) => {
    try {
        const userId = req.user.id;
        const meetings = await Meeting.getAllMeetings(userId, req.query);
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createMeeting = async (req, res) => {
    try {
        const userId = req.user.id;
        const meeting = await Meeting.createGlobalMeeting(req.body, userId);
        res.status(201).json(meeting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMeeting = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await LeadResources.updateMeeting(req.params.id, req.body, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMeeting = async (req, res) => {
    try {
        const userId = req.user.id;
        await LeadResources.deleteMeeting(req.params.id, userId);
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting
};
