const Employee = require('../models/employeeModel');

const createEmployee = async (req, res) => {
    try {
        const id = await Employee.create(req.body);
        res.status(201).json({ status: true, message: 'Employee created successfully', id });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const getEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = await Employee.findAll(page, limit);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ status: false, message: 'Employee not found' });
        }
        res.status(200).json({ status: true, data: employee });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ status: false, message: 'Employee not found' });
        }
        await Employee.update(req.params.id, req.body);
        res.status(200).json({ status: true, message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ status: false, message: 'Employee not found' });
        }
        await Employee.delete(req.params.id);
        res.status(200).json({ status: true, message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
