const Department = require('../models/departmentModel');

const createDepartment = async (req, res) => {
    try {
        const id = await Department.create(req.body);
        res.status(201).json({ status: true, message: 'Department created successfully', id });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.status(200).json({ status: true, data: departments });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
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
        await Department.update(req.params.id, req.body);
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
