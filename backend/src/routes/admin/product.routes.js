const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct
} = require('../../controllers/admin/product.controller');

/**
 * @route   GET /api/admin/products
 * @desc    Get all products with pagination, sorting and filtering
 * @access  Private/Admin
 */
router.get('/', getProducts);

/**
 * @route   GET /api/admin/products/:id
 * @desc    Get product by ID
 * @access  Private/Admin
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/admin/products
 * @desc    Create a product
 * @access  Private/Admin
 */
router.post('/', createProduct);

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update a product
 * @access  Private/Admin
 */
router.put('/:id', updateProduct);

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete a product
 * @access  Private/Admin
 */
router.delete('/:id', deleteProduct);

module.exports = router; 