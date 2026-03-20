const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-random-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const safeName = file.originalname
            .replace(ext, '')
            .replace(/[^a-zA-Z0-9]/g, '_')
            .substring(0, 50);
        cb(null, `${uniqueSuffix}-${safeName}${ext}`);
    }
});

// File filter: only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max per file
    }
});

// @route   POST /api/upload
// @desc    Upload one or more images
// @access  Private (Admin)
router.post('/', auth, upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: 'No files uploaded' });
        }

        // Return an array of URLs for the uploaded files
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const urls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);

        res.json({ urls });
    } catch (err) {
        console.error('Upload error:', err.message);
        res.status(500).json({ msg: 'Upload failed' });
    }
});

// Error handling for multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ msg: 'File too large. Maximum size is 10MB.' });
        }
        return res.status(400).json({ msg: err.message });
    }
    if (err) {
        return res.status(400).json({ msg: err.message });
    }
    next();
});

module.exports = router;
