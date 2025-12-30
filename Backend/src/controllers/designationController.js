const Designation = require('../models/designationModel');

const createDesignation = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data.image = `/uploads/designations/${req.file.filename}`;
        }
        const id = await Designation.create(data);
        res.status(201).json({ status: true, message: 'Designation created successfully', id });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getDesignations = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = 'All', search = '' } = req.query;
        const data = await Designation.findAll(page, limit, status, search);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDesignationById = async (req, res) => {
    try {
        const designation = await Designation.findById(req.params.id);
        if (!designation) {
            return res.status(404).json({ status: false, message: 'Designation not found' });
        }
        res.status(200).json({ status: true, data: designation });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const updateDesignation = async (req, res) => {
    try {
        const designation = await Designation.findById(req.params.id);
        if (!designation) {
            return res.status(404).json({ status: false, message: 'Designation not found' });
        }
        const data = { ...req.body };
        if (req.file) {
            data.image = `/uploads/designations/${req.file.filename}`;
        }
        await Designation.update(req.params.id, data);
        res.status(200).json({ status: true, message: 'Designation updated successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const deleteDesignation = async (req, res) => {
    try {
        const designation = await Designation.findById(req.params.id);
        if (!designation) {
            return res.status(404).json({ status: false, message: 'Designation not found' });
        }
        await Designation.delete(req.params.id);
        res.status(200).json({ status: true, message: 'Designation deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    createDesignation,
    getDesignations,
    getDesignationById,
    updateDesignation,
    deleteDesignation
};
