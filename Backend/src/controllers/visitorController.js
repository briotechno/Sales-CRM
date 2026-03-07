const Visitor = require('../models/visitorModel');
const Employee = require('../models/employeeModel');

const createVisitor = async (req, res) => {
    try {
        const userId = req.user.id;
        const visitor = await Visitor.create(req.body, userId);

        // Mocking notification to employees
        if (req.body.send_reminder && req.body.host_employee_ids) {
            const hostIds = Array.isArray(req.body.host_employee_ids)
                ? req.body.host_employee_ids
                : JSON.parse(req.body.host_employee_ids || '[]');

            console.log(`Notification sent to employees: ${hostIds.join(', ')} about visitor: ${req.body.visitor_name}`);
        }

        res.status(201).json(visitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVisitors = async (req, res) => {
    try {
        const userId = req.user.id;
        const visitors = await Visitor.getAll(userId, req.query);
        res.status(200).json(visitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVisitorById = async (req, res) => {
    try {
        const userId = req.user.id;
        const visitor = await Visitor.getById(req.params.id, userId);
        if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
        res.status(200).json(visitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateVisitor = async (req, res) => {
    try {
        const userId = req.user.id;
        const visitor = await Visitor.update(req.params.id, req.body, userId);
        res.status(200).json(visitor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteVisitor = async (req, res) => {
    try {
        const userId = req.user.id;
        await Visitor.delete(req.params.id, userId);
        res.status(200).json({ message: 'Visitor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDueVisitors = async (req, res) => {
    try {
        // Here we use the employee's ID from the user object if they are an employee
        // Many systems link user.id to employee.id or user.employee_id
        const userId = req.user._id || req.user.id;
        const visitors = await Visitor.getDueVisitors(userId);
        res.status(200).json(visitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVisitor,
    getVisitors,
    getVisitorById,
    updateVisitor,
    deleteVisitor,
    getDueVisitors
};
