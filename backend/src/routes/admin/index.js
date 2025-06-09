const express = require('express');
const router = express.Router();

// Import các routes
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');

// Import middleware bảo vệ và kiểm tra vai trò admin
const { protect, authorize } = require('../../middlewares/auth');

// Tất cả các routes admin đều cần đăng nhập và có vai trò admin
router.use(protect);
router.use(authorize('admin'));

// Sử dụng các routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

module.exports = router; 