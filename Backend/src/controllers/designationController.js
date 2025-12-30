const Designation = require('../models/designationModel');

const createDesignation = async (req, res) => {
    try {
        const id = await Designation.create(req.body);
        res.status(201).json({ status: true, message: 'Designation created successfully', id });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getDesignations = async (req, res) => {
    try {
        const designations = await Designation.findAll();
        res.status(200).json({ status: true, data: designations });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
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
        await Designation.update(req.params.id, req.body);
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
