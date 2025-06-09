const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../../../controllers/user/guest/product.controller');

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination, sorting, and filtering
 * @access  Public
 */
router.get('/', getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', getProductById);

module.exports = router; 