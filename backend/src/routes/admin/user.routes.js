const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  createUser,
  updateUser,
  deleteUser,
  changeUserStatus
} = require('../../controllers/admin/user.controller');

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filtering
 * @access  Private/Admin
 */
router.get('/', getUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get('/:id', getUserById);

/**
 * @route   POST /api/admin/users
 * @desc    Create a new user
 * @access  Private/Admin
 */
router.post('/', createUser);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user details
 * @access  Private/Admin
 */
router.put('/:id', updateUser);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Private/Admin
 */
router.delete('/:id', deleteUser);

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Change user active status
 * @access  Private/Admin
 */
router.put('/:id/status', changeUserStatus);

module.exports = router; 