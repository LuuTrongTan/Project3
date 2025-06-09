const express = require('express');
const router = express.Router();
const { getProductReviews } = require('../../../controllers/user/guest/review.controller');

/**
 * @route   GET /api/reviews/product/:productId
 * @desc    Get all reviews for a product
 * @access  Public
 */
router.get('/product/:productId', getProductReviews);

module.exports = router; 