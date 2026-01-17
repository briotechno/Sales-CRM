const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Employee = require('../models/employeeModel');
const Enterprise = require('../models/enterpriseModel');
const generateToken = require('../utils/generateToken');
const ProductKey = require('../models/productKeyModel');
const Plan = require('../models/planModel');
const Subscription = require('../models/subscriptionModel');
const BusinessInfo = require('../models/businessInfoModel');

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
        password,
        productKey
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

        // 1. Create User entry (Admin)
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
            let finalPlan = 'Starter';
            let keyData = null;

            if (productKey) {
                keyData = await ProductKey.findByKey(productKey);
                if (!keyData) {
                    return res.status(400).json({ status: false, message: 'Invalid product key' });
                }
                if (keyData.status === 'Active' || keyData.status === 'Used') {
                    return res.status(400).json({ status: false, message: 'Product key already used' });
                }
                finalPlan = keyData.plan;
            }

            // 2. Create Enterprise entry
            const enterpriseId = await Enterprise.create({
                admin_id: userId,
                firstName,
                lastName,
                email,
                mobileNumber,
                businessName,
                businessType,
                gst,
                address,
                plan: finalPlan,
                status: 'Active',
                onboardingDate: new Date()
            });

            // 2.1 Create initial BusinessInfo entry
            await BusinessInfo.createOrUpdate({
                user_id: userId,
                company_name: businessName,
                legal_name: businessName,
                business_type: businessType,
                email: email,
                phone: mobileNumber,
                gst_number: gst,
                street_address: address
            });

            // 3. If product key was used, activate subscription immediately
            if (keyData) {
                const planDetails = await Plan.findByName(finalPlan);
                const expiryDate = new Date();

                // Validity is like "1 Month", "3 Months", "1 Year"
                if (keyData.validity === '1 Month') expiryDate.setMonth(expiryDate.getMonth() + 1);
                else if (keyData.validity === '3 Months') expiryDate.setMonth(expiryDate.getMonth() + 3);
                else if (keyData.validity === '1 Year') expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                else expiryDate.setMonth(expiryDate.getMonth() + 1); // Default

                await Subscription.create({
                    enterprise_id: enterpriseId,
                    name: businessName,
                    plan: finalPlan,
                    status: 'Active',
                    users: keyData.users || (planDetails ? planDetails.default_users : 0),
                    amount: planDetails ? planDetails.price : 0,
                    billingCycle: keyData.validity === '1 Year' ? 'Yearly' : 'Monthly',
                    onboardingDate: new Date(),
                    expiryDate: expiryDate,
                    leads: planDetails ? planDetails.monthly_leads : 0,
                    storage: planDetails ? planDetails.default_storage : 0,
                    features: []
                });

                // Mark key as Active/Used
                await ProductKey.updateStatusByKey(productKey, 'Active', enterpriseId);
            }

            const token = generateToken(userId, 'Admin');

            res.status(201).json({
                status: true,
                message: 'User registered successfully',
                token,
                user: {
                    _id: userId,
                    enterpriseId,
                    firstName,
                    lastName,
                    email,
                    mobileNumber,
                    businessName,
                    businessType,
                    gst,
                    address,
                    role: 'Admin',
                    planActivated: !!keyData // Flag for frontend redirection
                },
            });
        } else {
            res.status(400).json({
                status: false,
                message: 'Invalid user data'
            });
        }
    } catch (error) {
        console.error('Signup error:', error);
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
