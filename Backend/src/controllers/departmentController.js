const Department = require('../models/departmentModel');

const createDepartment = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data.icon = `/uploads/departments/${req.file.filename}`;
        }
        const id = await Department.create(data);
        res.status(201).json({ status: true, message: 'Department created successfully', id });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getDepartments = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = 'All', search = '' } = req.query;
        const data = await Department.findAll(page, limit, status, search);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ status: false, message: 'Department not found' });
        }
        res.status(200).json({ status: true, data: department });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ status: false, message: 'Department not found' });
        }
        const data = { ...req.body };
        if (req.file) {
            data.icon = `/uploads/departments/${req.file.filename}`;
        }
        await Department.update(req.params.id, data);
        res.status(200).json({ status: true, message: 'Department updated successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ status: false, message: 'Department not found' });
        }
        await Department.delete(req.params.id);
        res.status(200).json({ status: true, message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};
