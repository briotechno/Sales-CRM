const Job = require('../models/jobModel');

const createJob = async (req, res) => {
    try {
        const {
            title,
            department,
            location,
            type,
            positions,
            description,
            responsibilities,
            requirements,
            status,
            posted_date
        } = req.body;

        const jobId = await Job.create({
            user_id: req.user.id,
            title,
            department,
            location,
            type,
            positions,
            description,
            responsibilities,
            requirements,
            status: status || 'Active',
            posted_date: posted_date || new Date()
        });

        res.status(201).json({
            id: jobId,
            message: 'Job posting created successfully'
        });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Error creating job posting' });
    }
};

const getJobs = async (req, res) => {
    try {
        const { page, limit, search, status } = req.query;
        const data = await Job.findAll(req.user.id, {
            page,
            limit,
            search,
            status
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching job postings' });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id, req.user.id);
        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }
        res.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ message: 'Error fetching job posting' });
    }
};

const updateJob = async (req, res) => {
    try {
        const success = await Job.update(req.params.id, req.user.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Job posting not found or no changes made' });
        }
        res.json({ message: 'Job posting updated successfully' });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Error updating job posting' });
    }
};

const deleteJob = async (req, res) => {
    try {
        const success = await Job.delete(req.params.id, req.user.id);
        if (!success) {
            return res.status(404).json({ message: 'Job posting not found' });
        }
        res.json({ message: 'Job posting deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Error deleting job posting' });
    }
};

const getJobStats = async (req, res) => {
    try {
        const stats = await Job.getStats(req.user.id);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching job stats:', error);
        res.status(500).json({ message: 'Error fetching job statistics' });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobStats
};
