const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', homeController.getHomeContent);

// Admin routes
router.put('/', authMiddleware, homeController.updateHomeContent);

module.exports = router;
