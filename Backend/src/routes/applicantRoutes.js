const express = require('express');
const router = express.Router();
const applicantController = require('../controllers/applicantController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for resume uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only PDF and Word documents are allowed!'));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Create upload directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads/resumes/')) {
    fs.mkdirSync('uploads/resumes/', { recursive: true });
}

// Public routes for applicants
router.get('/public/job/:link', applicantController.getJobByLink);
router.post('/public/apply/:link', upload.single('resume'), applicantController.applyForJob);

// Protected routes for HR/Admin
router.get('/', protect, applicantController.getApplicants);
router.get('/stats', protect, applicantController.getApplicantStats);
router.get('/:id', protect, applicantController.getApplicantById);
router.put('/:id/status', protect, applicantController.updateApplicantStatus);
router.delete('/:id', protect, applicantController.deleteApplicant);

module.exports = router;
