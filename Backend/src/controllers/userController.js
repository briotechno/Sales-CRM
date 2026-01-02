const User = require('../models/userModel');
const Employee = require('../models/employeeModel');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        let profile;
        if (req.user.role === 'Employee') {
            // Fetch employee profile
            // req.user._id is the Employee PK, req.user.id is the User (Admin) PK (tenant)
            // But Employee.findById(id, userId) expects Employee PK and Admin PK
            profile = await Employee.findById(req.user._id, req.user.id);
            if (!profile) {
                // Fallback if not found (shouldn't happen if token valid)
                return res.status(404).json({ message: 'Employee profile not found' });
            }
        } else {
            // Fetch admin profile
            profile = await User.findById(req.user.id);
            if (!profile) {
                return res.status(404).json({ message: 'User not found' });
            }
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        if (req.user.role === 'Employee') {
            // Employee Update
            // Check if profile exists
            const employee = await Employee.findById(req.user._id, req.user.id);
            if (employee) {
                // For now, restrict what employees can update if needed, but here we pass body
                // Employee.update(id, data, userId)
                await Employee.update(req.user._id, req.body, req.user.id);
                const updatedEmployee = await Employee.findById(req.user._id, req.user.id);
                res.json(updatedEmployee);
            } else {
                res.status(404).json({ message: 'Employee profile not found' });
            }
        } else {
            // Admin Update
            const user = await User.findById(req.user.id);

            if (user) {
                const updated = await User.update(req.user.id, req.body);
                if (updated) {
                    const updatedUser = await User.findById(req.user.id);
                    res.json({
                        ...updatedUser,
                        // Optional: regenerate token if info in token changes
                    });
                } else {
                    // Even if no rows affect (e.g. same data), return current
                    res.json(user);
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
};
