const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../config/upload');

// Public routes
router.get('/', galleryController.getAllImages);

// Admin routes
router.post('/', authMiddleware, galleryController.addImage);
router.delete('/:id', authMiddleware, galleryController.deleteImage);

// Specialized upload route
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.json({
        success: true,
        message: 'File uploaded successfully',
        data: {
            url: `uploads/${req.file.filename}`,
            filename: req.file.filename
        }
    });
});

module.exports = router;
