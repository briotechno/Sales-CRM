const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

const profileUploadFields = [
    { name: 'profile_picture', maxCount: 1 },
    { name: 'aadhar_front', maxCount: 1 },
    { name: 'aadhar_back', maxCount: 1 },
    { name: 'pan_card', maxCount: 1 },
    { name: 'cancelled_cheque', maxCount: 1 }
];

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, upload.fields(profileUploadFields), updateUserProfile);

module.exports = router;
