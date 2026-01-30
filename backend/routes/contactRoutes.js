const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');

// Public route
router.post('/', contactController.submitContact);

// Protected admin routes
router.get('/', authMiddleware, contactController.getContacts);
router.patch('/:id/status', authMiddleware, contactController.updateContactStatus);

module.exports = router;
