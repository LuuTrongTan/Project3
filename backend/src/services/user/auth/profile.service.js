const { User } = require('../../../models');
const bcrypt = require('bcryptjs');

/**
 * Cập nhật thông tin người dùng
 * @param {number} userId - ID của người dùng
 * @param {Object} profileData - Dữ liệu cập nhật
 * @returns {Object} Thông tin người dùng đã cập nhật
 */
const updateUserProfile = async (userId, profileData) => {
  const { fullName, phoneNumber, avatar } = profileData;
  
  // Find user
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Update fields
  if (fullName) user.fullName = fullName;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (avatar) user.avatar = avatar;
  
  await user.save();
  
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    avatar: user.avatar,
    role: user.role
  };
};

/**
 * Đổi mật khẩu người dùng
 * @param {number} userId - ID của người dùng
 * @param {string} currentPassword - Mật khẩu hiện tại
 * @param {string} newPassword - Mật khẩu mới
 * @returns {boolean} Kết quả thay đổi mật khẩu
 */
const changeUserPassword = async (userId, currentPassword, newPassword) => {
  // Find user
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }
  
  // Update password
  user.password = newPassword;
  await user.save();
  
  return true;
};

/**
 * Vô hiệu hóa tài khoản người dùng
 * @param {number} userId - ID của người dùng
 * @returns {boolean} Kết quả vô hiệu hóa
 */
const deactivateAccount = async (userId) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Instead of deleting, deactivate the account
  user.isActive = false;
  await user.save();
  
  return true;
};

/**
 * Upload avatar cho người dùng
 * @param {number} userId - ID của người dùng
 * @param {string} avatarUrl - URL của avatar
 * @returns {Object} Thông tin avatar đã cập nhật
 */
const uploadUserAvatar = async (userId, avatarUrl) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  user.avatar = avatarUrl;
  await user.save();
  
  return {
    avatar: user.avatar
  };
};

module.exports = {
  updateUserProfile,
  changeUserPassword,
  deactivateAccount,
  uploadUserAvatar
}; 