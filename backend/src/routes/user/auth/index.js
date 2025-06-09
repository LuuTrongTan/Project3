const express = require('express');
const router = express.Router();

// Import các routes
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const orderRoutes = require('./order.routes');

// Sử dụng các routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/orders', orderRoutes);

module.exports = router; 