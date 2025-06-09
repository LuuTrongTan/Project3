const express = require('express');
const router = express.Router();

// Import các routes
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const reviewRoutes = require('./review.routes');

// Sử dụng các routes
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router; 