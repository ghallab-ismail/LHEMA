const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const auth = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Extract extension and convert to lowercase to prevent Invalid Signature errors
    let ext = file.originalname.split('.').pop().toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    
    return {
      folder: 'lhema_products',
      format: ext, // Force lowercase format
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif']
    };
  }
});

const upload = multer({
    storage: storage,
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
        // req.files contains the uploaded files metadata from Cloudinary
        const urls = req.files.map(file => file.path); // 'path' contains the secure Cloudinary URL

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
