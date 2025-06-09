const express = require('express');
const router = express.Router();

// Import các routes
const userRoutes = require('./user');
const adminRoutes = require('./admin');

// Sử dụng các routes
router.use('/api', userRoutes);
router.use('/api/admin', adminRoutes);

module.exports = router; 