const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile,
  updatePassword,
  deleteProfile,
  uploadAvatar
} = require('../../../controllers/user/auth/profile.controller');
const { protect } = require('../../../middlewares/auth');

/**
 * @route   GET /api/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/', protect, getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', protect, updateProfile);

/**
 * @route   PUT /api/profile/password
 * @desc    Update password
 * @access  Private
 */
router.put('/password', protect, updatePassword);

/**
 * @route   DELETE /api/profile
 * @desc    Delete user profile
 * @access  Private
 */
router.delete('/', protect, deleteProfile);

/**
 * @route   POST /api/profile/avatar
 * @desc    Upload avatar
 * @access  Private
 */
router.post('/avatar', protect, uploadAvatar);

module.exports = router;