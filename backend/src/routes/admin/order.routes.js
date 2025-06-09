const express = require('express');
const router = express.Router();
const { 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  deleteOrder
} = require('../../controllers/admin/order.controller');

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders with pagination and filtering
 * @access  Private/Admin
 */
router.get('/', getOrders);

/**
 * @route   GET /api/admin/orders/:id
 * @desc    Get order by ID
 * @access  Private/Admin
 */
router.get('/:id', getOrderById);

/**
 * @route   PUT /api/admin/orders/:id/status
 * @desc    Update order status
 * @access  Private/Admin
 */
router.put('/:id/status', updateOrderStatus);

/**
 * @route   DELETE /api/admin/orders/:id
 * @desc    Delete an order
 * @access  Private/Admin
 */
router.delete('/:id', deleteOrder);

module.exports = router; 