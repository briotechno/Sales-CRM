const Salary = require('../models/salaryModel');

const createSalary = async (req, res) => {
    try {
        const {
            employee_id,
            employee_name,
            designation,
            department,
            basic_salary,
            allowances,
            deductions,
            net_salary,
            status,
            pay_date,
            start_date,
            end_date,
            working_days,
            present_days
        } = req.body;

        // Calculate net salary (pro-rata if present_days is provided)
        const working = parseInt(working_days) || 30;
        const present = (present_days === undefined || present_days === null || present_days === "") ? working : parseInt(present_days);
        const basic = parseFloat(basic_salary) || 0;
        const adjustedBasic = (basic / working) * present;

        const calculatedNetSalary = adjustedBasic + (parseFloat(allowances) || 0) - (parseFloat(deductions) || 0);

        const salaryId = await Salary.create({
            user_id: req.user.id,
            employee_id,
            employee_name,
            designation,
            department,
            basic_salary,
            allowances,
            deductions,
            net_salary: calculatedNetSalary,
            status: status || 'pending',
            pay_date,
            start_date,
            end_date,
            working_days: working,
            present_days: present
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
    console.log(req)
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
        const { id } = req.params;
        const userId = req.user.id;

        // Fetch existing salary to get current values
        const currentSalary = await Salary.findById(id, userId);
        if (!currentSalary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        // Determine values to use for calculation (new value from body or existing value)
        const basicSalary = req.body.basic_salary !== undefined ? parseFloat(req.body.basic_salary) : parseFloat(currentSalary.basic_salary || 0);
        const allowances = req.body.allowances !== undefined ? parseFloat(req.body.allowances) : parseFloat(currentSalary.allowances || 0);
        const deductions = req.body.deductions !== undefined ? parseFloat(req.body.deductions) : parseFloat(currentSalary.deductions || 0);
        const workingDays = req.body.working_days !== undefined ? parseInt(req.body.working_days) : parseInt(currentSalary.working_days || 30);
        const presentDays = req.body.present_days !== undefined ? parseInt(req.body.present_days) :
            (currentSalary.present_days !== undefined && currentSalary.present_days !== null ? parseInt(currentSalary.present_days) : workingDays);

        // Calculate new net salary
        const adjustedBasic = (basicSalary / workingDays) * presentDays;
        const netSalary = adjustedBasic + allowances - deductions;

        // Prepare update data
        const updateData = {
            ...req.body,
            net_salary: netSalary
        };

        const success = await Salary.update(id, userId, updateData);
        if (!success) {
            return res.status(404).json({ message: 'Salary record not found or no changes made' });
        }
        res.json({ message: 'Salary record updated successfully', net_salary: netSalary });
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
