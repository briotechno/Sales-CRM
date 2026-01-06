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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, SVG and PDF are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

module.exports = upload;
