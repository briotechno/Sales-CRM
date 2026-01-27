const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir = 'uploads/others';

        if (file.fieldname === 'logo') {
            uploadDir = 'uploads/logos';
        } else if (file.fieldname === 'icon') {
            uploadDir = 'uploads/departments';
        } else if (file.fieldname === 'image') {
            uploadDir = req.baseUrl.includes('catalogs') ? 'uploads/catalogs' : 'uploads/designations';
        } else if (['profile_picture', 'profile_image', 'aadhar_front', 'aadhar_back', 'pan_card', 'cancelled_cheque'].includes(file.fieldname)) {
            uploadDir = 'uploads/employees';
        } else if (file.fieldname === 'receipt') {
            uploadDir = 'uploads/expenses';
        } else if (file.fieldname === 'file') {
            uploadDir = 'uploads/messenger';
        }

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const prefix = file.fieldname.replace('_', '-');
        cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Allow almost all common file types for messenger
    if (req.baseUrl.includes('messenger') || file.fieldname === 'file') {
        return cb(null, true);
    }

    // For other modules, keep existing restrictions if necessary
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml', 'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'video/mp4', 'video/webm', 'video/ogg'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, true); // Being flexible as requested
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: fileFilter
});

module.exports = upload;
