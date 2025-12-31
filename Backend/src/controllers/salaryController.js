const Salary = require('../models/salaryModel');

const createSalary = async (req, res) => {
    try {
        const {
            employee_id,
            designation,
            department,
            basic_salary,
            allowances,
            deductions,
            net_salary,
            status,
            pay_date
        } = req.body;

        const salaryId = await Salary.create({
            user_id: req.user.id,
            employee_id,
            designation,
            department,
            basic_salary,
            allowances,
            deductions,
            net_salary,
            status: status || 'pending',
            pay_date
        });

        res.status(201).json({
            id: salaryId,
            message: 'Salary record created successfully'
        });
    } catch (error) {
        console.error('Error creating salary:', error);
        res.status(500).json({ message: 'Error creating salary record' });
    }
};

const getSalaries = async (req, res) => {
    try {
        const { page, limit, search, department } = req.query;
        const data = await Salary.findAll(req.user.id, {
            page,
            limit,
            search,
            department
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching salaries:', error);
        res.status(500).json({ message: 'Error fetching salary records' });
    }
};

const getSalaryById = async (req, res) => {
    try {
        const salary = await Salary.findById(req.params.id, req.user.id);
        if (!salary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }
        res.json(salary);
    } catch (error) {
        console.error('Error fetching salary:', error);
        res.status(500).json({ message: 'Error fetching salary record' });
    }
};

const updateSalary = async (req, res) => {
    try {
        const success = await Salary.update(req.params.id, req.user.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Salary record not found or no changes made' });
        }
        res.json({ message: 'Salary record updated successfully' });
    } catch (error) {
        console.error('Error updating salary:', error);
        res.status(500).json({ message: 'Error updating salary record' });
    }
};

const deleteSalary = async (req, res) => {
    try {
        const success = await Salary.delete(req.params.id, req.user.id);
        if (!success) {
            return res.status(404).json({ message: 'Salary record not found' });
        }
        res.json({ message: 'Salary record deleted successfully' });
    } catch (error) {
        console.error('Error deleting salary:', error);
        res.status(500).json({ message: 'Error deleting salary record' });
    }
};

const getSalaryStats = async (req, res) => {
    try {
        const stats = await Salary.getStats(req.user.id);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching salary stats:', error);
        res.status(500).json({ message: 'Error fetching salary statistics' });
    }
};

module.exports = {
    createSalary,
    getSalaries,
    getSalaryById,
    updateSalary,
    deleteSalary,
    getSalaryStats
};
