const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
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
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                status: true,
                message: 'Login successful',
                token: generateToken(user.id),
                user: {
                    _id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    mobileNumber: user.mobileNumber,
                    businessName: user.businessName,
                    businessType: user.businessType,
                    gst: user.gst,
                    address: user.address
                },

            });
        } else {
            res.status(401).json({
                status: false,
                message: 'Invalid email or password'
            });
        }
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
