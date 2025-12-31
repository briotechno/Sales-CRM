const express = require('express');
const router = express.Router();
const hrPolicyController = require('../controllers/hrPolicyController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/policies');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/', protect, upload.single('document'), hrPolicyController.createPolicy);
router.get('/', protect, hrPolicyController.getAllPolicies);
router.get('/:id', protect, hrPolicyController.getPolicyById);
router.put('/:id', protect, upload.single('document'), hrPolicyController.updatePolicy);
router.delete('/:id', protect, hrPolicyController.deletePolicy);

module.exports = router;
