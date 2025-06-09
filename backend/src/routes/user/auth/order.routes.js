const express = require('express');
const router = express.Router();
const { 
  getOrders, 
  getOrderById, 
  createOrder,
  cancelOrder
} = require('../../../controllers/user/auth/order.controller');
const { protect } = require('../../../middlewares/auth');

/**
 * @route   GET /api/orders
 * @desc    Get all orders of current user
 * @access  Private
 */
router.get('/', protect, getOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', protect, getOrderById);

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', protect, createOrder);

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel an order
 * @access  Private
 */
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router; 