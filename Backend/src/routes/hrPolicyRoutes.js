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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only documents (PDF, DOC, DOCX, XLS, XLSX, TXT) are allowed'));
        }
    }
});

router.post('/', protect, upload.array('documents', 10), hrPolicyController.createPolicy);
router.get('/', protect, hrPolicyController.getAllPolicies);
router.get('/:id', protect, hrPolicyController.getPolicyById);
router.put('/:id', protect, upload.array('documents', 10), hrPolicyController.updatePolicy);
router.delete('/:id', protect, hrPolicyController.deletePolicy);

module.exports = router;
