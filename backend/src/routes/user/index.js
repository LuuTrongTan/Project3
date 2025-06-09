const express = require('express');
const router = express.Router();

// Import các routes
const guestRoutes = require('./guest');
const authRoutes = require('./auth');

// Sử dụng các routes
router.use('/', guestRoutes); // Routes không cần đăng nhập
router.use('/', authRoutes); // Routes cần đăng nhập

module.exports = router; 