const express = require('express');
const router = express.Router();
const donationsController = require('../controllers/donationsController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

// Validation rules
const donationValidation = [
    body('donor_name').notEmpty().withMessage('Name is required'),
    body('amount').isNumeric().withMessage('Valid amount is required'),
    body('email').optional().isEmail().withMessage('Valid email is required')
];

// Public routes
router.post('/', donationValidation, validate, donationsController.submitDonation);

// Admin routes
router.get('/', authMiddleware, donationsController.getAllDonations);
router.get('/stats', authMiddleware, donationsController.getDonationStats);
router.get('/:id', authMiddleware, donationsController.getDonationById);
router.patch('/:id/status', authMiddleware, [
    body('status').notEmpty().withMessage('Status is required')
], validate, donationsController.updateDonationStatus);

module.exports = router;
