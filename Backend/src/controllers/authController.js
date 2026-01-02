const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Employee = require('../models/employeeModel');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        mobileNumber,
        businessName,
        businessType,
        gst,
        address,
        password
    } = req.body;

    try {
        const userExists = await User.findByEmail(email);

        if (userExists) {
            return res.status(400).json({
                status: false,
                message: 'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = await User.create({
            firstName,
            lastName,
            email,
            mobileNumber,
            businessName,
            businessType,
            gst,
            address,
            password: hashedPassword,
        });

        if (userId) {
            res.status(201).json({
                status: true,
                message: 'User registered successfully',
                user: {
                    _id: userId,
                    firstName,
                    lastName,
                    email,
                    mobileNumber,
                    businessName,
                    businessType,
                    gst,
                    address
                },

            });
        } else {
            res.status(400).json({
                status: false,
                message: 'Invalid user data'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, username, password } = req.body;
    const identifier = email || username;

    try {
        // 1. Super Admin Check
        const SUPER_ADMIN_USER = process.env.SUPER_ADMIN_USER || 'superadmin';
        const SUPER_ADMIN_PASS = process.env.SUPER_ADMIN_PASS || 'password123';

        if (identifier === SUPER_ADMIN_USER && password === SUPER_ADMIN_PASS) {
            return res.json({
                status: true,
                message: 'Super Admin Login successful',
                token: generateToken('SUPER_ADMIN_ID', 'Super Admin'),
                user: {
                    role: 'Super Admin',
                    username: SUPER_ADMIN_USER
                }
            });
        }

        // 2. Admin Check (User table)
        // Users are identified by email
        if (email) {
            const user = await User.findByEmail(email);
            if (user && (await bcrypt.compare(password, user.password))) {
                return res.json({
                    status: true,
                    message: 'Login successful',
                    token: generateToken(user.id, user.role || 'Admin'),
                    user: {
                        _id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        mobileNumber: user.mobileNumber,
                        businessName: user.businessName,
                        businessType: user.businessType,
                        gst: user.gst,
                        address: user.address,
                        role: user.role || 'Admin'
                    },
                });
            }
        }

        // 3. Employee Check
        // Employees identified by username (or email if we want to support that)
        const employee = await Employee.findByUsername(identifier);

        // Note: Assuming employee passwords will be hashed moving forward. 
        // If legacy passwords are plain text, this might fail unless we check.
        // For now, implementing bcrypt compare assuming we update creation logic.
        if (employee) {
            const isMatch = await bcrypt.compare(password, employee.password);
            // Fallback for plain text if match fails (optional, for backward compatibility during dev)
            const isPlainMatch = employee.password === password;

            if (isMatch || isPlainMatch) {
                return res.json({
                    status: true,
                    message: 'Employee Login successful',
                    token: generateToken(employee.id, 'Employee'),
                    user: {
                        _id: employee.id, // The Employee PK
                        employee_id: employee.employee_id, // The EMP ID string
                        name: employee.employee_name,
                        username: employee.username,
                        email: employee.email,
                        role: 'Employee',
                        permissions: employee.permissions ? (typeof employee.permissions === 'string' ? JSON.parse(employee.permissions) : employee.permissions) : [],
                        user_id: employee.user_id // The Admin ID
                    }
                });
            }
        }

        res.status(401).json({
            status: false,
            message: 'Invalid email/username or password' // Generic message
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    authUser,
};
