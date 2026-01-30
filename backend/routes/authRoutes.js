const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

// Validation rules
const loginValidation = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const passwordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

// Routes
router.post('/login', loginValidation, validate, authController.login);
router.get('/verify', authMiddleware, authController.verifyToken);
router.post('/change-password', authMiddleware, passwordValidation, validate, authController.changePassword);

module.exports = router;
