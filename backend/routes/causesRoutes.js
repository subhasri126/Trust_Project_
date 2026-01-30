const express = require('express');
const router = express.Router();
const causesController = require('../controllers/causesController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', causesController.getAllCauses);
router.get('/:id', causesController.getCauseById);

// Admin routes
router.get('/admin/list', authMiddleware, causesController.getAllCausesAdmin);
router.post('/', authMiddleware, causesController.createCause);
router.put('/:id', authMiddleware, causesController.updateCause);
router.delete('/:id', authMiddleware, causesController.deleteCause);
router.patch('/:id/toggle', authMiddleware, causesController.toggleCauseStatus);

module.exports = router;
