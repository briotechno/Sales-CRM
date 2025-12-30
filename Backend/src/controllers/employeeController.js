const Employee = require('../models/employeeModel');

const createEmployee = async (req, res) => {
    try {
        const data = { ...req.body };

        // Handle file uploads
        if (req.files) {
            if (req.files.profile_picture) {
                data.profile_picture = `/uploads/employees/${req.files.profile_picture[0].filename}`;
            }
            if (req.files.aadhar_front) {
                data.aadhar_front = `/uploads/employees/${req.files.aadhar_front[0].filename}`;
            }
            if (req.files.aadhar_back) {
                data.aadhar_back = `/uploads/employees/${req.files.aadhar_back[0].filename}`;
            }
            if (req.files.pan_card) {
                data.pan_card = `/uploads/employees/${req.files.pan_card[0].filename}`;
            }
            if (req.files.cancelled_cheque) {
                data.cancelled_cheque = `/uploads/employees/${req.files.cancelled_cheque[0].filename}`;
            }
        }

        const id = await Employee.create(data);
        res.status(201).json({ status: true, message: 'Employee created successfully', id });
    } catch (error) {
        console.error('Create Employee Error:', error);
        res.status(500).json({ status: false, message: error.message });
    }
};

const getEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = 'All', search = '' } = req.query;
        const data = await Employee.findAll(page, limit, status, search);
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

        const data = { ...req.body };

        // Handle file uploads
        if (req.files) {
            if (req.files.profile_picture) {
                data.profile_picture = `/uploads/employees/${req.files.profile_picture[0].filename}`;
            }
            if (req.files.aadhar_front) {
                data.aadhar_front = `/uploads/employees/${req.files.aadhar_front[0].filename}`;
            }
            if (req.files.aadhar_back) {
                data.aadhar_back = `/uploads/employees/${req.files.aadhar_back[0].filename}`;
            }
            if (req.files.pan_card) {
                data.pan_card = `/uploads/employees/${req.files.pan_card[0].filename}`;
            }
            if (req.files.cancelled_cheque) {
                data.cancelled_cheque = `/uploads/employees/${req.files.cancelled_cheque[0].filename}`;
            }
        }

        await Employee.update(req.params.id, data);
        res.status(200).json({ status: true, message: 'Employee updated successfully' });
    } catch (error) {
        console.error('Update Employee Error:', error);
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
