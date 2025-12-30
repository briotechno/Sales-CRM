const express = require('express');
const router = express.Router();
const { createOrUpdateBusinessInfo, getBusinessInfo } = require('../controllers/businessInfoController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getBusinessInfo)
    .post(protect, upload.single('logo'), createOrUpdateBusinessInfo)
    .put(protect, upload.single('logo'), createOrUpdateBusinessInfo);

module.exports = router;
