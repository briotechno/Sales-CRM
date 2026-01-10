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
        const data = { ...(req.body || {}) };

        // Handle file uploads for employees
        if (req.files) {
            if (req.files.profile_picture) data.profile_picture = `/uploads/employees/${req.files.profile_picture[0].filename}`;
            if (req.files.aadhar_front) data.aadhar_front = `/uploads/employees/${req.files.aadhar_front[0].filename}`;
            if (req.files.aadhar_back) data.aadhar_back = `/uploads/employees/${req.files.aadhar_back[0].filename}`;
            if (req.files.pan_card) data.pan_card = `/uploads/employees/${req.files.pan_card[0].filename}`;
            if (req.files.cancelled_cheque) data.cancelled_cheque = `/uploads/employees/${req.files.cancelled_cheque[0].filename}`;
        }

        if (req.user.role === 'Employee') {
            // Employee Update
            const employee = await Employee.findById(req.user._id, req.user.id);
            if (employee) {
                await Employee.update(req.user._id, data, req.user.id);
                const updatedEmployee = await Employee.findById(req.user._id, req.user.id);
                res.json(updatedEmployee);
            } else {
                res.status(404).json({ message: 'Employee profile not found' });
            }
        } else {
            // Admin Update
            const user = await User.findById(req.user.id);

            if (user) {
                const updated = await User.update(req.user.id, data);
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
