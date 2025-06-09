const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById } = require('../../../controllers/user/guest/category.controller');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', getCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', getCategoryById);

module.exports = router; 